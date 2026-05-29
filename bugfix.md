# Bugfix: duplicate user session in multiplayer lobby

## Summary

A logged-in user could join the **same** multiplayer race twice by opening a
second browser tab. The two tabs would desync: only one could send progress,
the lobby roster diverged between tabs, and the player ended up rendered as two
cars. This fix rejects the second tab at matchmaking time and tells it why.

## Symptoms (as reported)

- **Scenario 1** — Account A creates a race; Account B joins from tab 1, then
  again from tab 2. Both tabs are accepted into the same room; the race starts
  with Account B twice. Only one tab sends position updates; the other only
  receives.
- **Scenario 2** — Account B creates from tab 1, joins again from tab 2, then
  Account A joins. In the lobby only tab 2 sees Account A; tab 1 (the creator)
  sees nothing. At race start tab 1 finally sees Account A. During the race
  tab 1 can watch every car move in real time but its own input does nothing.

## Root cause

The backend keys each participant by a string `pid`. For a logged-in user that
pid is `u<userId>` (`game.service.ts`, `makePid`) — the **same value for every
tab of the same account**.

`assign()` only guarded against the same **socket** rejoining (via `isInRoom`,
which is keyed by `socketId`). It never checked whether the **user** was already
in a room. So when tab 2 connected (a new socket → new `socketId`) and joined:

```ts
room.players.set(p.pid, p)          // 'u42' key — OVERWRITES tab 1's entry
this.socketToRoom.set(p.socketId, room.id)
```

- `room.players` is a `Map` keyed by `pid`, so tab 2 **overwrote** tab 1's
  participant. The map now holds only tab 2's `socketId`.
- Both sockets had already done `socket.join(roomId)`, so both stayed in the
  Socket.IO room.

That single overwrite explains every symptom:

| Symptom | Cause |
|---|---|
| Only one tab sends progress | `updateProgress`/`handleFinish` find the participant via `participantOf(room, socketId)`, which matches by `socketId`. Only the last-stored socket (tab 2) matches; tab 1's `player_progress` silently no-ops. |
| Lobby roster diverges between tabs | `emitLobbyUpdate` iterates `room.players` and emits per-`socketId`. Only tab 2's socket is in the map, so tab 1 never receives `lobby_update`. |
| Tab 1 "comes back" at race start | `race_start` / `race_update` are sent with `server.to(roomId)` — a room-level broadcast. Both sockets are in the SIO room, so both receive broadcasts even though only one is in `players`. |
| Player rendered as two cars | Client-side view artifact of the duplicated `pid` across the two tabs. |

## Fix

Chosen approach: **reject the second tab; never disturb the active tab.**

### Backend — `srcs/requirements/backend/src/game/game.service.ts`

- Added an `AssignResult` union returned by `assign()`:
  `{ status: 'joined'; room }` | `{ status: 'busy' }` | `{ status: 'duplicate_session' }`.
- Added a private `userInRoom(userId)` helper that scans all rooms for a
  **live** `user` participant (`socketId !== null`) with that id. Mid-race
  leavers have a nulled `socketId`, so they don't falsely block a fresh join.
- `assign()` now returns `{ status: 'duplicate_session' }` when a logged-in
  user is already live in a room, before any participant is created or any room
  state mutates. The active tab is untouched.

### Backend — `srcs/requirements/backend/src/game/game.gateway.ts`

- `handleJoinQueue` consumes the new `AssignResult`. On `joined` it does
  `client.join(room.id)` as before; on `duplicate_session` it emits
  `join_rejected` (`{ reason: 'duplicate_session' }`) to the refused socket and
  does **not** join it to the room.

### Frontend — `srcs/requirements/frontend/src/hooks/useRaceSocket.ts`

- Added a `rejected` state (reset in `resetState`).
- Added a `join_rejected` listener that records the reason, sets phase back to
  `idle`, and tears the socket down. Exposed `rejected` from the hook.

### Frontend — `srcs/requirements/frontend/src/pages/Play.tsx`

- When `race.rejected` is set, render an error banner (instead of sitting on the
  "connecting…" screen) with a button back to the menu.

### i18n — `en` / `fr` / `es` (`src/features/i18n/locales/*/pages.json`)

- Added `play.already_in_game` and `play.join_failed` strings.

## Files changed

```
srcs/requirements/backend/src/game/game.service.ts
srcs/requirements/backend/src/game/game.gateway.ts
srcs/requirements/frontend/src/hooks/useRaceSocket.ts
srcs/requirements/frontend/src/pages/Play.tsx
srcs/requirements/frontend/src/features/i18n/locales/en/pages.json
srcs/requirements/frontend/src/features/i18n/locales/fr/pages.json
srcs/requirements/frontend/src/features/i18n/locales/es/pages.json
```

## Verification

- Backend `tsc --noEmit`: clean.
- Frontend `tsc -b`: the edited files produce **zero** new errors. The other
  errors `tsc -b` reports (in `chat/`, `friends/`, `Register.tsx`, and backend
  DTOs missing `@nestjs/swagger` / `NodeJS` types) are **pre-existing** —
  confirmed by stashing this change and reproducing the identical error set on
  the clean baseline.
- Not yet manually verified in the browser. To test live, restart the backend
  (`docker restart backend`) and reproduce both scenarios; the second tab should
  now be refused with the "already in a race in another tab" banner.

## Notes / scope

- Guests are unaffected: each guest gets a random `pid` (`g<rand>`), so two
  guest tabs are genuinely distinct players — the rule is intentionally limited
  to `kind === 'user'`.
- This is an in-memory check against the live `rooms` map; no schema or
  persistence changes.
