/* components imported from React */
import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Button,
} from 'react-native';

/* Components and resources imported from expo packages */
import AppLoading from 'expo-app-loading';
import * as FileSystem from 'expo-file-system';
import { Feather, MaterialIcons, Foundation } from '@expo/vector-icons';
import { AdMobBanner } from 'expo-ads-admob';

import { PieChart } from 'react-native-chart-kit';

// import { Modal, ModalContent, ModalPortal } from 'react-native-modals';

import CryptoExchanger from "./CryptoExchanger.js";
import ExchangerComponent from "./Exchanger.js";
import { getAppStyleSet } from "./App.js";

function round(value, decimals) {
  var num = Number(Math.trunc(value+'e'+decimals)+'e-'+decimals);
  if(!isNaN(num))
    return num;
  return 0;
}

const styles = StyleSheet.create({
  
  // container which holds everything on the screen, except the header
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  // container which holds all of the profile components below the ad banner
  scrollViewContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },
  
  // style for the scroll view container for all props which affect the 
  // content of the container and not the container itself
  scrollViewContainerContent: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  subcontainerSpacer: {
    paddingTop: 24,
    paddingBottom: 24,
  },

  profileTitle: {
    fontFamily: 'Aldrich',
    fontSize: 22,
  },
  
  // container for all of the stats text components
  statsContainer: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    padding: 10,
    marginVertical: 6,

    width: '75%',

    borderWidth: 2,
    borderRadius: 6,
  },

  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 2,
  },

  statsContainerLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  statsContainerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  // Style for the text labels on the left side of the stats box
  statsTextLabel: {
    fontFamily: 'TitilliumWeb',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'lowercase',
  },

  statsText: {
    fontFamily: 'TitilliumWeb',
    fontSize: 18,
  },

  statsSubtext: {
    color: 'rgb(128, 128, 128)'
  },

  greenStatsSubtext: {
    color: 'rgb(80, 160, 80)',
  },   

  greenStatsText: {
    color: 'rgb(0, 160, 0)',
  },

  redStatsText: {
    color: 'rgb(160, 0, 0)',
  },

  redStatsSubtext: {
    color: 'rgb(160, 80, 80)',
  },  

  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    width: '75%',
  },

  profileButton: {
    // marginLeft: 6,
    // marginRight: 6,
    margin: 6,
    padding: 4,
    width: 46,
    height: 46,

    borderRadius: 6,
    backgroundColor: 'black', //'#cdcdd1',
  },

  iconContainer: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    // borderColor: 'green',
    // borderWidth: 2,
  },

  dialogContainer: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    padding: 15,

    // borderColor: 'red',
    // borderWidth: 2,
  },

  dialogRow: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,

    // borderWidth: 2,
    // borderColor: 'blue',
  },

  dialogButton: {
    width: 100,
    height: 45,
    borderRadius: 5 ,
    backgroundColor: 'rgb(181, 181, 181)',
    marginLeft: 5,
    marginRight: 5,
  },

  dialogTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dialogText: {
    fontFamily: 'TitilliumWeb',
    fontSize: 22,
  },

});

export default class Profile extends Component {

  static profileComponent;

  static colorsArray = ['#0E7D96', '#0C1D89', '#3ACCED', '#3951EE', '#97A6C2'];
  //static colorsArray = [ 'rgba(153, 215, 230, 1)', 'rgba(138, 150, 229, 1)', 'rgba(139, 212, 228, 1)', 'rgba(42, 65, 213, 1)', 'rgba(41, 182, 214, 1)'];
  //static colorsArray=['rgba(45, 108, 210, 1)', 'rgba(55, 66, 210, 1)', 'rgba(55, 66, 210, 1)', 'rgba(55, 66, 210, 1)', 'rgba(55, 66, 210, 1)'];

  static forceProfileUpdate() {
    if(Profile.profileComponent != null)
      Profile.profileComponent.forceUpdate();
  }

  static resetProfile() {
    if(Profile.profileComponent != null)
      Profile.profileComponent.resetProfile();
  }

  static getColorScheme() {
    if(Profile.profileComponent != null)
      return Profile.profileComponent.getColorScheme();
    return null;
  }

  
  // Takes in an array of objects with the names and dollar values of cryptocurrencies,
  // orders them in descending order based on their value, and combines all currencies
  // below the top four into an "other" category for use in profile pie chart
  static formatCryptoValueArray(cryptoArray) {
     // Selection sort the array into descending order based on value
    var i, j, max;
    for(i = 0; i < cryptoArray.length-1; i++) {
      max = i;
      for(j = i+1; j < cryptoArray.length; j++) {
        if(cryptoArray[j].population > cryptoArray[max].population) {
          max = j;
        }
      }
      var swap = cryptoArray[i];
      cryptoArray[i] = cryptoArray[max];
      cryptoArray[max] = swap;

      cryptoArray[i].population = round(cryptoArray[i].population, 5);
    }

    for(i = 0; i < 4; i++) {
      if(cryptoArray[i] == null || cryptoArray[i].population == 0)
        cryptoArray.splice(i, cryptoArray.length-i);
    }

    if(cryptoArray.length > 4) {
      while(cryptoArray.length > 5) {
        cryptoArray[4].population += cryptoArray[5].population;
        cryptoArray.splice(5, 1);
      }
      cryptoArray[4].name = "Other";
    }

    return cryptoArray;
  }

