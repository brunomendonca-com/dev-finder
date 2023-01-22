import AsyncStorage from '@react-native-async-storage/async-storage';

export const getFromNetworkFirst = async <T>(key: string, request: Promise<T>): Promise<T> => {
    try {
        const response = await request;
        setInStorage(key, response);
        return response;
    } catch (e) {
        return getFromStorage<T>(key);
    }
};

export const setInStorage = (key: string, value: any) => {
    const jsonValue = JSON.stringify(value);
    return AsyncStorage.setItem(key, jsonValue);
};

export const removeFromStorage = (key: string) => {
    return AsyncStorage.removeItem(key);
};

export const getFromStorage = async <T>(key: string): Promise<T> => {
    const json = await AsyncStorage.getItem(key);
    return await (json != null ? Promise.resolve(JSON.parse(json)) : Promise.reject(`Key "${key}" not in cache`));
};
