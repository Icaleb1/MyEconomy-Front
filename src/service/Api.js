import axios from 'axios';
      
const api = axios.create({
  baseURL: `http://10.10.102.19:3000/api`,
});

export default api;



