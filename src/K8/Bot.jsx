// src/components/Bot.js
import React, { useState } from 'react';
import { postChatMessage } from '../services/api'; // Ensure the correct path to your api file
import './Bot.css';

const Bot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);

    const renderMessageContent = (data) => {
        switch (data.data_type) {
            case 'dataframe':
                const columns = data.data_value.map(col => (
                    <div key={col.column_name}>
                        <strong>{col.column_name}:</strong> {col.column_values.join(', ')}
                    </div>
                ));
                return <div>{columns}</div>;
            case 'image':
                return <img src={data.data_value} alt="Graph" />;
            case 'string':
                return <div>{data.data_value}</div>;
            default:
                return <div>Unsupported data type</div>;
        }
    };

    const handleSend = async () => {
        if (!userInput.trim()) return;
        const newMessage = { sender: 'user', text: userInput };
        setMessages([...messages, newMessage]);
        setLoading(true);

        try {
            const response = await postChatMessage(userInput);
            const botReplies = response.reply.map((data, index) => ({
                sender: 'bot',
                content: renderMessageContent(data),
                id: index
            }));
            setMessages((prevMessages) => [...prevMessages, ...botReplies]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong.' };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }

        setUserInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <div className="title">ChatBot</div>
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.sender === 'user' ? message.text : message.content}
                    </div>
                ))}
                {loading && (
                    <div className="message bot loading">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                )}
            </div>
            <div className="input-container">
                <input
                    id="userInput"
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button id="sendButton" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Bot;
