// src/api.js
import axios from 'axios';

export const postChatMessage = async (message) => {
  const DATA_API = 'http://20.244.27.184:8082/v1/costsense_copilot';
  try {
    console.log('Sending request to API with message:', message);
    const response = await axios.post(DATA_API, {
      user_query: message
    });
    const data = response.data;
    console.log('Received response:', data);
    return { reply: data };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { reply: { error: 'Failed to fetch data from the API' } };
  }
};

export const getTrendData = async () => {
  const endpoint = 'http://portal.costsense/gateway/v1/trend/clusters/datacenter-cluster?resource=CPU&seasonality=daily';
  
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching trend data:', error.message);
    throw new Error(`Failed to fetch trend data: ${error.message}`);
  }
};