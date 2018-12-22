/** @format */

import {AppRegistry} from 'react-native';
import './shim.js';
import crypto from 'crypto';
//import './global';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
