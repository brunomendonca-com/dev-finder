import React, { useEffect, useState } from 'react';
import { AuthenticationContext, AuthenticationContextObject } from './src/context/AuthenticationContext';
import Routes from './src/routes';
import { getFromCache, removeFromCache, setInCache } from './src/services/caching';

export default function App() {
    const [username, setUsername] = useState<string | null>(null);
    const [initialRouteName, setInitialRouteName] = useState<string>();

    const authenticationContextObj: AuthenticationContextObject = {
        value: username,
        setValue: (username) => {
            setUsername(username);
            if (username) {
                setInCache('currentUser', username);
            } else {
                removeFromCache('currentUser');
            }
        },
    };

    useEffect(() => {
        getFromCache<string>('currentUser')
            .then((cachedUser) => {
                setUsername(cachedUser);
                setInitialRouteName('Main');
            })
            .catch(() => setInitialRouteName('Setup'));
    }, []);

    return (
        <AuthenticationContext.Provider value={authenticationContextObj}>
            {initialRouteName && <Routes initialRouteName={initialRouteName} />}
        </AuthenticationContext.Provider>
    );
}
