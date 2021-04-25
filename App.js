/* components and resources imported from Expo */
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import { Ionicons, Feather, Foundation } from '@expo/vector-icons';
import { AdMobBanner } from "expo-ads-admob";
import * as FileSystem from 'expo-file-system';

/* components imported from React */
import React, { useState, useContext } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, LogBox } from 'react-native';

/* components imported from the React-Navigation library */
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerToggleButton,
} from '@react-navigation/drawer';

import { SearchBar } from 'react-native-elements';

/** components and classes imported from other files **/
import CryptoExchanger from "./CryptoExchanger.js";
import Profile from "./Profile.js";
import ExchangerScreen from "./ExchangerScreen.js";
import ExchangerComponent from "./Exchanger.js";
import CoinSearchScreen from "./CoinSearchScreen.js";
import { 
  lightStyles, 
  darkStyles,
  ConfirmationModal,
  NumberInputModal 
} from "./MiscComponents.js";

// Supresses cycle warnings
LogBox.ignoreAllLogs()

export var fileDir = FileSystem.documentDirectory;// + "portfolio1\/";
export function getFileURI(filename) {
  return FileSystem.documentDirectory + "portfolio1\/" + filename;
}


const menuFontFamily = "Aldrich"
const styles = StyleSheet.create({
  screenHeaderFont : {
    fontFamily: menuFontFamily,
    fontSize: 24,
  },
  labelFont: {
    fontFamily: menuFontFamily,
    fontSize: 16,
  },

  titleText: {
    fontFamily: menuFontFamily,
    fontSize: 20,
  },
  titleSubText: {
    fontFamily: menuFontFamily,
    fontSize: 16,
    color: 'grey',
  },
  titleBoxContainer: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  outerDrawerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderColor: 'yellow',
    borderWidth: 2,
    paddingTop: 10,
  },
  upperDrawerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  lowerDrawerContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },  
  drawerButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  drawerButton: {
    flex: 1,
    margin: 4,
    height: 46,
    borderRadius: 6,
  },
  buttonIcon: {
    flex: 0, 
    justifyContent: 'center',
    //paddingTop: 1,
    //paddingLeft: ,
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    flex:0,
    width: '100%',
    //marginTop: 10,
    //marginBottom: 10,
    
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent'
  },

  searchBarInputContainer: {
    borderRadius: 6,
  },

  searchBarInput: {
    fontSize: 12,
  },

});

var theme = "light";

// Initializing the a context for a dark/light theme, which has a style set for the
// currently selected theme and a handler for changing between the two themes
// (which is defined in the context provider container) 
export const ThemeContext = React.createContext({
  styleSet: lightStyles,
  toggleStyleSet: () => {},
});


const Drawer = createDrawerNavigator();

export function getAppStyleSet() {
  if(theme == null)
    return darkStyles;

  if(theme === "light") {
    return lightStyles;
  } else if(theme === "dark") {
    return darkStyles;
  }
}


function getColorModeIcon() { 
  if(theme === "light")
    return <Ionicons name="md-moon" size={28} color={getAppStyleSet().filledButtonLabel.color} style={styles.buttonIcon} />;
  else 
    return <Ionicons name="md-sunny" size={28} color={getAppStyleSet().filledButtonLabel.color} style={styles.buttonIcon}/>; 
}

/* Custom items which can be selected in the Navigation Drawer */
const CustomDrawerContent = (props) => {
  var theme = useContext(ThemeContext);
  const [resetDialogVisibility, setResetDialogVisibility] = useState(false);
  const [inputDialogVisibility, setInputDialogVisibility] = useState(false);
  return (
    <DrawerContentScrollView 
      contentContainerStyle={{flex:1, justifyContent: 'space-between', alignItems: 'stretch'}} 
      {...props} >

      {/* Flexbox which places components from the top of the drawer down */}
      <View style={styles.upperDrawerContainer}>
       
        {/* Flexbox which contains the title within the drawer */}
        <View style={styles.titleBoxContainer}>
          <Text style={[styles.titleText, theme.styleSet.primColor]}>CryptoTrader</Text>
          <Text style={styles.titleSubText}>V1.0</Text>
        </View>

        <DrawerItemList {...props} />
      </View>

      {/* Flexbox which places components from the bottom of the drawer up */}
      <View style={styles.lowerDrawerContainer}>

        {/* Row flexbox which contains the buttons */}
        <View style={styles.drawerButtonContainer}>

          {/* Reset button */} 
          <TouchableOpacity
            style={ [styles.drawerButton, theme.styleSet.filledButton]}
            onPress={() => setResetDialogVisibility(true)}>

            <View style={ styles.iconContainer }>
              <Foundation name="loop" 
                          size={34} 
                          color={theme.styleSet.filledButtonLabel.color} 
                          style={styles.buttonIcon} />
            </View>

          </TouchableOpacity>

          {/* Dark/Light mode button */}
          <TouchableOpacity
            style={ [styles.drawerButton, theme.styleSet.filledButton]}
            onPress={theme.toggleStyleSet}>
            <View style={ styles.iconContainer }>
              {getColorModeIcon()}
            </View>
          </TouchableOpacity>

        </View> 

      </View>

      <ConfirmationModal  
        visible={resetDialogVisibility}
        setVisibility={(visibility) => setResetDialogVisibility(visibility)}
        promptString="Are you sure you would like to reset your profile?"
        onConfirmation={() => {
          setInputDialogVisibility(true);
        }}/>
  

      {/* The dialog that appears when the user would like to reset their profile
          and needs to specify how much cash they start with */}
      <NumberInputModal
        visible={inputDialogVisibility}
        setVisibility={(visibility) => setInputDialogVisibility(visibility)}
        promptString="Input starting cash:"
        onConfirmation={(inputNum) => {
          // reseting the objects which contain all saved data
          CryptoExchanger.resetCryptoExchangers(inputNum);
          Profile.resetProfile();

          // rerendering all the screens to reflect data reset
          ExchangerComponent.forceUpdate();
          Profile.forceProfileUpdate();
          CoinSearchScreen.forceUpdate(); 
        }}/> 

    </DrawerContentScrollView>
  );
}

