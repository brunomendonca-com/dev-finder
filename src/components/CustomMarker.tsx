import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Callout, Marker } from 'react-native-maps';

import { Developer } from '../types/Developer';

interface CustomMarkerProps {
    data: Developer;
    navigateToProfile: (username: string) => void;
}

export default function CustomMarker({ data: dev, navigateToProfile }: CustomMarkerProps) {
    return (
        <Marker key={dev.id} coordinate={dev.coordinates}>
            <Image style={styles.avatar} source={{ uri: dev.avatar_url }} resizeMode="contain" />

            <Callout onPress={() => navigateToProfile(dev.login)}>
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
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF',
    },

    callout: {
        width: 260,
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
