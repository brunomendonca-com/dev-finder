import React from "react";
import { StatusBar } from "expo-status-bar";
import { WebView } from "react-native-webview";

function Profile({ navigation, route }: any) {
  console.log("route.params:", route.params);
  const { githubUsername } = route.params;

  return (
    <>
      <StatusBar style="light" />
      <WebView
        style={{ flex: 1 }}
        source={{ uri: `https://github.com/${githubUsername}` }}
      />
    </>
  );
}

export default Profile;
