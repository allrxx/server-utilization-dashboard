// src/components/DAGG.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import OpenAI from 'openai';

// Assuming dotenv is configured at the application entry point
// and your API key variable in secrets.env is named REACT_APP_OPENAI_API_KEY
const fetchGeneratedCode = async (data) => {
    console.log('This is the data :  ', data)
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  console.log('This is the api key:', apiKey); // Use the environment variable
  const url = 'https://costproject.openai.azure.com/';
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };
  const payload = {
    "prompt": `Generate a React component using ApexCharts to visualize the following data: ${JSON.stringify(data)}`,
    "max_tokens": 1000,
    "temperature": 0
  };

  try {
    console.log("Initiating API call to OpenAI service");
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // Log and throw an error if the response status indicates a failure
      console.error(`API call failed with status: ${response.status}, statusText: ${response.statusText}`);
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const responseData = await response.json();
    // Optionally, validate responseData here
    console.log("API call successful, response data received");
    return responseData.choices[0].text;
  } catch (error) {
    // Log any errors that occur during the fetch operation
    console.error("Error during API call to OpenAI service:", error);
    throw error; // Rethrow the error for further handling
  }
};

const DAGG = ({ data }) => {
  const [generatedCode, setGeneratedCode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getGeneratedCode = async () => {
      try {
        const code = await fetchGeneratedCode(data);
        setGeneratedCode(code);
      } catch (err) {
        setError(err.message);
      }
    };

    getGeneratedCode();
  }, [data]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!generatedCode) {
    return <div>Loading...</div>;
  }

  // Using dangerouslySetInnerHTML to inject the generated code. Note: This is generally discouraged.
  // For this example, we assume the generated code is safe.
  return <div dangerouslySetInnerHTML={{ __html: generatedCode }} />;
};

DAGG.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      data_type: PropTypes.string.isRequired,
      data_value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(
          PropTypes.shape({
            column_name: PropTypes.string,
            column_values: PropTypes.array.isRequired,
          })
        )
      ]).isRequired,
    })
  ).isRequired,
};

export default DAGG;
