import { StackScreenProps } from '@react-navigation/stack';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { LatLng, Region } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';

import devsDb from '../../db.json';
import CustomMarker from '../components/CustomMarker';
import { Developer } from '../types/Developer';

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
                onMapReady={fitAll}
            >
                {devs.map((dev) => (
                    <CustomMarker
                        key={dev.id}
                        data={dev}
                        navigateToProfile={(githubUsername) => {
                            navigation.navigate('Profile', { githubUsername });
                        }}
                    />
                ))}
            </MapView>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});

export default Main;
