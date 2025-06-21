import axios from 'axios';
import constants from 'expo-constants';

import { Platform } from 'react-native';

const API_URL =
  Platform.OS === 'android'
    ? 'http://192.168.10.24:3000'
    : 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api`,

});

export default api;
