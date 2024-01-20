import axios from 'axios';
import { BASE_URL } from '../shared/data';
const userToken = localStorage.getItem('userToken') || '';
const appAxios = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
  
    headers: {
        "Authorization": `Bearer ${userToken}`
    }
});


export default appAxios;