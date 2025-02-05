import React, { useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types/types';

interface ChatWindowProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
}

export default function ChatWindow({ messages, onSendMessage }: ChatWindowProps) {
    const [input, setInput] = React.useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 bg-opacity-95">
            <div className="p-4 border-b border-blue-500 bg-gray-900 neon-border">
                <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2 neon-text">
                    <Sparkles className="w-6 h-6" />
                    AI Agent Interface
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 message-glow ${message.role === 'user'
                                    ? 'bg-blue-600 bg-opacity-20 border border-blue-500'
                                    : 'bg-gray-800 bg-opacity-50 border border-gray-700'
                                }`}
                        >
                            {message.username && (
                                <div className="text-sm text-blue-400 mb-1">
                                    {message.username}
                                </div>
                            )}
                            <div className="text-white">
                                <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-blue-500 bg-gray-900 neon-border">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 bg-gray-800 border border-blue-500 rounded-md text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                        <Send size={18} /> Send
                    </button>
                </div>
            </form>
        </div>
    );
}