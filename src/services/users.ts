import User from '../types/user';
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://my-json-server.typicode.com/bvc-mobile-dev/dev-finder/',
});

export function getUsers() {
    return api.get<User[]>('/users/').then(({ data }) => data);
}

export function getUserByLogin(username: string) {
    return (
        api
            .get<User[]>(`/users/?login=${username}`)
            // there should be only one user with a given login (BE implementation)
            .then((res) => res.data[0])
    );
}

export function postUser(user: Omit<User, 'id'>) {
    return api.post<User>('/users/', user).then(({ data }) => data);
}

export function deleteUser(id: number) {
    return api.delete(`/users/${id}`).then(({ data }) => data);
}
