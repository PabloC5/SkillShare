import { StatusBar } from 'react-native';
import { Routes } from './src/routes';

import {
  Archivo_400Regular,
  Archivo_500Medium,
  Archivo_600SemiBold,
  Archivo_700Bold,
  useFonts,
} from '@expo-google-fonts/archivo';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

import { NativeWindStyleSheet } from "nativewind";


import { Loading } from './src/components/Loading';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './src/screens/config/firebaseConfig-skillShare';

export default function App() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_500Medium,
    Archivo_600SemiBold,
    Archivo_700Bold,
    Poppins_500Medium,
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  NativeWindStyleSheet.setOutput({
    default: "native",
  });

  if (!fontsLoaded) return <Loading />;

  initializeApp(firebaseConfig);

  return (
    <>
      <Routes />
      <StatusBar
        barStyle={'light-content'}
        backgroundColor='transparent'
        translucent
      />
    </>
  );
}