/* The Navigation Drawer itself, which can be swiped to screen from the left for
   the user to select different screens within the app */
const NavDrawer = () => {
  var theme = useContext(ThemeContext);

  return (
    <Drawer.Navigator
      sceneContainerStyle={theme.styleSet.backgroundColor}
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerContentOptions={{
        activeTintColor: theme.styleSet.backgroundColor.backgroundColor,//'#ffffff',
        activeBackgroundColor: theme.styleSet.primColor.color,//'#2791e3',
        inactiveTintColor: theme.styleSet.primColor.color,
        inactiveBackgroundColor: theme.styleSet.backgroundColor.backgroundColor,
        labelStyle: styles.labelFont,
      }}
      screenOptions={{
        headerTitleStyle: [styles.screenHeaderFont, {
          flex: 1,
          padding: 0,
          margin: 0,
        }],
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.styleSet.backgroundColor.backgroundColor,
        },
        headerTintColor: theme.styleSet.primColor.color,
      }}
      drawerStyle={[theme.styleSet.backgroundColor, {
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
            headerTitle: () => {
              const [searchText, setSearchText] = useState();
              return (
                <SearchBar
                  containerStyle={styles.searchBarContainer}
                  inputContainerStyle={styles.searchBarInputContainer}
                  inputStyle={styles.searchBarInput}
                  placeholder="Search cryptocurrencies..."
                  onChangeText={(text) => {
                    CoinSearchScreen.setSearchText(text);
                    setSearchText(text);
                  }}
                  value={searchText} />
              );
            },
          }}
          />

    </Drawer.Navigator>
  );
}

function toggleTheme() {
  if(theme === "light")
    theme = "dark";
  else
    theme = "light";
  Profile.forceProfileUpdate();
  ExchangerScreen.forceUpdate();
  CoinSearchScreen.forceUpdate();
}

export default function App() {
  //appComponent = this;
  
  const [fontsLoaded] = useFonts({
    TitilliumWeb: require("./fonts/TitilliumWeb-Regular.ttf"),
    TitilliumWebSemiBold: require("./fonts/TitilliumWeb-SemiBold.ttf"),
    Aldrich: require("./fonts/Aldrich-Regular.ttf"),
    HeeboLight: require("./fonts/Heebo-Light.ttf"),
    HeeboRegular: require("./fonts/Heebo-Regular.ttf"),
    HeeboMedium: require("./fonts/Heebo-Medium.ttf"),
  });

  // Style sheet object which contains the correct styles for the current theme (light or dark) 
  const [currStyleSet, setCurrStyleSet] = useState(lightStyles); 

  // Variable which specifies if the CryptoExchanger objects have been loaded from file
  const [cryptoLoaded, setCryptoLoaded] = useState(false);

  // Variable which specifies if the thread which loads the CryptoExchanger objects from file
  // has been started
  const [loadThreadStarted, setLoadThreadStarted] = useState(false);
  const [initialCashDialogVisibility, setInitialCashDialogVisibility] = useState(false);
  //const [cryptoPriceLoaded, setCryptoPriceLoaded] = useState(false);

  // Start the thread which loads the CryptoExchangers from file
  // if the thread has not already been started
  if(!loadThreadStarted) {
    setLoadThreadStarted(true);
    CryptoExchanger.loadCryptoExchangerData()
      .catch((error) => console.log("ERROR: cannot load crypto exchanger objects"))
      .then(() => {
        if(!CryptoExchanger.didDollarVolumesLoad())
          setInitialCashDialogVisibility(true);
        setCryptoLoaded(true);
      });
  }

  if(!fontsLoaded || !cryptoLoaded) {
    return <AppLoading />;
  } else {

    return (

      /* Wrap the entire application in a context which provides access to and
          ability to change between light and dark themes. */
      <ThemeContext.Provider 
        value={{
          styleSet: currStyleSet, 
          toggleStyleSet: () => {
            if(currStyleSet === lightStyles)
              setCurrStyleSet(darkStyles);
            else
              setCurrStyleSet(lightStyles);
            toggleTheme();
          } }}>

        <NavigationContainer
          style={currStyleSet.backgroundColor}>
          <NavDrawer />
        </NavigationContainer>

        {/* The dialog that appears when the user first starts the app and 
            needs to specify how much cash they start with */}
        <NumberInputModal
          visible={initialCashDialogVisibility}
          setVisibility={(visibility) => setInitialCashDialogVisibility(visibility)}
          promptString="How much cash would you like to start with?"
          onConfirmation={(inputNum) => {
            CryptoExchanger.initializeDollars(inputNum); 

            // rerendering all the screens to reflect data reset
            ExchangerComponent.forceUpdate();
            Profile.forceProfileUpdate();
            CoinSearchScreen.forceUpdate(); 
          }}/> 

      </ThemeContext.Provider>

    );
  }

}