  constructor(props) {
    super(props);

    this.state = {

      dateCreated: new Date(),

      fileName: 'profile.txt',

      isLoaded: false,

      resetDialogVisible: false,

      // Controls the colors of the main components in the application
      // light: black components and white background
      // blue: blue components and white background
      // dark: white components and black background
      // blue dark: blue components and black background
      colorScheme: 'light',

    }

    Profile.profileComponent = this;
  }

  componentDidMount() {
    this.loadValuesFromFile()
        .catch((error) => { 
          console.log("Error loading profile from file.");
          this.setState({dateCreated: new Date(2000, 0, 0)});
        })
        .finally(() => this.setState({isLoaded: true}));
  }

  getDateCreated() {
    return this.state.dateCreated;
  }

  getDateCreatedString() {
    return this.state.dateCreated.toLocaleDateString('en-US', {
      day: 'numeric',
      weekday: 'narrow',
      year: 'numeric',
    });
  }

  getProfileAge() {
    var todaysDate = new Date();
    var timeDifference = todaysDate.getTime() - this.getDateCreated().getTime();
    return Math.trunc(timeDifference / (1000 * 3600 * 24));
  }

  getColorScheme() {
    return this.state.colorScheme;
  }

  getPieChart() {
    if(CryptoExchanger.getTotalCryptoValue() > 0) {
      return (<PieChart
        data={this.getPieChartData()}
        width={Dimensions.get('window').width - 16}
        height={220}
        chartConfig={{
          backgroundColor: 'blue',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          color: 'white',
          marginVertical: 8,
        }}
        accessor="population"
        backgroundColor={getAppStyleSet().backgroundColor.backgroundColor}
        paddingLeft="15"
        //absolute //for the absolute number remove if you want percentage
      />);
    }      
  }

  getPieChartData() {
    var data = Profile.formatCryptoValueArray(CryptoExchanger.getCryptoValueArray());
    var colorGradient = 255 / data.length;
    var color = 0;
    for(var i = 0; i < data.length; i++) {
      //data[i].color = "rgb(" + color + "," + color + "," + color + ")";
      data[i].color = Profile.colorsArray[i];
      data[i].legendFontSize = 15;
      data[i].legendFontColor = getAppStyleSet().primColor.color;
      color = Math.trunc(color + colorGradient);
    }
    return data;
  }
  
  // Takes in the number of a cryptocurrencies net profit and returns the text which 
  // is used in the profile to represent it, does not affect the style of the text
  getCryptoListTagProfitText(inNum) {
    inNum = parseFloat(inNum).toFixed(2);
    var prefix;
    if(inNum > 0)
      prefix = "+$";
    else if(inNum < 0)
      prefix = "-$";
    else
      prefix = "$";
    var inNum = Math.abs(inNum);
    return prefix + inNum;
  }

  static getCoinName(inCryptoObj) {
    if(inCryptoObj != null)
      return inCryptoObj.getCoinName();
    return "null";
  }

  // Returns a collection of Text components which represents the profits or values of all
  // of the cryptocurrencies in the portfolio.
  getCryptoListTags(profits) {
    var cryptoArray = CryptoExchanger.getCryptoExchangerArray();
    if(cryptoArray == null ||
       cryptoArray.length <= 0)
      return;

    console.log("cryptoArray upon draw: " + cryptoArray);

    if(profits) {
      return cryptoArray.map( (cryptoObj) => (
        <View style={ styles.statsRow }>
          <View style={ styles.statsContainerLeft }>
            <Text style={ [styles.statsTextLabel, styles.statsSubtext] }>
              {Profile.getCoinName(cryptoObj)}
            </Text>
          </View>
          <View style={ styles.statsContainerRight }>
            <Text style={ [styles.statsText, this.getProfitColor(parseFloat(cryptoObj.getNetProfit()).toFixed(2), true)] } >
            {this.getCryptoListTagProfitText(cryptoObj.getNetProfit())}
            </Text>
          </View>
        </View>
      ));
    }
    return cryptoArray.map( (cryptoObj) => (
      <View style={ styles.statsRow }>
        <View style={ styles.statsContainerLeft }>
          <Text style={ [styles.statsTextLabel, styles.statsSubtext] }>
            {Profile.getCoinName(cryptoObj)}
          </Text>
        </View>
        <View style={ styles.statsContainerRight }>
          <Text style={ [styles.statsText, styles.statsSubtext] } >
            ${round(cryptoObj.getCurrentValue(), 2)}
          </Text>
        </View>
      </View>
    ));
  }

