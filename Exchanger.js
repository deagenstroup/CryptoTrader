/* components imported from React */
import React, { Component, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
} from 'react-native';

/* components imported from Expo */
import AppLoading from 'expo-app-loading';
import * as FileSystem from 'expo-file-system';

import { LineChart } from 'react-native-chart-kit';

/* custom resources from expo */
import {
  Feather,
  FontAwesome,
  FontAwesom5,
  MaterialCommunityIcons,
  Ionicons,
  Entypo,
} from '@expo/vector-icons';
// import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';

import { updateNetValues } from './Profile.js';

const styles = StyleSheet.create({

  largeColumnBox: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  /** Used to contain vertical column flexboxes for the currency display components
      and buy/sell components **/
  leftAlignedRowContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  wideContainer: {
    width: '85%',
  },

  bottomMargin: {
    marginBottom: 10,
  },
  /** Used to provide horizontal space between various column containers and components **/
  rowSpacer: {
    marginRight: 12,
  },

  iconsColumn: {
    flexGrow: 0,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 2,
  },
  valuesColumn: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },

  /** Provides space between currency display components and exchange components **/
  subcontainerSpacer: {
    margin: 10,
    padding: 10,
  },

  exchangeModeButtonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    padding: 10,
    // margin: 4,
  },

  exchangeContainerSpacer: {
    // margin: 4,
    padding: 4,
  },

  columnCenteredFlexBox: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  rowCenteredFlexBox: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  exchangeRowContainer: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'space-evenly',

    width: '100%',
  },
  exchangeComponentRow: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',

    width: '100%',
    marginTop: 6,
    marginBottom: 6,
  },
  exchangeComponentSubRow: {
    flex: 0,
    flexDirection: 'row',

    width: '50%',
  },
  rightAlignedSubRow: {
    justifyContent: 'flex-end',
  },
  leftAlignedSubRow: {
    justifyContent: 'flex-start',
  },
  textInputMargin: {
    marginLeft: 6,
  },

  exchangeColumnContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    // borderColor: 'blue',
    // borderWidth: 2,
  },
  exchangeComponentColumn: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'space-evenly',

    width:'50%',
    padding: 4,
    // borderColor: 'red',
    // borderWidth: 2,
  },
  startAligned: {
    alignItems: 'flex-start',
  },
  endAligned: {
    alignItems: 'flex-end',
  },
  exchangeColumnComponentSpace: {
    marginTop: 6,
    marginBottom: 6,
  },

  webFont: {
    fontFamily: 'TitilliumWeb',
    fontSize: 32,
  },
  webFontSmall: {
    fontFamily: 'Aldrich',
    fontSize: 24,
  },
  invisibleText: {
    color: 'rgba(255, 255, 255, 0)',
  },
  greyText: {
    color: 'rgb(128, 128, 128)',
  },
  white: {
    color: 'white',
  },


  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginLeft: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'black',
  },
  square: {
    width: 54,
    height: 54,
  },
  wide: {
    flexDirection: 'row',
    flex: 1,
    // width: '37.5%',
    height: 54,
  },
  whiteBackground: {
    backgroundColor: 'white',
  },
  blackBackground: {
    backgroundColor: 'black',
  },
  exchangeButtonInsideContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontFamily: 'HeeboRegular',
    fontSize: 24,
    color: 'white',
  },

  borderRed : {
    borderColor: 'red',
    borderWidth: 2,
  }
});

export function round(value, decimals) {
  var num = Number(Math.trunc(value+'e'+decimals)+'e-'+decimals);
  if(!isNaN(num))
    return num;
  return 0;
}



var graphTimeframe = "7d";

/* The amount of dollars the user has, which is the same across all exchanger
   components */
var dollars = 100;

/* An array which holds object references to all exchanger components */
var exchangersArray = [];

/* Forces all of the exchanger objects to re-render their child components to
   screen */
function forceRender() {
  for(var i = 0; i < exchangersArray.length; i++) {
    exchangersArray[i].forceUpdate();
  }
}

