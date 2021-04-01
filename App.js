/* components and resources imported from Expo */
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import { Feather } from '@expo/vector-icons';

/* components imported from React */
import React, { useState } from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';

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
import CoinSearchScreen from "./CoinSearchScreen.js";
import { lightStyles, darkStyles } from "./MiscComponents.js";

LogBox.ignoreAllLogs()

var theme = "light";
export function getAppStyleSet() {
  if(theme == null)
    return darkStyles;

  if(theme === "light") {
    return lightStyles;
  } else if(theme === "dark") {
    return darkStyles;
  }
}

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
      sceneContainerStyle={getAppStyleSet().backgroundColor}
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerContentOptions={{
        activeTintColor: getAppStyleSet().backgroundColor.backgroundColor,//'#ffffff',
        activeBackgroundColor: getAppStyleSet().primColor.color,//'#2791e3',
        inactiveTintColor: getAppStyleSet().primColor.color,
        inactiveBackgroundColor: getAppStyleSet().backgroundColor.backgroundColor,
        labelStyle: styles.labelFont,
      }}
      screenOptions={{
        headerTitleStyle: [styles.screenHeaderFont, {
          flex: 1,
          padding: 0,
          margin: 0,
          //backgroundColor:'red'
        } ],
        headerShown: true,
      }}
      drawerStyle={[getAppStyleSet().backgroundColor, {
        width: 200,
      }]}
      style={{backgroundColor: "red"}}
        
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

        <Drawer.Screen
          name="coin-search-screen"
          component={CoinSearchScreen}
          options={{
            drawerLabel: "Search",
            headerTitle: "Crypto Search",
          }}
          />

    </Drawer.Navigator>
  );
}

export default function App() {
  appComponent = this;
  
  const [fontsLoaded] = useFonts({
    TitilliumWeb: require("./fonts/TitilliumWeb-Regular.ttf"),
    TitilliumWebSemiBold: require("./fonts/TitilliumWeb-SemiBold.ttf"),
    Aldrich: require("./fonts/Aldrich-Regular.ttf"),
    HeeboLight: require("./fonts/Heebo-Light.ttf"),
    HeeboRegular: require("./fonts/Heebo-Regular.ttf"),
    HeeboMedium: require("./fonts/Heebo-Medium.ttf"),
  });

  const [cryptoLoaded, setCryptoLoaded] = useState(false);
  const [cryptoPriceLoaded, setCryptoPriceLoaded] = useState(false);
  const [loadThreadStarted, setLoadThreadStarted] = useState(false);

  if(!loadThreadStarted) {
    setLoadThreadStarted(true);
    CryptoExchanger.loadCryptoExchangers()
      .catch((error) => console.log("There was an error loading crypto exchangers..."))
      .then(() => {
        setCryptoLoaded(true);
        // CryptoExchanger.saveCryptoExchangers();
      });
  }

  if(!fontsLoaded || !cryptoLoaded) {
    return <AppLoading />;
  } else {
    return (
      <NavigationContainer
        style={getAppStyleSet().backgroundColor}>
        <NavDrawer />
      </NavigationContainer>
    );
  }
}
