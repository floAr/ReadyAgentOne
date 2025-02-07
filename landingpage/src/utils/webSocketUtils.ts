export const initializeWebSocket = (
    endpoint: string,
    terminalRef: React.RefObject<HTMLDivElement>,
    limit = -1
): WebSocket => {
    const ws = new WebSocket(endpoint);

    const msg_connected = 'WebSocket connection established';
    const msg_error = 'WebSocket Error: ';


    ws.onopen = () => {
        appendMessage('WebSocket connection established');
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.action) {
                const message = `${new Date().toLocaleString()}: ${data.message || JSON.stringify(data)}`;
                appendMessage(message);

                // Limit terminal messages
                if (limit > 0 && terminalRef.current) {
                    const terminalMessages = terminalRef.current.children;
                    if (terminalMessages.length > limit) {
                        terminalMessages[0].remove();
                    }
                }

                // Auto scroll to bottom
                if (terminalRef.current) {
                    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
                }
            }
        } catch (error) {
            console.error('WebSocket message parsing error:', error);
        }
    };

    ws.onerror = (error) => {
        appendMessage(`WebSocket Error: ${error.type}`);
    };

    const appendMessage = (message: string) => {
        if (terminalRef.current) {
            const messageElement = document.createElement('div');
            messageElement.className = 'mb-1 break-words';
            messageElement.textContent = `⋆｡°✩ ${message}`;
            terminalRef.current.appendChild(messageElement);
        }
    };

    return ws;
};
