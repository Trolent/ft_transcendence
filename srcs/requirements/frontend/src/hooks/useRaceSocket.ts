import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { getToken } from "@/auth";

export type LobbyPlayer = {
	userId:		number;
	username:	string;
	avatarUrl:	string | null;
};

export type RaceResult = {
	userId:		number;
	username:	string;
	wpm:		number;
	position:	number;
};

export type Opponent = {
	userId:		number;
	username: 	string;
	avatarUrl:	string | null;
	progress:	number;
	wpm:		number;
};

type RacePhase = "idle" | "waiting" | "countdown" | "racing" | "finished";

export function useRaceSocket() {
	const socketRef = useRef<Socket | null>(null);

 	const [phase, setPhase]               = useState<RacePhase>("idle");
	const [lobbyPlayers, setLobbyPlayers] = useState<LobbyPlayer[]>([]);
	const [timerEndsAt, setTimerEndsAt]   = useState<number | null>(null);
	const [matchText, setMatchText]       = useState<string | null>(null);
	const [opponents, setOpponents]       = useState<Opponent[]>([]);
	const [countdown, setCountdown]       = useState<number | null>(null);
	const [results, setResults]           = useState<RaceResult[] | null>(null);
}