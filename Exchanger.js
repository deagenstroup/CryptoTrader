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

import CryptoExchanger from './CryptoExchanger';

import { LineChart } from 'react-native-chart-kit';

/* custom resources from expo */
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  Ionicons,
  Entypo,
} from '@expo/vector-icons';

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

  inputBox: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: 'rgb(128, 128, 128)',
    paddingLeft: 6,
    paddingBottom: 2,
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

export function get7DChartLabels() {
  var date = new Date();
  var labelArray = ["1", "2", "3", "4", "5", "6", "7"];
  var i;
  for(i = 6; i >= 0; i = i - 1) {
    var label = "" + (date.getMonth() + 1) + "/" + date.getDate();
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
export default class ExchangerComponent extends Component {

  // Returns the relevent coin icon for the cryptocurrency with the provided coinID
  getCoinIcon(inColor) {
    var inCoinID = this.getCoinID();
    if(inCoinID == "bitcoin") {
      return (<FontAwesome name="bitcoin" size={34} color={inColor} />);
    } else if(inCoinID == "ethereum") {
      return (<MaterialCommunityIcons name="ethereum" size={34} color={inColor} />);
    } else if(inCoinID == "litecoin") {
      return (<MaterialCommunityIcons name="litecoin" size={28} color={inColor} />);
    } else if(inCoinID == "monero") {
      return (<FontAwesome5 name="monero" size={28} color={inColor} />);
    } else {
      return (<FontAwesome5 name="coins" size={24} color={inColor} />);
    }
  }

  static exchanger;

  static graphTimeframe = "7d";

  static reinitalizeValues(inCryptoExchanger) {
    ExchangerComponent.exchanger.reinitalizeValues(inCryptoExchanger);
    ExchangerComponent.exchanger.forceUpdate();
  }

  static forceUpdate() {
    ExchangerComponent.exchanger.forceUpdate();
  }

  static updateGraphTimeFrame(inTimeFrame) {
    ExchangerComponent.graphTimeframe = inTimeFrame;

    ExchangerComponent.exchanger.fetchCoinData();
  }

  constructor(props) {
    super(props);

    this.state = {

      isChartDataLoaded: false,

      /** If true, then cryptocurrency is being bought, otherwise it is being sold.
          If null, no exchange mode has been decided by the user yet **/
      exchangeMode: null,

      /** If true, then the crytocurrency is being bought or sold in the exchange
          box. If false, the dollar is. **/
      coinExchangeMode: true,

      /** Text that is contained within the input box within the exchange box **/
      inputText: "",

      /** Object which holds the data used in the chart. Is constructed by
          specific subclasses when loaded **/
      chartData: null,

      cryptoExchanger: props.cryptoExchanger,

    }

    this.exchangeCurrency.bind(this);
    this.getCoinExchangeMode.bind(this);

    ExchangerComponent.exchanger = this;
  }

  /** Called when the component is mounted into the GUI heiarchy **/
  componentDidMount() {
    this.fetchCoinData();
    // CryptoExchanger.saveCryptoExchangers();
  }

  /** Abstract method which is to be overwritten by subclasses, getting the
      price of whichever cryptocurrency the class represents. **/
  fetchCoinPrice() {}

  /** Fetchs data about the cryptocurrency with the supplied name and applies
      the data to the graph in the Exchanger based on the graph's mode (7d, 24h, 1m) **/
  fetchCoinData() {
    var url = "https://api.coingecko.com/api/v3/coins/" + this.getCoinID()   + "/market_chart?vs_currency=usd&";

    if(ExchangerComponent.graphTimeframe === "7d") {
      url = url + "days=7&interval=daily";
    } else if(ExchangerComponent.graphTimeframe === "24h") {
      url = url + "&days=1&interval=hourly";
    } else if(ExchangerComponent.graphTimeframe === "1m") {
      url = url + "&days=1&interval=hourly";
    }

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        if(ExchangerComponent.graphTimeframe === "7d") {
          this.parse7DCoinData(json);
        } else if(ExchangerComponent.graphTimeframe === "24h") {
          this.parse24HCoinData(json);
        } else if(ExchangerComponent.graphTimeframe === "1m") {
          this.parse1MCoinData(json);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({isChartDataLoaded: true});
      });
  }

  /** Helper methods for fetchCoinDataWithName() **/
  parse7DCoinData(json) {
    var chartLabels = get7DChartLabels();
    var chartDataArray = [10, 12, 15, 9, 8, 21, 19];

    for(var i = 0; i < 7; i++) {
      var num = round(json.prices[i][1], 2);
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

  getCoinID() {
    return this.state.cryptoExchanger.getCoinID();
  }

  getCoinName() {
    return this.state.cryptoExchanger.getCoinName();
  }

  getCoin() {
    return this.state.cryptoExchanger.getCoin();
  }

  getCoinPrice() {
    return this.state.cryptoExchanger.getCoinPrice();
  }

  getDollars() {
    return CryptoExchanger.getDollars();
  }

  /** Calculates the net amount of dollars that would be gained or lost from
      an exchange of the number the user has specified in the inputText **/
  getDollarExchangeValue() {
    var inputValue = parseFloat(this.state.inputText);
    if(isNaN(inputValue))
      return 0.0;

    // if the user is buying coins
    if(this.state.exchangeMode) {

      // and the user is buying them in coins
      if(this.state.coinExchangeMode) {
        return 0 - this.state.cryptoExchanger.getDollarExchangeValue(inputValue);
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
        return 0 + this.state.cryptoExchanger.getDollarExchangeValue(inputValue);
      }
      // and the user is selling them in dollars worth
      else {
        return 0 + inputValue;
      }
    }
  }

  /** Calculates the net amount of crypto that would be gained or lost from
      an exchange of the number the user has specified in the inputText **/
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
        return 0 + this.state.cryptoExchanger.getCryptoExchangeValue(inputValue);
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
        return 0 - this.state.cryptoExchanger.getCryptoExchangeValue(inputValue);
      }
    }
  }




  getLineChart() {
    if(this.state.isChartDataLoaded) {
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

  // getCoinIcon(inColor) {
  //   ExchangerComponent.getCoinIcon(this.getCoinID(), inColor);
  // }

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
              style={[styles.textInputMargin, styles.webFont, styles.wide, styles.inputBox]}
              keyboardType="decimal-pad"
              onChangeText={text => this.updateInputText(text)}
              placeholder="0"
              value={this.state.inputText} />
          </View>

        </View>
      );
    }
  }


  reinitalizeValues(inCryptoExchanger) {
    this.setState({
      cryptoExchanger: inCryptoExchanger,
      isChartDataLoaded: false,
      exchangeMode: null,
      coinExchangeMode: true,
      inputText: "",
      chartData: null,
    }, () => {
      this.fetchCoinData();
      this.forceUpdate();
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
  }

  setExchangeMode(inMode) {
    this.setState({exchangeMode: inMode})
  }

  setCoinExchangeMode(inMode) {
    this.setState({coinExchangeMode: inMode});
  }

  updateInputText(inStr) {
    this.setState({inputText: inStr});
  }

  /** Performs an exchange of currency. If the provided parameter is true, then
      the respective currency (dollars or coins, based on the exchange mode)
      is bought, otherwise it is sold, using the respective input text values
      as the quantity of currency being bought or sold. **/
  exchangeCurrency () {
    var inputValue = parseFloat(this.state.inputText);
    if(isNaN(inputValue))
      return;


    if(this.state.exchangeMode) {
      this.state.cryptoExchanger.buyCrypto(inputValue, !this.state.coinExchangeMode);
    } else {
      this.state.cryptoExchanger.sellCrypto(inputValue, !this.state.coinExchangeMode);
    }

    this.updateInputText("");

    ExchangerComponent.forceUpdate();
  }



  render () {
    if(this.state.cryptoExchanger == null || !this.state.cryptoExchanger.isPriceLoaded() || !this.state.cryptoExchanger.areValuesLoaded()) {
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
                <Text style={styles.webFont}>{round(this.getDollars(), 2)}</Text>
                <Text style={styles.webFont}>{round(this.getCoin(), 5)}</Text>
                <Text style={styles.webFont}>{this.getCoinPrice()}</Text>
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
