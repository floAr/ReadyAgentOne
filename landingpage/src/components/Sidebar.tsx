import React, { useEffect, useRef } from 'react';
import { Scroll, Users, Sparkles, Book, Feather, Wand2, Crown, Terminal } from 'lucide-react';
import { Player } from '../types/types';


interface SidebarProps {
    endpoint: string;
    onEndpointChange: (endpoint: string) => void;
    onSendEvent: (event: any) => void;
    currentPlayer: Player;
    onPlayerChange: (player: Player) => void;
}

const MAGIC_ASCII_ART = `
  .*・°☆.  .*・°☆.  .*・
 ╱|、      
(˚ˎ 。7    
 |、˜〵          
 じしˍ,)ノ
  °☆.  .*・°☆.  .*・°
`;

export default function Sidebar({
    endpoint,
    onEndpointChange,
    onSendEvent,
    currentPlayer,
    onPlayerChange
}: SidebarProps) {
    const [terminalMessages, setTerminalMessages] = React.useState<string[]>([]);
    const terminalRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const wsEndpoint = endpoint
            .replace(/^http(s)?:\/\//, (match, secure) => secure ? 'wss://' : 'ws://')
            .replace(/\/readyagentone$/, '');
        wsRef.current = new WebSocket(wsEndpoint);

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.action) {
                    setTerminalMessages(prev => [...prev, data.message || JSON.stringify(data)]);

                    // Auto scroll to bottom
                    if (terminalRef.current) {
                        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
                    }
                }
            } catch (error) {
                console.error('WebSocket message parsing error:', error);
            }
        };

        wsRef.current.onerror = (error) => {
            setTerminalMessages(prev => [...prev, `WebSocket Error: ${error.type}`]);
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [endpoint]);

    const handlePlayerEnter = () => {
        onSendEvent({
            text: "WORLD_EVENT",
            event: PLAYER_ENTER_EVENT,
            eventData: currentPlayer
        });
    };

    const handlePlayerExit = () => {
        onSendEvent({
            text: "WORLD_EVENT",
            event: PLAYER_EXIT_EVENT,
            eventData: currentPlayer
        });
    };

    const handlePlayerWon = () => {
        onSendEvent({
            text: "WORLD_EVENT",
            event: PLAYER_WON_EVENT,
            eventData: {
                player: currentPlayer,
                score: 100,
                game: "Sample Game"
            }
        });
    };

    const handleGameCompleted = () => {
        onSendEvent({
            text: "WORLD_EVENT",
            event: GAME_COMPLETED_EVENT,
            eventData: {
                rank: [currentPlayer],
                game: "Sample Game",
                duration: 300
            }
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
                    <input
                        type="text"
                        value={endpoint}
                        onChange={(e) => onEndpointChange(e.target.value)}
                        className="w-full px-3 py-2 ancient-input text-purple-100 ancient-text"
                        placeholder="https://readyagentone-production.up.railway.app/readyagentone"
                    />
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

                <div className="flex-1 space-y-2 mt-6">
                    <label className="flex items-center gap-2 text-sm rune-text text-purple-400">
                        <Terminal className="w-4 h-4" />
                        Terminal
                    </label>
                    <div className="terminal-ascii-art">{MAGIC_ASCII_ART}</div>
                    <div
                        ref={terminalRef}
                        className="flex-1 ancient-input h-60 overflow-y-auto p-3 text-sm font-mono text-purple-100"
                    >
                        {terminalMessages.map((msg, index) => (
                            <div key={index} className="mb-1 break-words">
                                ⋆｡°✩ {msg}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}