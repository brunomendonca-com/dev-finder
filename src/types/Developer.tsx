import { LatLng } from 'react-native-maps';

export interface Developer {
    id: number;
    name: string;
    avatar_url: string;
    login: string;
    company: string;
    bio: string;
    coordinates: LatLng;
}
