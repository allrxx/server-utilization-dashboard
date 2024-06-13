// src/components/Bot.jsx
import React, { useState } from 'react';
import { postChatMessage } from '../services/api';
import './Bot.css';
import ChartComponent from './ChartComponent'; // Import the ChartComponent

const Bot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);

    const renderDataFrame = (dataValue) => {
        const table = document.createElement('table');
        table.border = 1;
        table.style.borderCollapse = 'collapse';

        const headers = dataValue.map(col => `<th style="padding: 10px;">${col.column_name}</th>`).join('');
        const headerRow = `<tr>${headers}</tr>`;

        const rows = dataValue[0].column_values.map((_, i) => {
            return '<tr>' + dataValue.map(col => `<td style="padding: 10px;">${col.column_values[i]}</td>`).join('') + '</tr>';
        }).join('');

        table.innerHTML = `<thead>${headerRow}</thead><tbody>${rows}</tbody>`;
        return table.outerHTML;
    };

    const renderUnknown = (data) => {
        console.log('The DataType is ',data.data);
        if(data.data_type === 'image')
            return <p></p>;
        else
            return <p>Unknown data type: {data.data_type ? data.data_type : 'No additional info available'}</p>;
    }; 
    
    const renderHyperlinks = (dataValue) => {
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
        return dataValue.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`);
    };

    const renderMessageContent = (data) => {
        switch (data.data_type) {
            case 'dataframe':
            case 'img':
                return (
                    <div>
                        <div style={{ marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: renderDataFrame(data.data_value) }} />
                        <ChartComponent rawData={[data]} /> 
                    </div>
                );
            case 'string':
                const formattedDataValue = renderHyperlinks(data.data_value.replace(/\n/g, '<br/>'));
                return <div dangerouslySetInnerHTML={{ __html: formattedDataValue }} />;
            default:
                return renderUnknown(data);
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
            setUserInput(" ");
        }
    };

    return (
        <div className="chat-container">
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