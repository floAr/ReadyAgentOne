// Game event types
export interface Player {
    userId: string;
    username: string;
}

export interface WorldTick {
    text: "WORLD_TICK";
    players: Player[];
}

export const PLAYER_ENTER_EVENT = "PLAYER_ENTER";
export const PLAYER_EXIT_EVENT = "PLAYER_EXIT";
export const PLAYER_WON_EVENT = "PLAYER_WON";
export const GAME_COMPLETED_EVENT = "GAME_COMPLETED";

export type EventName =
    | typeof PLAYER_ENTER_EVENT
    | typeof PLAYER_EXIT_EVENT
    | typeof PLAYER_WON_EVENT
    | typeof GAME_COMPLETED_EVENT
    | string;

export interface WorldEventBase {
    text: "WORLD_EVENT";
    event: EventName;
    eventData: object;
}

export interface PlayerEnterEvent extends WorldEventBase {
    event: typeof PLAYER_ENTER_EVENT;
    eventData: Player;
}

export interface PlayerExitEvent extends WorldEventBase {
    event: typeof PLAYER_EXIT_EVENT;
    eventData: Player;
}

export interface PlayerWonEvent extends WorldEventBase {
    event: typeof PLAYER_WON_EVENT;
    eventData: PlayerWonEventData;
}

export interface PlayerWonEventData {
    player: Player;
    score: number;
    game: string;
}

export interface GameCompletedEvent extends WorldEventBase {
    event: typeof GAME_COMPLETED_EVENT;
    eventData: GameCompletedEventData;
}

export interface GameCompletedEventData {
    rank: Player[];
    game: string;
    duration: number;
}

export interface CustomWorldEvent extends WorldEventBase {
    event: string;
    eventData: object;
}

export type WorldEvent = PlayerEnterEvent | PlayerExitEvent | PlayerWonEvent | CustomWorldEvent;

export type WorldMessage = WorldTick | WorldEvent;

// Chat types
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    username?: string;
}