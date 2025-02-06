import React, { useEffect, useRef, useState } from 'react';
import { Scroll, Users, Sparkles, Book, Feather, Wand2, Crown, Terminal } from 'lucide-react';
import { GAME_COMPLETED_EVENT, Player, PLAYER_ENTER_EVENT, PLAYER_EXIT_EVENT, PLAYER_WON_EVENT } from '../types/types';
import WebSocketComponent from './WebSocket';


interface SidebarProps {
    endpoint: string;
    onEndpointChange: (endpoint: string) => void;
    onSendEvent: (event: any) => void;
    currentPlayer: Player;
    onPlayerChange: (player: Player) => void;
}


export default function Sidebar({
    endpoint,
    onEndpointChange,
    onSendEvent,
    currentPlayer,
    onPlayerChange,
}: SidebarProps) {
    const [chatStatus, setChatStatus] = useState('');
    const [wsStatus, setWsStatus] = useState('');

    const handlePlayerEnter = () => {
        onSendEvent({
            text: 'WORLD_EVENT',
            event: PLAYER_ENTER_EVENT,
            eventData: currentPlayer,
        });
    };

    const handlePlayerExit = () => {
        onSendEvent({
            text: 'WORLD_EVENT',
            event: PLAYER_EXIT_EVENT,
            eventData: currentPlayer,
        });
    };

    const handlePlayerWon = () => {
        onSendEvent({
            text: 'WORLD_EVENT',
            event: PLAYER_WON_EVENT,
            eventData: {
                player: currentPlayer,
                score: 100,
                game: 'Sample Game',
            },
        });
    };

    const handleGameCompleted = () => {
        onSendEvent({
            text: 'WORLD_EVENT',
            event: GAME_COMPLETED_EVENT,
            eventData: {
                rank: [currentPlayer],
                game: 'Sample Game',
                duration: 300,
            },
        });
    };

    const setLocalEndpoint = async () => {
        const chatEndpoint = 'http://localhost:3000/readyagentone';
        const wsEndpoint = 'ws://localhost:3000';
        setChatStatus('Pending...');
        setWsStatus('Pending...');
        const chatConnected = await validateEndpoint(chatEndpoint);
        const wsConnected = await validateWebSocket(wsEndpoint);
        onEndpointChange(chatEndpoint);
        if (chatConnected) {
            setChatStatus('Chat connected successfully');
        } else {
            setChatStatus('Failed to connect to chat');
        }
        if (wsConnected) {
            setWsStatus('WebSocket connected successfully');
        } else {
            setWsStatus('Failed to connect to WebSocket');
        }
    };

    const setDeployedEndpoint = async () => {
        const chatEndpoint = 'https://readyagentone-production.up.railway.app/readyagentone';
        const wsEndpoint = 'wss://readyagentone-production.up.railway.app';
        setChatStatus('Pending...');
        setWsStatus('Pending...');
        const chatConnected = await validateEndpoint(chatEndpoint);
        const wsConnected = await validateWebSocket(wsEndpoint);
        onEndpointChange(chatEndpoint);
        if (chatConnected) {
            setChatStatus('Chat connected successfully');
        } else {
            setChatStatus('Failed to connect to chat');
        }
        if (wsConnected) {
            setWsStatus('WebSocket connected successfully');
        } else {
            setWsStatus('Failed to connect to WebSocket');
        }
    };

    const validateEndpoint = async (url: string) => {
        try {
            const response = await fetch(url, { method: 'POST', body: null });
            return response.status === 200;
        } catch (error) {
            return false;
        }
    };

    const validateWebSocket = (url: string) => {
        return new Promise((resolve) => {
            const ws = new WebSocket(url);
            ws.onopen = () => {
                console.log('WebSocket connected');
                ws.close();
                resolve(true);
            };
            ws.onerror = () => {
                console.error('WebSocket connection error');
                resolve(false);
            };
        });
    };

    return (
        <div className="w-80 p-6 flex flex-col h-screen ancient-border scroll-texture">
            <div className="flex items-center gap-2 mb-8">
                <Book className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl text-purple-300 rune-text">Arcane Grimoire</h2>
            </div>

            <div className="space-y-6 flex-1 flex flex-col">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm rune-text text-purple-400">
                        <Scroll className="w-4 h-4" />
                        Ethereal Gateway
                    </label>
                    <div className="flex space-x-2">
                        <button
                            onClick={setLocalEndpoint}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 ancient-button text-purple-300"
                        >
                            Local
                        </button>
                        <button
                            onClick={setDeployedEndpoint}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 ancient-button text-purple-300"
                        >
                            Deployed
                        </button>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        <p>{chatStatus}</p>
                        <p>{wsStatus}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm rune-text text-purple-400">
                        <Feather className="w-4 h-4" />
                        Mystic Identity
                    </label>
                    <input
                        type="text"
                        value={currentPlayer.username}
                        onChange={(e) => onPlayerChange({ ...currentPlayer, username: e.target.value })}
                        className="w-full px-3 py-2 ancient-input text-purple-100 ancient-text mb-2"
                        placeholder="True Name"
                    />
                    <input
                        type="text"
                        value={currentPlayer.userId}
                        onChange={(e) => onPlayerChange({ ...currentPlayer, userId: e.target.value })}
                        className="w-full px-3 py-2 ancient-input text-purple-100 ancient-text"
                        placeholder="Sigil Mark"
                    />
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm rune-text text-purple-400 mb-3">Events</h3>
                    <button
                        onClick={handlePlayerEnter}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 ancient-button text-purple-300"
                    >
                        <Sparkles size={18} /> Player Enter
                    </button>
                    <button
                        onClick={handlePlayerExit}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 ancient-button text-purple-300"
                    >
                        <Book size={18} /> Player Exit
                    </button>
                    <button
                        onClick={handlePlayerWon}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 ancient-button text-purple-300"
                    >
                        <Wand2 size={18} /> Player Won
                    </button>
                    <button
                        onClick={handleGameCompleted}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 ancient-button text-purple-300"
                    >
                        <Crown size={18} /> Game Completed
                    </button>
                </div>

                <WebSocketComponent endpoint={endpoint} />
            </div>
        </div>
    );
}