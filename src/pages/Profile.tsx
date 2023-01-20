import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

function Profile({ route }: any) {
    const { githubUsername } = route.params;

    return (
        <>
            <StatusBar style="light" />
            <WebView style={{ flex: 1 }} source={{ uri: `https://github.com/${githubUsername}` }} />
        </>
    );
}

export default Profile;
