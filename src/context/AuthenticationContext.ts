import { createContext } from 'react';
import { LatLng } from 'react-native-maps';

export type AuthenticationContextObject = {
    value: string;
    setValue: (newValue: string | undefined) => void;
};

export const AuthenticationContext = createContext<AuthenticationContextObject | null>(null);
