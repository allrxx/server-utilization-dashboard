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

export const getTrendData = async (cluster, resource, seasonality) => {
  console.log(cluster, resource, seasonality);
  const endpoint = `http://portal.costsense/gateway/v1/trend/clusters/${cluster}?resource=${resource}&seasonality=${seasonality}`;
  try {
    const res = await axios.get(endpoint);
    return res.data;
  } catch (error) {
    throw new Error(`Failed to fetch trend data: ${error.message}`);
  }
};
