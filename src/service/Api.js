import axios from 'axios';
import constants from 'expo-constants';

const API_URL =
  constants.expoConfig?.extra?.API_URL || 
  constants.manifest?.extra?.API_URL ||   
  'http://localhost:3000';         
  
  console.log(API_URL)

const api = axios.create({
  baseURL: `${API_URL}/api`,

});


export default api;



