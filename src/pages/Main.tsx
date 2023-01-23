import { Alert, StyleSheet, Text } from 'react-native';
import MapView, { LatLng, Region } from 'react-native-maps';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { deleteUser, getUserByLogin, getUsers } from '../services/users';
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from 'expo-location';

import { AuthenticationContext } from '../context/AuthenticationContext';
import UserMarker from '../components/UserMarker';
import { RectButton } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import User from '../types/user';
import { DEFAULT_LOCATION, tryGetCurrentPosition } from '../utils/location';

export default function Main({ navigation }: StackScreenProps<any>) {
    const authenticationContext = useContext(AuthenticationContext);
    const currentUser = authenticationContext?.value;

    const mapViewRef = useRef<MapView>(null);

    const [devs, setDevs] = useState<User[]>([]);
    const [userLocation, setUserLocation] = useState<LatLng>();
    const [currentRegion, setCurrentRegion] = useState<Region>();

    useEffect(() => {
        getUsers()
            .then(setDevs)
            .catch((err) => Alert.alert(String(err)));

        loadInitialPosition();
    }, []);

    function loadInitialPosition() {
        tryGetCurrentPosition()
            .catch(() => DEFAULT_LOCATION)
            .then((coords) => {
                setUserLocation(coords);
                setCurrentRegion({
                    ...coords,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                });
            });
    }

    function handleLogout() {
        if (currentUser) {
            getUserByLogin(currentUser)
                .then((user) => {
                    if (user) {
                        return deleteUser(user.id);
                    } else {
                        // User should exist, since they are currently logged in.
                        // There is nothing to be done here but...
                        // TODO log this on your tracking system so it can be investigated
                    }
                })
                .then(() => {
                    authenticationContext?.setValue(null);
                    navigation.replace('Setup');
                })
                .catch((err) => {
                    Alert.alert(String(err));
                });
        }
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
                showsMyLocationButton={true}
                moveOnMarkerPress={false}
                toolbarEnabled={false}
                showsIndoors={false}
                mapType="mutedStandard"
                provider="google"
                mapPadding={{ top: 0, right: 24, bottom: 0, left: 24 }}
            >
                {devs.map((dev) => (
                    <UserMarker
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
