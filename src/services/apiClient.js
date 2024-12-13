import axios from "axios";
import { setupAuthInterceptor } from "./authInterceptor";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

setupAuthInterceptor(apiClient);

export default apiClient;
