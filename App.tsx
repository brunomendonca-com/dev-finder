import React, { useEffect, useState } from 'react';
import { AuthenticationContext, AuthenticationContextObject } from './src/context/AuthenticationContext';
import Routes from './src/routes';
import { getFromCache, setInCache } from './src/services/caching';

export default function App() {
    const [username, setUsername] = useState<string | null>(null);
    const [initialRouteName, setInitialRouteName] = useState<string | null>(null);

    const authenticationContextObj: AuthenticationContextObject = {
        value: username,
        setValue: (username) => {
            setUsername(username);
            setInCache('currentUser', username);
        },
    };

    useEffect(() => {
        getFromCache<string>('currentUser')
            .then(() => {
                setUsername(username);
                setInitialRouteName('Main');
            })
            .catch(() => {
                setInitialRouteName('Setup');
            });
    }, []);

    return (
        <AuthenticationContext.Provider value={authenticationContextObj}>
            {initialRouteName && <Routes initialRouteName={initialRouteName} />}
        </AuthenticationContext.Provider>
    );
}
