/* components and resources imported from Expo */
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import { Feather } from '@expo/vector-icons';

/* components imported from React */
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

/* components imported from the React-Navigation library */
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

/** components and classes imported from other files **/
import CryptoExchanger from "./CryptoExchanger.js";
import Profile from "./Profile.js";
import ExchangerScreen from "./ExchangerScreen.js";



const styles = StyleSheet.create({
  screenHeaderFont : {
    fontFamily: "Aldrich",
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
        headerTitleStyle: styles.screenHeaderFont,
        headerShown: true,
      }}
      drawerStyle={{
        backgroundColor: '#ffffff',
        width: 200,
      }}
      >

        <Drawer.Screen
          name="profile-screen"
          component={Profile}
          options={{
            drawerLabel: "Profile",
            title: "Profile",
          }}
          />

        <Drawer.Screen
          name="exchanger-screen"
          component={ExchangerScreen}
          options={{
              drawerLabel: "Exchanger",
              headerTitle: "Exchanger",
            }}
          />

    </Drawer.Navigator>
  );
}



export default function App() {
  const [fontsLoaded] = useFonts({
    TitilliumWeb: require("./fonts/TitilliumWeb-Regular.ttf"),
    Aldrich: require("./fonts/Aldrich-Regular.ttf"),
    HeeboLight: require("./fonts/Heebo-Light.ttf"),
    HeeboRegular: require("./fonts/Heebo-Regular.ttf"),
    HeeboMedium: require("./fonts/Heebo-Medium.ttf"),
  });

  const [cryptoLoaded, setCryptoLoaded] = useState(false);
  const [cryptoPriceLoaded, setCryptoPriceLoaded] = useState(false);

  CryptoExchanger.loadCryptoExchangers()
    .catch((error) => console.log("There was an error loading crypto exchangers..."))
    .then(() => {
      setCryptoLoaded(true);
    });


  if(!fontsLoaded || !cryptoLoaded) {
    return <AppLoading />;
  } else {
    return (
      <NavigationContainer>
        <NavDrawer />
      </NavigationContainer>
    );
  }
}