  getProfitColor(inNum, isSubtext) {
    if(isSubtext && inNum == 0) {
      return styles.statsSubtext;
    } else if(isSubtext && inNum > 0) {
      return styles.greenStatsSubtext;
    } else if(isSubtext && inNum < 0) {
      return styles.redStatsSubtext;
    } else if(inNum == 0) {
      return getAppStyleSet().primColor; 
    } else if(inNum > 0) {
      return styles.greenStatsText;
    } else if(inNum < 0) {
      return styles.redStatsText;
    }
  }

  resetProfile() {
    this.setState({
      dateCreated: new Date(),
    }, () => this.saveValuesToFile());
  }



  async saveValuesToFile() {
    var fileObj = {
      fileDateString: this.getDateCreatedString(),
      //fileDateString: new Date(2021, 2, 5),
    }

    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + this.state.fileName,
      JSON.stringify(fileObj),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    console.log("Profile saved successfully.");
  }

  async loadValuesFromFile() {
    let fileString = await FileSystem.readAsStringAsync(
      FileSystem.documentDirectory + this.state.fileName,
      { encoding: FileSystem.EncodingType.UTF8 }
    );

    var fileObj = JSON.parse(fileString);
    this.setState({
      dateCreated: new Date(fileObj.fileDateString),
    });
  }

  render() {

    {/* If the data for this component or the CryptoExchangers are not loaded, render a loading screen */}
    if(!this.state.isLoaded || !CryptoExchanger.getAreCryptosLoaded()) {
      return <AppLoading />;
    
    {/* Main rendering code */}
    } else {

      return (
        <View style={ [styles.screenContainer, {alignItems: "center"}] }>
          <AdMobBanner
            bannerSize="smartBannerPortrait"
            adUnitID="ca-app-pub-3940256099942544/6300978111" />
           
           {/* Container for all the content of the Profile screen */}
           <ScrollView
            style={ [styles.scrollViewContainer, getAppStyleSet().backgroundColor] }
            contentContainerStyle={ styles.scrollViewContainerContent }>

              { this.getPieChart() }

              {/* The stats container  */}
              <View style={ [styles.statsContainer, styles.subcontainerSpacer, getAppStyleSet().borderColor] } >

                {/* Net profit row */}
                <View style={ styles.statsRow }>
                  <View style={ styles.statsContainerLeft }>
                    <Text style={ [styles.statsTextLabel, getAppStyleSet().primColor] } >net profit</Text>
                  </View>
                  <View style={ styles.statsContainerRight }>
                    <Text style={ 
                      [styles.statsText, this.getProfitColor(parseFloat(CryptoExchanger.getTotalProfit()).toFixed(2), false)] 
                    }>{this.getCryptoListTagProfitText(CryptoExchanger.getTotalProfit())}</Text>
                  </View>
                </View>
               
                {/* Collection of rows with individual profits for each cryptocurrency */}
                { this.getCryptoListTags(true) }
                
                {/* Net worth row */}
                <View style={ styles.statsRow }>
                  <View style={ styles.statsContainerLeft }><Text style={ [styles.statsTextLabel, getAppStyleSet().primColor] } >net worth</Text></View>
                  <View style={ styles.statsContainerRight }><Text style={ [styles.statsText, getAppStyleSet().primColor] } >${round(CryptoExchanger.getTotalCurrentNetValue(), 2)}</Text></View>
                </View>
                
                {/* Dollar portion of net worth breakdown */} 
                <View style={ styles.statsRow }>
                  <View style={ styles.statsContainerLeft }><Text style={ [styles.statsTextLabel, styles.statsSubtext] }>dollars</Text></View>
                  <View style={ styles.statsContainerRight }><Text style={ [styles.statsText, styles.statsSubtext] } >${round(CryptoExchanger.getDollars(), 2)}</Text></View>
                </View>
                
                {/* Collection of rows with individual net worths for each cryptocurrency */}
                { this.getCryptoListTags(false) }

                {/* Date started row */}
                <View style={ styles.statsRow }>
                  <View style={ styles.statsContainerLeft }><Text style={ [styles.statsTextLabel, getAppStyleSet().primColor] } >date started</Text></View>
                  <View style={ styles.statsContainerRight }><Text style={ [styles.statsText, getAppStyleSet().primColor] } >{this.getDateCreatedString()}</Text></View>
                </View>

                {/* Profile age row */}
                <View style={ styles.statsRow }>
                  <View style={ styles.statsContainerLeft }><Text style={ [styles.statsTextLabel, getAppStyleSet().primColor] } >profile age</Text></View>
                  <View style={ styles.statsContainerRight }><Text style={ [styles.statsText, getAppStyleSet().primColor] } >{this.getProfileAge()} days</Text></View>
                </View>

                {/* Starting cash row */}
                <View style={ styles.statsRow }>
                  <View style={ styles.statsContainerLeft }><Text style={ [styles.statsTextLabel, getAppStyleSet().primColor] } >starting cash</Text></View>
                  <View style={ styles.statsContainerRight }><Text style={ [styles.statsText, getAppStyleSet().primColor] } >${CryptoExchanger.getStartingDollars()}</Text></View>
                </View>

              </View>

            </ScrollView>
          </View>
      );
    }
  }
}
