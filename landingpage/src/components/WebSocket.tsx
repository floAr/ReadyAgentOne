import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';

interface WebSocketComponentProps {
    endpoint: string;
}

const WebSocketComponent: React.FC<WebSocketComponentProps> = ({ endpoint }) => {
    const [terminalMessages, setTerminalMessages] = React.useState<string[]>([]);
    const terminalRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);


    useEffect(() => {
        const wsEndpoint = endpoint
            .replace(/^http(s)?:\/\//, (match, secure) => (secure ? 'wss://' : 'ws://'))
            .replace(/\/readyagentone$/, '');
        wsRef.current = new WebSocket(wsEndpoint);

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.action) {
                    setTerminalMessages((prev) => [...prev, data.message || JSON.stringify(data)]);

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
            setTerminalMessages((prev) => [...prev, `WebSocket Error: ${error.type}`]);
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [endpoint]);

    return (
        <div className="flex-1 space-y-2 mt-6">
            <label className="flex items-center gap-2 text-sm rune-text text-purple-400">
                <Terminal className="w-4 h-4" />
                Terminal
            </label>
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
    );
};

export default WebSocketComponent;
