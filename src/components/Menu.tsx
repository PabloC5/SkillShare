import React, { useEffect } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { ListSkillers } from '../screens/ListSkillers';
import Favorite from '../screens/Favorite';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

export default function Menu() {  
  async function handlechangeScreen() {
    // await updateData();
    console.log("trocando a tela marotamente");
  }
  return (
    <Tab.Navigator screenListeners={{tabPress: () => {
      handlechangeScreen()
    }}} barStyle={{ backgroundColor: 'white' }}>
      <Tab.Screen
        options={{
          tabBarLabel: 'ListSkillers',
          tabBarIcon: ({}) => (
            <MaterialCommunityIcons
              name='television'
              color={'#38bdf8'}
              size={26}
            />
          ),
        }}
        name='ListSkillers'
        component={ListSkillers}
      />
      <Tab.Screen
        options={{
          tabBarLabel: 'Favorite',
          tabBarIcon: ({}) => (
            <MaterialCommunityIcons name='heart' color={'#38bdf8'} size={26} />
          ),
        }}
        name='Favorite'
        component={Favorite}
      />
    </Tab.Navigator>
  );
}
