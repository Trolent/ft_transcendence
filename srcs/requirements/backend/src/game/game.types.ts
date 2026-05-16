export type RoomPhase = 'waiting' | 'countdown' | 'racing' | 'finished';

export type RoomPlayer = {
    socketId:   string
    userId:     number
    username:   string
    avatarUrl:  string | null
    chars:      number
    progress:   number
    wpm:        number
    finished:   boolean
    finishedAt: number | null
}

export type RoomState = {
    id:         string
    matchId:    number
    phase:      RoomPhase
    text:       string
    players:    Map<string,RoomPlayer>
    maxPlayers: number
    startedAt:  number | null
    countdown:  NodeJS.Timeout | null
    raceTimeout: NodeJS.Timeout | null
}