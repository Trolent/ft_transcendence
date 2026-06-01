import { useState, useEffect, useRef, useCallback } from "react";
// @ts-ignore
import { io, Socket } from "socket.io-client";
import { getToken } from "@/features/auth";
import type {
	ParticipantKind,
	LobbyUpdatePayload,
	RaceStartPayload,
	RaceUpdatePayload,
	RaceFinishedPayload,
	YouFinishedPayload,
	RaceResult,
} from "@backend/game/game.types";

// Re-export the contract shapes so the UI can consume them from one place.
export type {
	ParticipantKind,
	LobbyParticipant,
	RaceResult,
	RaceStartPayload,
	RaceFinishedPayload,
} from "@backend/game/game.types";

// Live per-participant race state, keyed by pid. Seeded from the lobby roster
// and updated by `race_update` broadcasts.
export type Racer = {
	pid: string;
	username: string;
	kind: ParticipantKind;
	avatarUrl: string | null;
	progress: number; // 0..1
	wpm: number;
};

export type RacePhase = "idle" | "waiting" | "countdown" | "racing" | "finished";

export function useRaceSocket() {
	const socketRef = useRef<Socket | null>(null);
	// When this client saw the green light (its own clock), to time the finish
	// free of network latency.
	const raceStartClientRef = useRef<number | null>(null);

	const [phase, setPhase]               = useState<RacePhase>("idle");
	const [connected, setConnected]       = useState(false);
	const [you, setYou]                   = useState<string | null>(null);
	const [matchText, setMatchText]       = useState<string | null>(null);
	const [countdownEndsAt, setCountdownEndsAt] = useState<number | null>(null);
	const [startedAt, setStartedAt]       = useState<number | null>(null);
	const [playerCount, setPlayerCount]   = useState<number>(0);
	const [racers, setRacers]             = useState<Record<string, Racer>>({});
	const [results, setResults]           = useState<RaceResult[] | null>(null);
	const [myPosition, setMyPosition]     = useState<number | null>(null);
	const [rejected, setRejected]         = useState<string | null>(null);

	const teardown = useCallback(() => {
		const s = socketRef.current;
		if (s) {
			s.removeAllListeners();
			s.disconnect();
			socketRef.current = null;
		}
		setConnected(false);
	}, []);

	const resetState = useCallback(() => {
		setPhase("idle");
		setYou(null);
		setMatchText(null);
		setCountdownEndsAt(null);
		setStartedAt(null);
		setPlayerCount(0);
		setRacers({});
		setResults(null);
		setMyPosition(null);
		setRejected(null);
	}, []);

	// Connect, join matchmaking and wire all server -> client events.
	const joinQueue = useCallback(() => {
		teardown();
		resetState();
		raceStartClientRef.current = null;

		// Logged-in players authenticate by JWT; logged-out players join as a
		// guest (the server tags them "Guest" — results are never saved).
		const token = getToken();
		const socket: Socket = io("/game", {
			auth: token ? { token } : { guest: true },
			autoConnect: true,
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 5,
		});
		socketRef.current = socket;

		socket.on("connect", () => {
			setConnected(true);
			setPhase("waiting");
			socket.emit("join_queue");
		});

		socket.on("connect_error", (err: any) => {
			console.error("Game socket connect_error:", err);
		});

		socket.on("disconnect", () => {
			setConnected(false);
		});

		// Server refused this socket (e.g. this account is already racing in
		// another tab). Tear down and surface why; the active tab is untouched.
		socket.on("join_rejected", (payload: { reason: string }) => {
			setRejected(payload?.reason ?? "rejected");
			setPhase("idle");
			teardown();
		});

		socket.on("lobby_update", (payload: LobbyUpdatePayload) => {
			setYou(payload.you);
			setMatchText(payload.text);
			setCountdownEndsAt(payload.phase === "countdown" ? payload.countdownEndsAt : null);
			setPhase(payload.phase === "countdown" ? "countdown" : "waiting");
			// Seed racers from the roster so every car shows up before the first
			// race_update arrives.
			setRacers((prev) => {
				const next: Record<string, Racer> = {};
				for (const p of payload.players) {
					next[p.pid] = prev[p.pid] ?? {
						pid: p.pid,
						username: p.username,
						kind: p.kind,
						avatarUrl: p.avatarUrl,
						progress: 0,
						wpm: 0,
					};
				}
				return next;
			});
		});

		socket.on("race_start", (payload: RaceStartPayload) => {
			raceStartClientRef.current = Date.now();
			setStartedAt(payload.startedAt);
			setPlayerCount(payload.playerCount);
			setCountdownEndsAt(null);
			setPhase("racing");
		});

		// Our own placement, the instant we finish (before the race fully ends).
		socket.on("you_finished", (payload: YouFinishedPayload) => {
			setMyPosition(payload.position);
			setPlayerCount(payload.playerCount);
		});

		socket.on("race_update", (payload: RaceUpdatePayload) => {
			setRacers((prev) => ({
				...prev,
				[payload.pid]: {
					pid: payload.pid,
					username: payload.username,
					kind: payload.kind,
					avatarUrl: prev[payload.pid]?.avatarUrl ?? null,
					progress: payload.progress,
					wpm: payload.wpm,
				},
			}));
		});

		socket.on("race_finished", (payload: RaceFinishedPayload) => {
			setResults(payload.results);
			setPlayerCount(payload.playerCount);
			setPhase("finished");
		});

	}, [teardown, resetState]);

	// Tell the server we left; disconnect tears the socket down.
	const leaveQueue = useCallback(() => {
		const s = socketRef.current;
		if (s && s.connected) s.emit("leave_queue");
		teardown();
		resetState();
	}, [teardown, resetState]);

	// Report correct-char count + current accuracy to the server (chars is an
	// idempotent total, not a delta). The backend consumes chars today; accuracy
	// is included in the payload for a teammate to persist.
	const sendProgress = useCallback((chars: number, accuracy: number) => {
		const s = socketRef.current;
		if (!s || !s.connected) return;
		const durationMs = raceStartClientRef.current != null ? Date.now() - raceStartClientRef.current : 0;
		s.emit("player_progress", { chars, accuracy, durationMs });
	}, []);

	// Tear the socket down when the consuming component unmounts.
	useEffect(() => () => { teardown(); }, [teardown]);

	return {
		phase,
		connected,
		you,
		matchText,
		countdownEndsAt,
		startedAt,
		playerCount,
		racers,
		results,
		myPosition,
		rejected,
		joinQueue,
		leaveQueue,
		sendProgress,
	};
}
