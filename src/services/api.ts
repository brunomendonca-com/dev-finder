import axios from 'axios';
import User from '../types/user';

const api = axios.create({
    baseURL: 'https://my-json-server.typicode.com/bvc-mobile-dev/dev-finder/',
});

export function getUsers() {
    return api.get<User[]>('/users/');
}

export function getUserByLogin(username: string) {
    return api.get<User[]>(`/users/?login=${username}`);
}

export function postUser(user: Omit<User, 'id'>) {
    return api.post<User>('/users/', user);
}

export function deleteUser(id: number) {
    return api.delete(`/users/${id}`);
}
