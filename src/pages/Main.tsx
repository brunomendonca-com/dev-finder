import { StackScreenProps } from '@react-navigation/stack';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import MapView, { LatLng, Region } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';

import devsDb from '../../db.json';
import CustomMarker from '../components/CustomMarker';
import { Developer } from '../types/Developer';
import { RectButton } from 'react-native-gesture-handler';

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

    function handleLogout() {
        // TODO remove username from asyncStorage
        navigation.replace('Setup');
    }

    function fitAll() {
        const locations: LatLng[] = devs.map((dev) => dev.coordinates);
        if (userLocation) locations.push(userLocation);
        mapViewRef.current?.fitToCoordinates(locations, {
            edgePadding: {
                top: 128,
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
                style={styles.map}
                initialRegion={currentRegion}
                onMapReady={fitAll}
                showsUserLocation={true}
                showsMyLocationButton={false}
                moveOnMarkerPress={false}
                toolbarEnabled={false}
                provider="google"
            >
                {devs.map((dev) => (
                    <CustomMarker
                        key={dev.id}
                        data={dev}
                        handleCalloutPress={(githubUsername) => {
                            navigation.navigate('Profile', { githubUsername });
                        }}
                    />
                ))}
            </MapView>
            <RectButton style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonLabel}>Logout</Text>
            </RectButton>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },

    logoutButton: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 64,
        right: 24,
        height: 40,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#031A62',
        borderRadius: 4,
    },

    buttonLabel: {
        color: 'white',
    },
});

export default Main;
