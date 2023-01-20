import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import MapView, { Marker, Callout, LatLng, Region } from 'react-native-maps';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { StackScreenProps } from '@react-navigation/stack';

import devsDb from '../../db.json';
import { StatusBar } from 'expo-status-bar';

interface Developer {
    id: number;
    name: string;
    avatar_url: string;
    login: string;
    company: string;
    bio: string;
    coordinates: LatLng;
}

function Main({ navigation }: StackScreenProps<any>) {
    const mapViewRef = useRef<MapView>(null);
    const [devs, setDevs] = useState<Developer[]>([]);
    const [userLocation, setUserLocation] = useState<LatLng | undefined>();
    const [currentRegion, setCurrentRegion] = useState<Region>();

    useEffect(() => {
        setDevs(devsDb as Developer[]);
        loadInitialPosition();
    }, []);

    async function loadInitialPosition() {
        const { status } = await requestForegroundPermissionsAsync();

        if (status === 'granted') {
            const { coords } = await getCurrentPositionAsync();
            setUserLocation(coords);

            const { latitude, longitude } = coords;
            setCurrentRegion({
                latitude,
                longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            });
        }
    }

    function handleRegionChanged(region: any) {
        setCurrentRegion(region);
    }

    function fitAll() {
        const locations: LatLng[] = devs.map((dev) => dev.coordinates);
        if (userLocation) locations.push(userLocation);
        mapViewRef.current?.fitToCoordinates(locations, {
            edgePadding: {
                top: 64,
                right: 64,
                bottom: 64,
                left: 64,
            },
            animated: true,
        });
    }

    if (!currentRegion) {
        return null;
    }

    return (
        <>
            <StatusBar style="dark" />
            <MapView
                ref={mapViewRef}
                onRegionChangeComplete={handleRegionChanged}
                showsUserLocation={true}
                initialRegion={currentRegion}
                style={styles.map}
                onMapReady={() => {
                    fitAll();
                }}
            >
                {devs.map((dev) => (
                    <Marker key={dev.id} coordinate={dev.coordinates}>
                        <Image style={styles.avatar} source={{ uri: dev.avatar_url }} resizeMode="contain" />

                        <Callout
                            onPress={() => {
                                navigation.navigate('Profile', { githubUsername: dev.login });
                            }}
                        >
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devCompany}>{dev.company}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },

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

export default Main;
