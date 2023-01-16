import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './pages/Main';
import Profile from './pages/Profile';
import Setup from './pages/Setup';

const { Navigator, Screen } = createStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Navigator
                initialRouteName="Signup"
                screenOptions={{
                    headerMode: 'screen',
                    headerTintColor: 'white',
                    headerStyle: { backgroundColor: '#021A62' },
                    headerBackTitleVisible: false,
                }}
            >
                <Screen
                    name="Setup"
                    component={Setup}
                    options={{
                        title: 'DevFinder Setup',
                    }}
                />
                <Screen
                    name="Main"
                    component={Main}
                    options={{
                        title: 'DevFinder Map',
                    }}
                />
                <Screen
                    name="Profile"
                    component={Profile}
                    options={{
                        title: 'Github Profile',
                    }}
                />
            </Navigator>
        </NavigationContainer>
    );
}
