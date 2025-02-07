import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { initializeWebSocket } from '../utils/webSocketUtils';

interface WebSocketComponentProps {
    endpoint: string;
}

const WebSocketComponent: React.FC<WebSocketComponentProps> = ({ endpoint }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        wsRef.current = initializeWebSocket(endpoint, terminalRef);

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [endpoint]);

    return (
        <div className="flex-1 space-y-2 mt-6 h-full">
            <label className="flex items-center gap-2 text-sm rune-text text-purple-400">
                <Terminal className="w-4 h-4" />
                Terminal
            </label>
            <div
                ref={terminalRef}
                className="flex-1 ancient-input h-full overflow-y-auto p-3 text-sm font-mono text-purple-100"
            />
        </div>
    );
};

export default WebSocketComponent;
