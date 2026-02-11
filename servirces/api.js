import axios from "axios";

const api = axios.create({
    baseURL: "https://mb-server.vercel.app/"
});

export default api;