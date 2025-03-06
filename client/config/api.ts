import axios from "axios";
import { API_URL } from "./urls";
import { useEffect } from "react";
import { useAuth } from "@/hooks";

export default axios.create({
    baseURL: API_URL,
});

const axios_private = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const useAxiosPrivate = () => {
    const auth = useAuth();
    const user = auth ? auth.user : null;

    useEffect(() => {
        const requestInterceptor = axios_private.interceptors.request.use(
            (config) => {
                if (user && user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axios_private.interceptors.request.eject(requestInterceptor);
        };
    }, [user]);

    return axios_private;
};