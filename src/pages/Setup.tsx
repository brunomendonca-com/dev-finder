import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import BigButton from '../components/BigButton';
import { AuthenticationContext } from '../context/AuthenticationContext';
import * as api from '../services/api';
import { getFromCache, setInCache } from '../services/caching';

export default function Setup({ navigation }: StackScreenProps<any>) {
    const authenticationContext = useContext(AuthenticationContext);
    const [username, setUsername] = useState('');
    const [usernameIsInvalid, setUsernameIsInvalid] = useState<boolean>(false);

    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
    const [authError, setAuthError] = useState<string>();

    // useEffect(() => {
    //     getFromCache('userInfo').then(
    //         (cachedUserInfo) => authenticationContext?.setValue(cachedUserInfo as User),
    //         (error: any) => console.log(error)
    //     );

    //     if (authError)
    //         Alert.alert('Authentication Error', authError, [{ text: 'Ok', onPress: () => setAuthError(undefined) }]);
    // }, [authError]);

    // useEffect(() => {
    //     if (authenticationContext?.value) navigation.navigate('Main');
    // }, []);

    const handleAuthentication = () => {
        setIsAuthenticating(true);
        api.getUserInfo(username)
            .then((response) => {
                // setInCache('currentUser', response.data.user);
                // authenticationContext?.setValue(response.data.user);
                // setIsAuthenticating(false);
                // navigation.navigate('EventsMap');

                console.log(response);
                setIsAuthenticating(false);
                navigation.replace('Main');
            })
            .catch((error) => {
                if (error.response) {
                    setAuthError(error.response.data);
                } else {
                    setAuthError('Something went wrong.');
                }
                setIsAuthenticating(false);
            });
    };

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={{
                padding: 24,
                flexGrow: 1,
                justifyContent: 'flex-end',
                alignItems: 'stretch',
                backgroundColor: '#00A3FF',
            }}
        >
            <View style={styles.inputLabelRow}>
                <Text style={styles.label}>Github Username</Text>
                {usernameIsInvalid && <Text style={styles.error}>invalid username</Text>}
            </View>
            <TextInput
                style={[styles.input, usernameIsInvalid && { borderColor: 'red' }]}
                onChangeText={(value) => setUsername(value)}
                onEndEditing={() => {
                    // TODO setUsernameIsInvalid
                }}
            />
            <BigButton onPress={handleAuthentication} label="Next" color="#031A62" />
            <Spinner
                visible={isAuthenticating}
                textContent={'Authenticating...'}
                overlayColor="#031A62BF"
                textStyle={styles.spinnerText}
            />
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    spinnerText: {
        fontSize: 16,
        color: '#fff',
    },

    inputLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 4,
    },

    label: {
        color: '#fff',
    },

    input: {
        backgroundColor: '#fff',
        border: 'none',
        height: 56,
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 24,
        marginBottom: 16,
        color: '#333',
        fontSize: 16,
    },

    error: {
        color: 'white',
        fontSize: 12,
    },
});
