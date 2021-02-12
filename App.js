/* components and resources imported from Expo */
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import { Feather } from '@expo/vector-icons';

/* components imported from React */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/* components imported from the React-Navigation library */
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import { BitcoinExchanger } from "./Bitcoin.js";
import { EthereumExchanger } from "./Ethereum.js";
import { LitecoinExchanger } from "./Litecoin.js";
import { MoneroExchanger } from "./Monero.js";
import Profile from "./Profile.js";

const styles = StyleSheet.create({
  screenHeaderFont : {
    fontFamily: "normal",
    fontSize: 24,
  },
  labelFont: {
    fontFamily: "Aldrich",
    fontSize: 16,
  },
});

const Drawer = createDrawerNavigator();

/* Custom items which can be selected in the Navigation Drawer */
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} >

      <DrawerItem
        label="Close"
        onPress={() => props.navigation.closeDrawer()}
        icon={(focused, size) => (
            <Feather
              name="arrow-left-circle"
              size={24.0}
              color="black"
              style={{marginLeft: 9}}
              />
        )}
        {... props}
      />

      <DrawerItemList {...props} />

    </DrawerContentScrollView>
  );
}

/* The Navigation Drawer itself, which can be swiped to screen from the left for
   the user to select different screens within the app */
const NavDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerContentOptions={{
        activeTintColor: '#ffffff',//'#ffffff',
        activeBackgroundColor: '#000000',//'#2791e3',
        inactiveTintColor: '#383838',
        inactiveBackgroundColor: '#ffffff',
        labelStyle: styles.labelFont,
      }}
      screenOptions={{
        headerTitleStyle: styles.screenHeaderFont
      }}
      drawerStyle={{backgroundColor: '#ffffff'}}
      >

        <Drawer.Screen
          name="profile-screen"
          component={Profile}
          options={{
            drawerLabel: "Profile"
          }}
          />

        <Drawer.Screen
          name="bitcoin-screen"
          component={BitcoinExchanger}
          options={{
              drawerLabel: "Bitcoin",
              headerTitle: "Bitcoin Exchanger",
            }}
          />

        <Drawer.Screen
          name="ethereum-screen"
          component={EthereumExchanger}
          options={{
            drawerLabel: "Ethereum",
            headerTitle: "Ethereum Exchanger"
          }}
          />

        <Drawer.Screen
          name="litecoin-screen"
          component={LitecoinExchanger}
          options={{
            drawerLabel : "Litecoin"
          }}
          />

        <Drawer.Screen
          name="monero-screen"
          component={MoneroExchanger}
          options={{
            drawerLabel : "Monero"
          }}
          />

    </Drawer.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    TitilliumWeb: require("./fonts/TitilliumWeb-Regular.ttf"),
    Aldrich: require("./fonts/Aldrich-Regular.ttf")
  });

  if(!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <NavigationContainer>
        <NavDrawer />
      </NavigationContainer>
    );
  }
}
