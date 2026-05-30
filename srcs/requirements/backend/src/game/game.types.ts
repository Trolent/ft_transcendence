// ===========================================================================
//  Multiplayer race — shared domain types & the client<->server event contract
//
//  The frontend mirrors the payload types below (see useRaceSocket). Keep the
//  two in sync. Participants are identified by a string `pid` (NOT userId),
//  because bots and guests have no user id.
// ===========================================================================

export type ParticipantKind = 'user' | 'guest' | 'bot';

export type RoomPhase = 'waiting' | 'countdown' | 'racing' | 'finished';

// Per-bot pacing state, populated by the bot engine.
export type BotState = {
	targetWpm: number; // chars/min-derived target this race
	charsFloat: number; // fractional char accumulator between ticks
	pace: number; // current speed multiplier, drifts each tick for human-like surges
};

export type Participant = {
	pid: string; // canonical id within a room: `u<userId>` | `g<rand>` | `b<n>`
	kind: ParticipantKind;
	socketId: string | null; // null for bots
	userId: number | null; // set only for kind === 'user'
	username: string;
	avatarUrl: string | null;
	// live race progress
	chars: number;
	progress: number; // 0..1
	wpm: number;
	finished: boolean;
	finishedAt: number | null;
	lastProgressAt?: number; // last accepted progress msg, for rate-limiting
	bot?: BotState;
};

export type RoomState = {
	id: string;
	matchId: number; // 0 until the Match row is created (at race start)
	phase: RoomPhase;
	text: string;
	players: Map<string, Participant>; // keyed by pid
	hostPid: string | null;
	playerCount: number; // locked when the race starts (humans + bots + guests)
	// timers
	waitTimer: NodeJS.Timeout | null; // 5s "waiting for players" window
	countdownTimer: NodeJS.Timeout | null; // 10s pre-race countdown
	countdownEndsAt: number | null;
	startedAt: number | null;
	raceTimeout: NodeJS.Timeout | null; // hard cap on race duration
	botTicker: NodeJS.Timeout | null; // bot-engine interval
};

// ---------------------------------------------------------------------------
//  Event contract
// ---------------------------------------------------------------------------

// Client -> Server
//   'join_queue'      : (no payload) enter matchmaking; identity from socket auth/guest
//   'leave_queue'     : (no payload) leave current lobby/queue
//   'player_progress' : { chars: number } correct-chars typed so far this race

// Shared shapes for Server -> Client payloads

export type LobbyParticipant = {
	pid: string;
	kind: ParticipantKind;
	username: string;
	avatarUrl: string | null;
};

// 'lobby_update' — emitted whenever lobby membership or phase changes.
export type LobbyUpdatePayload = {
	lobbyId: string;
	phase: 'waiting' | 'countdown';
	players: LobbyParticipant[];
	you: string; // recipient's own pid
	hostPid: string | null;
	text: string; // chosen at lobby creation so clients can preload
	countdownEndsAt: number | null; // epoch ms; null while phase === 'waiting'
};

// 'race_start' — the countdown reached 0 and typing is now live.
export type RaceStartPayload = {
	roomId: string;
	startedAt: number; // epoch ms
	playerCount: number; // denominator for the final "x / N"
};

// 'race_update' — a participant's live progress (humans and bots).
export type RaceUpdatePayload = {
	pid: string;
	username: string;
	kind: ParticipantKind;
	progress: number; // 0..1
	wpm: number;
};

// 'race_finished' — final standings for everyone in the room.
export type RaceResult = {
	pid: string;
	username: string;
	kind: ParticipantKind;
	position: number; // 1-based
	wpm: number;
};

export type RaceFinishedPayload = {
	results: RaceResult[];
	playerCount: number;
};

// 'you_finished' — sent only to the player who just crossed the line, so their
// placement can show immediately. Position is final the instant you finish
// (anyone still racing can only place behind you). race_finished still follows.
export type YouFinishedPayload = {
	position: number; // 1-based
	playerCount: number;
};

