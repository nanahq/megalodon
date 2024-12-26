import { registerRootComponent } from 'expo'
import 'react-native-gesture-handler'

import App from './mobile-app/App'

import * as Sentry from '@sentry/react-native';

Sentry.init({
    dsn: 'https://4ef36247b35ac4105af9599f308c556d@o4506314992975872.ingest.us.sentry.io/4507946950656000',
    debug: true,
    environment: __DEV__ ? 'development' : 'production',
});

registerRootComponent(App)