export function getCryptoPercentageDataArray() {
  var coinArray = [];
  for(var i = 0; i < exchangersArray.length; i++) {
    var coinDollarValue = exchangersArray[i].getCoin() * exchangersArray[i].getCoinPrice();
    coinArray.push({
      name: exchangersArray[i].getCoinName(),
      population: coinDollarValue,
    });
  }
  return coinArray;
}

export function getTotalCurrentNetValue() {
  return dollars + getTotalCryptoValue();
}

export function getTotalCryptoValue() {
  var totalValue = 0;
  for(var i = 0; i < exchangersArray.length; i++) {
    totalValue = totalValue + exchangersArray[i].getCurrentNetValue();
  }
  console.log("totalValue: " + totalValue);
  return totalValue;
}

export function getDollars() {
  return dollars;
}

export function updateGraphTimeFrame(inTimeFrame) {
  graphTimeframe = inTimeFrame;

  for(var i = 0; i < exchangersArray.length; i++) {
    exchangersArray[i].fetchCoinData();
  }
}

export function get7DChartLabels() {
  var date = new Date();
  var labelArray = ["1", "2", "3", "4", "5", "6", "7"];
  var i;
  for(i = 6; i >= 0; i = i - 1) {
    var label = "" + (date.getMonth() + 1) + "/" + date.getDate();
    console.log(i + ": " + label);
    labelArray[i] = "" + (date.getMonth() + 1) + "/" + date.getDate();
    date = new Date(date.getTime() - 86400000);
  }
  return labelArray;
}

function get24HChartLabels() {
  var date = new Date();
  var labelArray = ["1", "2", "3", "4", "5", "6", "7"];
  var i;
  for(i = 6; i >= 0; i = i - 1) {
    var label;
    var hours = date.getHours();

    if(hours === 12) {
      label = "12PM";
    } else if(hours === 0) {
      label = "12AM";
    } else if(hours > 12) {
      label = "" + (hours-12) + "PM";
    } else {
      label = hours + "AM";
    }

    labelArray[i] = label;
    date = new Date(date.getTime() - 3600000*4);
  }
  return labelArray;
}

function get1MChartLabels() {
  var date = new Date();
  var labelArray = ["1", "2", "3", "4", "5", "6", "7"];
  var i;
  for(i = 6; i >= 0; i = i - 1) {
    labelArray[i] = "" + (date.getMonth() + 1) + "/" + date.getDate();
    date = new Date(date.getTime() - 86400000*4);
  }
  return labelArray;
}

/** An abstract component which is used on a screen to exchange a cryptocurrency **/
export default class Exchanger extends Component {

  constructor(props) {
    super(props);

    this.state = {

      /** If true, the price of the coin has been loaded from the web into
          the component **/
      isPriceLoaded: false,

      /** If true, both the amount of dollars and the amount of coins the user
          owns has been loaded into the component **/
      areValuesLoaded: false,


      isChartDataLoaded: false,

      /** The amount of respective cryptocurrency that the user owns. **/
      coin: 0,

      /** The price of a single unit of cryptocurrency, in dollars **/
      coinPrice: 0,

      /** If true, then cryptocurrency is being bought, otherwise it is being sold.
          If null, no exchange mode has been decided by the user yet **/
      exchangeMode: null,

      /** If true, then the crytocurrency is being bought or sold in the exchange
          box. If false, the dollar is. **/
      coinExchangeMode: true,

      inputText: "",

      /** Text that is contained within the input box next to the buy button **/
      buyInputText: "",

      /** Text that is contained within the input box next to the sell button **/
      sellInputText: "",

      /** Object which holds the data used in the chart. Is constructed by
          specific subclasses when loaded **/
      chartData: null,

      hideChart: false,

    }

    this.exchangeCurrency.bind(this);
    this.updateBuyInputText.bind(this);
    this.saveValuesToFile.bind(this);
    this.loadValuesFromFile.bind(this);
    this.getCoinExchangeMode.bind(this);
    this.switchCoinExchangeMode.bind(this);
    this.saveDollarsToFile.bind(this);
    this.saveCoinsToFile.bind(this);
    this.loadDollarsFromFile.bind(this);
    this.loadCoinsFromFile.bind(this);

    exchangersArray.push(this);
  }

