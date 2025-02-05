import React, { useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import { ChatMessage } from '../types/types';
import Sidebar from '../components/Sidebar';


function Debug() {
  const [endpoint, setEndpoint] = useState('https://readyagentone-production.up.railway.app/readyagentone');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState({
    userId: '1',
    username: 'Player1'
  });

  const handleSendMessage = async (content: string) => {
    const messagePayload = {
      text: content,
      userName: currentPlayer.username,
      userId: currentPlayer.userId,
      version: "0.1"
    };

    const userMessage: ChatMessage = {
      role: 'user',
      content,
      username: currentPlayer.username
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
        keepalive: true,
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.text || 'No response from the assistant',
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Error: Could not connect to the AI agent.',
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSendEvent = async (event: any) => {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Error sending event:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        endpoint={endpoint}
        onEndpointChange={setEndpoint}
        onSendEvent={handleSendEvent}
        currentPlayer={currentPlayer}
        onPlayerChange={setCurrentPlayer}
      />
      <div className="flex-1">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default Debug;