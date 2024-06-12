import React, { useState, useEffect } from 'react';
import openai from 'openai';

const MyComponent = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);

  useEffect(() => {
    openai.api_key = process.env.REACT_APP_OPENAI_API_KEY; // Set API key
  }, []);

  const handleAPIRequest = async () => {
    try {
      const response = await openai.Completion.create({
        engine: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1024,
        n: 1,
      });
      setResponse(response.choices[0].text);
    } catch (error) {
      console.error(error); // Handle errors
    }
  };

  return (
    <div>
      <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={handleAPIRequest}>Send Prompt</button>
      {response && <p>Response: {response}</p>}
    </div>
  );
};

export default MyComponent;
