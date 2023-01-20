import axios, { AxiosResponse } from 'axios';

export const api = axios.create({
    baseURL: 'https://api.github.com/',
});

export const getUserInfo = (username: string): Promise<AxiosResponse> => {
    return api.get(`/users/${username}`);
};
