import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Callout, Marker } from 'react-native-maps';

import { Developer } from '../types/Developer';

interface CustomMarkerProps {
    data: Developer;
    handleCalloutPress: (username: string) => void;
}

// TODO get current user from context
const currentUsername = 'brunomendonca-com';

export default function CustomMarker({ data: dev, handleCalloutPress }: CustomMarkerProps) {
    const isCurrentUser = dev.login === currentUsername;

    return (
        <Marker key={dev.id} coordinate={dev.coordinates} onCalloutPress={() => handleCalloutPress(dev.login)}>
            <Image
                style={[styles.avatar, isCurrentUser && styles.currentUser]}
                source={{ uri: dev.avatar_url }}
                resizeMode="contain"
            />
            <Callout>
                <View style={styles.callout}>
                    <Text style={styles.devName}>{dev.name}</Text>
                    <Text style={styles.devCompany}>{dev.company}</Text>
                    <Text style={styles.devBio}>{dev.bio}</Text>
                </View>
            </Callout>
        </Marker>
    );
}

const styles = StyleSheet.create({
    avatar: {
        width: 64,
        height: 64,
        borderWidth: 4,
        borderColor: '#E8EAED',
        borderRadius: 32,
    },

    currentUser: {
        borderColor: '#4285F4',
    },

    callout: {
        width: 240,
    },

    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    devCompany: {
        color: '#666',
        fontSize: 12,
    },

    devBio: {
        color: '#666',
        marginTop: 5,
    },
});