  /** Called when the component is mounted into the GUI heiarchy **/
  componentDidMount() {
    this.fetchCoinPrice();
    this.fetchCoinData();
    this.loadValuesFromFile()
      .catch((error) => {
        console.log("Error loading values from file.");
        dollars = 100;
        this.setState({coin: 0});
      }).finally(() => {
        this.setState({areValuesLoaded: true});
      });

    // this.setState({areValuesLoaded: true});

  }

  /** Abstract method which is to be overwritten by subclasses, getting the
      price of whichever cryptocurrency the class represents. **/
  fetchCoinPrice() {}

  fetchCoinDataWithName(coinName) {
    var url = "https://api.coingecko.com/api/v3/coins/" + coinName + "/market_chart?vs_currency=usd&";

    if(graphTimeframe === "7d") {
      url = url + "days=7&interval=daily";
    } else if(graphTimeframe === "24h") {
      url = url + "&days=1&interval=hourly";
    } else if(graphTimeframe === "1m") {
      url = url + "&days=1&interval=hourly";
    }

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if(graphTimeframe === "7d") {
          this.parse7DCoinData(json);
        } else if(graphTimeframe === "24h") {
          this.parse24HCoinData(json);
        } else if(graphTimeframe === "1m") {
          this.parse1MCoinData(json);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({isChartDataLoaded: true});
        this.updateProfileValues();
      });
  }

  parse7DCoinData(json) {
    var chartLabels = get7DChartLabels();
    var chartDataArray = [10, 12, 15, 9, 8, 21, 19];

    for(var i = 0; i < 7; i++) {
      var num = round(json.prices[i][1], 2);
      // console.log("num: " + num);
      // var num = round( json.prices[i][1], 2);
      chartDataArray[i] = num;
    }

    var chartData = {
      labels: chartLabels,
      datasets: [
        {
          data: chartDataArray,
        }
      ],
    };

    this.setChartData(chartData);
  }

  parse24HCoinData(json) {
    var chartLabels = get24HChartLabels();
    var chartDataArray = [ 1, 2, 3, 4, 5, 6, 7];//, 7, 8, 9, 10, 11, 12 ];

    var time = Date.now();
    var j = chartDataArray.length - 1;
    for(var i = json.prices.length - 1; i >= 0 && j >= 0; i--) {
      var jsonTime = json.prices[i][0];
      if(jsonTime > (time - 360000*2) && jsonTime < (time + 360000*2)) {
        chartDataArray[j] = json.prices[i][1];
        j--;
        time = time - 3600000*4;
      }
    }

    var chartData = {
      labels: chartLabels,
      datasets: [
        {
          data: chartDataArray,
        }
      ],
    };

    this.setChartData(chartData);
  }

  parse1MCoinData(json) {
    var chartLabels = get1MChartLabels();
    var chartDataArray = [ 1, 2, 3, 4, 5, 6, 7];//, 7, 8, 9, 10, 11, 12 ];

    var j = chartDataArray.length - 1;
    for(var i = json.prices.length - 1; i >= 0 && j >= 0; i -= 4) {
      chartDataArray[j] = json.prices[i][1];
      j--;
    }

    var chartData = {
      labels: chartLabels,
      datasets: [
        {
          data: chartDataArray,
        }
      ],
    };

    this.setChartData(chartData);
  }


  getCoinExchangeMode () {
    return this.state.coinExchangeMode;
  }

  getCoinExchangeModeString() {
    if(this.getCoinExchangeMode()) {
      return this.getCoinName();
    } else {
      return "dollars";
    }
  }

  getCoinName() {
    return "coin";
  }

  getCoinIcon(inColor) {
    if(isNaN(inColor))
      return (<FontAwesome name="bitcoin" size={32} color="black" />);
    else {
      return (<FontAwesome name="bitcoin" size={32} color={inColor} />);
    }
  }

  getLineChart() {
    if(this.state.isChartDataLoaded && !this.state.hideChart) {
      return (
        <LineChart
          data={this.state.chartData}
          width={Dimensions.get("window").width * 0.94} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisSuffix=""
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#bfbfbf",
            backgroundGradientFrom: "#000000",
            backgroundGradientTo: "#545454",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#ffffff"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          getDotColor={(dataPoint, dataPointIndex) => {return "rgb(255, 255, 255)";}}
          formatYLabel={(inLabel) => {return inLabel.slice(0, -3);}}
        />
      );
    }
  }

  getCoin() {
    return round(this.state.coin, 5);
  }

  getCoinPrice() {
    return this.state.coinPrice;
  }

  getDollars() {
    return round(dollars, 2);
  }

  getDollarExchangeValue() {
    var inputValue = parseFloat(this.state.inputText);
    if(isNaN(inputValue))
      return 0.0;

    // if the user is buying coins
    if(this.state.exchangeMode) {

      // and the user is buying them in coins
      if(this.state.coinExchangeMode) {
        return 0 - (inputValue * this.state.coinPrice);
      }
      // and the user is buying them in dollars worth
      else {
        return 0 - inputValue;
      }
    }
    // if the user is selling coins
    else {
      // and the user is selling them in coins
      if(this.state.coinExchangeMode) {
        return 0 + (inputValue * this.state.coinPrice);
      }
      // and the user is selling them in dollars worth
      else {
        return 0 + inputValue;
      }
    }
  }

  getCryptoExchangeValue()  {
    var inputValue = parseFloat(this.state.inputText);
    if(isNaN(inputValue))
      return 0.0;

    // if the user is buying coins
    if(this.state.exchangeMode) {

      // and the user is buying them in coins
      if(this.state.coinExchangeMode) {
        return inputValue;
      }
      // and the user is buying them in dollars worth
      else {
        return 0 + (inputValue / this.state.coinPrice);
      }
    }
    // if the user is selling coins
    else {
      // and the user is selling them in coins
      if(this.state.coinExchangeMode) {
        return 0 - inputValue;
      }
      // and the user is selling them in dollars worth
      else {
        return 0 - (inputValue / this.state.coinPrice);
      }
    }
  }

  getCurrentNetValue() {
    var currentValue = (this.state.coin * this.state.coinPrice);
    console.log("coin + coinPrice at getCurrentNet Value " + this.state.coin + " " + this.state.coinPrice);
    return currentValue;
  }

  getCurrencyExchangeBox() {
    if(this.state.exchangeMode != null) {
      var dollarExchangeValue = round(this.getDollarExchangeValue(), 5);
      var cryptoExchangeValue = round(this.getCryptoExchangeValue(), 5);
      dollarExchangeValue = (dollarExchangeValue > 0 ? " + ":" - ") + Math.abs(dollarExchangeValue);
      cryptoExchangeValue = (cryptoExchangeValue > 0 ? " + ":" - ") + Math.abs(cryptoExchangeValue);
      return (
        <View style={styles.leftAlignedRowContainer}>
          <View style={styles.valuesColumn}>
            <Text style={[styles.webFont, styles.greyText]}>{dollarExchangeValue}</Text>
            <Text style={[styles.webFont, styles.greyText]}>{cryptoExchangeValue}</Text>
            <Text style={[styles.webFont, styles.invisibleText]}>invisible-Text</Text>
          </View>
        </View>
      );
    }

  }

  getDollarButtonStyle() {
    if(this.state.coinExchangeMode) {
      return [styles.button, styles.square, styles.whiteBackground];
    } else {
      return [styles.button, styles.square, styles.blackBackground];
    }
  }

  getCoinButtonStyle() {
    if(!this.state.coinExchangeMode) {
      return [styles.button, styles.square, styles.whiteBackground];
    } else {
      return [styles.button, styles.square, styles.blackBackground];
    }
  }

  getExchangeBox() {
    if(this.state.exchangeMode === null) {
      return (
        <View style={ [styles.columnCenteredFlexBox, styles.wideContainer, styles.bottomMargin] }>

          <View style={ styles.rowCenteredFlexBox }>
            <TouchableOpacity
              style={ [styles.button, styles.wide, styles.blackBackground] }
              onPress={() => this.setExchangeMode(true)} >
              <Text style={ [styles.webFontSmall, styles.white] }>buy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ [styles.button, styles.wide, styles.blackBackground] }
              onPress={ () => this.setExchangeMode(false) } >
              <Text style={ [styles.webFontSmall, styles.white] }>sell</Text>
            </TouchableOpacity>
          </View>

        </View>
      );
    } else {
      return (
        <View style={ [styles.columnCenteredFlexBox, styles.wideContainer, styles.bottomMargin] }>

          <View style={ [styles.rowCenteredFlexBox, styles.bottomMargin] }>
            <TouchableOpacity
              style={ this.getDollarButtonStyle() }
              onPress={() => this.setCoinExchangeMode(false)}>
              <View style={ styles.exchangeButtonInsideContainer }>
              <Feather name="dollar-sign" size={32} color={this.state.coinExchangeMode?'black':'white'} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={ this.getCoinButtonStyle() }
              onPress={() => this.setCoinExchangeMode(true)}>
              {this.getCoinIcon(this.state.coinExchangeMode?'white':'black')}
            </TouchableOpacity>
          </View>

          <View style={ styles.rowCenteredFlexBox }>
            <TouchableOpacity
              style={ [styles.button, styles.square, styles.blackBackground] }
              onPress={() => {
                this.exchangeCurrency();
                this.setExchangeMode(null);
              }} >
              <Text style={ [styles.webFontSmall, styles.white] }>
                {this.state.exchangeMode?<Feather name="plus" size={36} color="white" />:<Feather name="minus" size={36} color="white" />}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.textInputMargin, styles.webFont, styles.wide]}
              keyboardType="decimal-pad"
              onChangeText={text => this.updateInputText(text)}
              placeholder="0"
              value={this.state.inputText} />
          </View>

        </View>
      );
    }

    // if(this.state.exchangeMode) {
    //   return(
    //     <View style={ [styles.columnCenteredFlexBox, styles.wideContainer] }>
    //
    //       <View style={ styles.rowCenteredFlexBox }>
    //         <TouchableOpacity
    //           style={ [styles.button, styles.square, styles.blackBackground] }
    //           onPress={() => {
    //             this.exchangeCurrency();
    //             this.setExchangeMode(null);
    //           }} >
    //           <Text style={ [styles.webFontSmall, styles.white] }>+</Text>
    //         </TouchableOpacity>
    //         <TextInput
    //           style={[styles.textInputMargin, styles.webFont, styles.wide]}
    //           keyboardType="decimal-pad"
    //           onChangeText={text => this.updateInputText(text)}
    //           placeholder="0"
    //           value={this.state.inputText} />
    //       </View>
    //
    //     </View>
    //   );
    // } else {
    //   return(
    //     <View style={ [styles.columnCenteredFlexBox, styles.wideContainer] }>
    //
    //       <View style={ styles.rowCenteredFlexBox }>
    //         <TouchableOpacity
    //           style={ [styles.button, styles.square, styles.blackBackground] }
    //           onPress={() => {
    //             this.exchangeCurrency();
    //             this.setExchangeMode(null);
    //           }} >
    //           <Text style={ [styles.webFontSmall, styles.white] }>-</Text>
    //         </TouchableOpacity>
    //         <TextInput
    //           style={[styles.textInputMargin, styles.webFont, styles.wide]}
    //           keyboardType="decimal-pad"
    //           onChangeText={text => this.updateInputText(text)}
    //           placeholder="0"
    //           value={this.state.inputText} />
    //       </View>
    //
    //     </View>
    //   );
      // }

  }



  setCoin(inCoin) {
    this.setState({
      coin: inCoin,
    }, () => {
      this.updateProfileValues()
    });
  }

  setCoinPrice(inCoinPrice) {
    this.setState({
      coinPrice: inCoinPrice,
    }, () => {
      this.updateProfileValues();
    });
  }

  setChartData(inData) {
    this.setState({
      chartData: inData,
    }, () => {
      this.setState({
        isChartDataLoaded: true,
      });
    });
    // this.setState({
    //    isChartDataLoaded: true,
    // });
  }

  setHideChart(inHideChart) {
    this.setState({
      hideChart: inHideChart,
    });
  }

  setExchangeMode(inMode) {
    this.setState({exchangeMode: inMode})
  }

  setCoinExchangeMode(inMode) {
    this.setState({coinExchangeMode: inMode});
  }

  switchCoinExchangeMode () {
    if(this.state.coinExchangeMode) {
      this.setState({coinExchangeMode: false});
    } else {
      this.setState({coinExchangeMode: true});
    }
  }

  updateInputText(inStr) {
    this.setState({inputText: inStr});
  }

  updateBuyInputText (inStr) {
    this.setState({buyInputText: inStr});
  }

  updateSellInputText (inStr) {
    this.setState({sellInputText: inStr});
  }

  updateProfileValues() {
    updateNetValues(getTotalCryptoValue(), getDollars());
  }

  /** Performs an exchange of currency. If the provided parameter is true, then
      the respective currency (dollars or coins, based on the exchange mode)
      is bought, otherwise it is sold, using the respective input text values
      as the quantity of currency being bought or sold. **/
  exchangeCurrency () {

    var newCoinAmount = this.state.coin + this.getCryptoExchangeValue();
    var newDollarAmount = dollars + this.getDollarExchangeValue();

    dollars = newDollarAmount;
    this.setCoin(newCoinAmount);

    this.saveValuesToFile(newDollarAmount, newCoinAmount)
      .catch((error) => console.error(error))
      .finally(() => console.log("Values saved successfully."));

    this.updateInputText("");

    forceRender();
  }



  async saveDollarsToFile(dollarAmount) {
    var fileObj = {
      fileDollars: dollarAmount,
    }

    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + "dollars.txt",
      JSON.stringify(fileObj),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  }

  async saveCoinsToFile(coinAmount) {
    var fileObj = {
      fileCoins: coinAmount,
    }

    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + this.getCoinFileName(),
      JSON.stringify(fileObj),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  }

  // Saves the amount of dollars and coins that the user currently has to file
  async saveValuesToFile(dollarAmount, coinAmount) {
    this.saveDollarsToFile(dollarAmount);
    this.saveCoinsToFile(coinAmount);
  }

  async loadDollarsFromFile() {
    let fileString = await FileSystem.readAsStringAsync(
      FileSystem.documentDirectory + "dollars.txt",
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    console.log("Loaded File Object: " + fileString);

    var fileObj = JSON.parse(fileString);
    dollars = fileObj.fileDollars;
  }

  async loadCoinsFromFile() {
    let fileString = await FileSystem.readAsStringAsync(
      FileSystem.documentDirectory + this.getCoinFileName(),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    console.log("Loaded File Object: " + fileString);

    var fileObj = JSON.parse(fileString);

    this.setCoin(fileObj.fileCoins);
    // this.setState({
    //   coin: fileObj.fileCoins,
    // });
  }

  // Loads the amount of dollars and bitcoin from the last time it was saved
  async loadValuesFromFile() {
    this.loadDollarsFromFile()
      .catch((error) => this.setState({dollarAmount: 0}));
    this.loadCoinsFromFile()
      .catch((error) => this.setState({coinAmount: 0}));
  }



  render () {
    if(!this.state.isPriceLoaded || !this.state.areValuesLoaded || !this.state.isChartDataLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={styles.largeColumnBox}>

          { this.getLineChart() }

          {/** Row containing value container and hypothetical value container **/}
          <View style={[styles.leftAlignedRowContainer, styles.subcontainerSpacer, styles.wideContainer]}>
            {/* currency display elements */}
            <View style={styles.leftAlignedRowContainer}>
              <View style={[styles.iconsColumn, styles.rowSpacer]}>
                <Feather name="dollar-sign" size={32} color="black" />
                {this.getCoinIcon("black")}
                {/**<Entypo name="price-tag" size={24} color="black" />**/}
                <Ionicons name="md-pricetag" size={24} color="black" />
              </View>

              <View style={styles.valuesColumn}>
                <Text style={styles.webFont}>{this.getDollars()}</Text>
                <Text style={styles.webFont}>{this.getCoin()}</Text>
                <Text style={styles.webFont}>{this.state.coinPrice}</Text>
              </View>
            </View>

            {/* hypothetical currency display elements **/}

            {this.getCurrencyExchangeBox()}

          </View>


          {/* currency exchange elements */}

          {this.getExchangeBox()}

        </View>
      );

    }
  }
}
