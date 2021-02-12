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

  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Used to contain vertical column flexboxes for the currency display components
      and buy/sell components **/
  leftAlignedRowContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
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

  moneyText: {
    fontFamily: 'TitilliumWeb',
    fontSize: 32,
  },
  invisibleText: {
    color: 'rgba(255, 255, 255, 0)',
  },
  greyText: {
    color: 'rgb(128, 128, 128)',
  },

  exchangeButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginLeft: 8,
    marginRight: 8,
    width: 54,
    height: 54,
    // backgroundColor: '#cdcdd1',
  },
  selectedButton: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
  },
  unselectedButton: {
    backgroundColor: 'black',
  },
  exchangeButtonInsideContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontFamily: 'Aldrich',
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

export function getChartLabels() {
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

      /** If true, then the crytocurrency is being bought or sold in the exchange
          box. If false, the dollar is. **/
      coinExchangeMode: true,

      /** Text that is contained within the input box next to the buy button **/
      buyInputText: "",

      /** Text that is contained within the input box next to the sell button **/
      sellInputText: "",

      /** Object which holds the data used in the chart. Is constructed by
          specific subclasses when loaded **/
      chartData: "NaN",

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

  fetchCoinDataFromURL(inURL) {
    fetch(inURL)
      .then((response) => response.json())
      .then((json) => {
        var chartLabels = getChartLabels();
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
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({isChartDataLoaded: true});
        this.updateProfileValues();
      });
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
    return round(this.state.coin, 7);
  }

  getDollars() {
    return round(dollars, 2);
  }

  getDollarExchangeValue() {
    var buyInputValue = parseFloat(this.state.buyInputText);
    var sellInputValue = parseFloat(this.state.sellInputText);
    if(!isNaN(buyInputValue)) {
      if(this.state.coinExchangeMode) {
        return 0 - (buyInputValue * this.state.coinPrice);
      } else {
        return buyInputValue;
      }
    } else if(!isNaN(sellInputValue)) {
      if(this.state.coinExchangeMode) {
        return 0 + (sellInputValue * this.state.coinPrice);
      } else {
        return 0 - sellInputValue;
      }
    }
  }

  getCryptoExchangeValue()  {
    var buyInputValue = parseFloat(this.state.buyInputText);
    var sellInputValue = parseFloat(this.state.sellInputText);
    if(!isNaN(buyInputValue)) {
      if(this.state.coinExchangeMode) {
        return buyInputValue;
      } else {
        return 0 - (buyInputValue / this.state.coinPrice);
      }
    } else if(!isNaN(sellInputValue)) {
      if(this.state.coinExchangeMode) {
        return 0 - sellInputValue;
      } else {
        return (sellInputValue / this.state.coinPrice);
      }
    }
  }

  getCurrentNetValue() {
    var currentValue = (this.state.coin * this.state.coinPrice);
    console.log("coin + coinPrice at getCurrentNet Value " + this.state.coin + " " + this.state.coinPrice);
    return currentValue;
  }

  getCurrencyExchangeBox() {
    if(!isNaN(parseFloat(this.state.buyInputText)) || !isNaN(parseFloat(this.state.sellInputText))) {
      var dollarExchangeValue = round(this.getDollarExchangeValue(), 7);
      var cryptoExchangeValue = round(this.getCryptoExchangeValue(), 7);
      dollarExchangeValue = (dollarExchangeValue > 0 ? " + ":" - ") + Math.abs(dollarExchangeValue);
      cryptoExchangeValue = (cryptoExchangeValue > 0 ? " + ":" - ") + Math.abs(cryptoExchangeValue);
      return (
        <View style={styles.leftAlignedRowContainer}>
          <View style={styles.valuesColumn}>
            <Text style={[styles.moneyText, styles.greyText]}>{dollarExchangeValue}</Text>
            <Text style={[styles.moneyText, styles.greyText]}>{cryptoExchangeValue}</Text>
            <Text style={[styles.moneyText, styles.invisibleText]}>invisible-Text</Text>
          </View>
        </View>
      );
    }

  }

  getDollarButtonStyle() {
    if(this.state.coinExchangeMode) {
      return [styles.exchangeButton, styles.unselectedButton];
    } else {
      return [styles.exchangeButton, styles.selectedButton];
    }
  }

  getCoinButtonStyle() {
    if(!this.state.coinExchangeMode) {
      return [styles.exchangeButton, styles.unselectedButton];
    } else {
      return [styles.exchangeButton, styles.selectedButton];
    }
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
  exchangeCurrency (buy) {

    /** Parse the input text for the exchange amount and exit if it is not a number. **/
    var exchangeAmount = ( buy ? parseFloat(this.state.buyInputText) : parseFloat(this.state.sellInputText) );
    if(isNaN(exchangeAmount))
      return;

    console.log("dollar: " + dollars +
                "\ncoin: " + this.state.coin);

    var newDollarAmount;
    var newCoinAmount;
    if(this.getCoinExchangeMode() == true) {
      if(buy) {
        newDollarAmount = dollars - (exchangeAmount * this.state.coinPrice);
        newCoinAmount = this.state.coin + exchangeAmount;
      } else {
        newDollarAmount = dollars + (exchangeAmount * this.state.coinPrice);
        newCoinAmount = this.state.coin - exchangeAmount;
      }
    } else {
      if(buy) {
        newDollarAmount = dollars + exchangeAmount;
        newCoinAmount = this.state.coin - (exchangeAmount / this.state.coinPrice);
      } else {
        newDollarAmount = dollars - exchangeAmount;
        newCoinAmount = this.state.coin + (exchangeAmount / this.state.coinPrice);
      }
    }

    console.log("exchangeAmount: " + exchangeAmount +
                "\nnewDollarAmount: " + newDollarAmount +
                "\nnewCoinAmount: " + newCoinAmount);

    if(newDollarAmount < 0 || newCoinAmount < 0
      || isNaN(newDollarAmount) || isNaN(newCoinAmount))
      return;

    dollars = newDollarAmount;
    this.setState({
      coin: newCoinAmount,
      buyInputText: "",
      sellInputText: "",
    });

    this.saveValuesToFile(newDollarAmount, newCoinAmount)
      .catch((error) => console.error(error))
      .finally(() => console.log("Values saved successfully."));

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
        <View style={styles.screenContainer}>

          { this.getLineChart() }

          {/** Row containing value container and hypothetical value container **/}
          <View style={[styles.leftAlignedRowContainer, styles.subcontainerSpacer]}>
            {/* currency display elements */}
            <View style={styles.leftAlignedRowContainer}>
              <View style={[styles.iconsColumn, styles.rowSpacer]}>
                <Feather name="dollar-sign" size={32} color="black" />
                {this.getCoinIcon("black")}
                {/**<Entypo name="price-tag" size={24} color="black" />**/}
                <Ionicons name="md-pricetag" size={24} color="black" />
              </View>

              <View style={styles.valuesColumn}>
                <Text style={styles.moneyText}>{this.getDollars()}</Text>
                <Text style={styles.moneyText}>{this.getCoin()}</Text>
                <Text style={styles.moneyText}>{this.state.coinPrice}</Text>
              </View>
            </View>

            {/* hypothetical currency display elements **/}

            {this.getCurrencyExchangeBox()}

          </View>


          {/* currency exchange elements */}


          <View style={ [styles.exchangeRowContainer, styles.subcontainerSpacer] }>

            {/** Row 1 **/}
            <View style={styles.exchangeComponentRow}>

              {/** Subrow-Left **/}
              <View style={[styles.exchangeComponentSubRow, styles.rightAlignedSubRow]}>
                <TouchableOpacity
                  style={ this.getDollarButtonStyle() }
                  onPress={() => this.setCoinExchangeMode(false)}>
                  <View style={ styles.exchangeButtonInsideContainer }>
                  <Feather name="dollar-sign" size={32} color={this.state.coinExchangeMode?'white':'black'} />
                  </View>
                </TouchableOpacity>
              </View>

              {/** Subrow-Right **/}
              <View style={[styles.exchangeComponentSubRow, styles.leftAlignedSubRow]}>
                <TouchableOpacity
                  style={ this.getCoinButtonStyle() }
                  onPress={() => this.setCoinExchangeMode(true)}>
                  {this.getCoinIcon(this.state.coinExchangeMode?'black':'white')}
                </TouchableOpacity>
              </View>

            </View>

            {/** Row 2 **/}
            <View style={styles.exchangeComponentRow}>

              {/** Subrow-Left **/}
              <View style={[styles.exchangeComponentSubRow, styles.rightAlignedSubRow]}>
                <TouchableOpacity
                  style={[styles.rowSpacer, styles.exchangeButton, styles.unselectedButton]}
                  onPress={() => this.exchangeCurrency(true)} >
                  <Text style={styles.buttonText}>buy</Text>
                </TouchableOpacity>
              </View>

              {/** Subrow-Right **/}
              <View style={[styles.exchangeComponentSubRow, styles.leftAlignedSubRow]}>
                <TextInput
                  style={[styles.textInputMargin, styles.moneyText]}
                  keyboardType="decimal-pad"
                  onChangeText={text => this.updateBuyInputText(text)}
                  onFocus={() => this.setHideChart(true)}
                  onEndEditing={() => this.setHideChart(false)}
                  placeholder="0"
                  value={this.state.buyInputText} />
              </View>

            </View>

            {/** Row 3 **/}
            <View style={styles.exchangeComponentRow}>

              {/** Subrow-Left **/}
              <View style={[styles.exchangeComponentSubRow, styles.rightAlignedSubRow]}>
                <TouchableOpacity
                  style={[styles.rowSpacer, styles.exchangeButton, styles.unselectedButton]}
                  onPress={() => this.exchangeCurrency(false)} >
                  <Text style={styles.buttonText}>sell</Text>
                </TouchableOpacity>
              </View>

              {/** Subrow-Right **/}
              <View style={[styles.exchangeComponentSubRow, styles.leftAlignedSubRow]}>
                <TextInput
                  style={[styles.textInputMargin, styles.moneyText]}
                  keyboardType="decimal-pad"
                  onChangeText={text => this.updateSellInputText(text)}
                  onFocus={() => this.setHideChart(true)}
                  onEndEditing={() => this.setHideChart(false)}
                  placeholder="0"
                  value={this.state.sellInputText} />
              </View>

            </View>

          </View>

        </View>
      );

    }
  }
}
