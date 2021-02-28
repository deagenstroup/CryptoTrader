/* components imported from React */
import React, { Component, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { getCryptoExchanger } from "./CryptoExchanger.js";
import { Exchanger, updateGraphTimeFrame } from './Exchanger.js';
import { BitcoinExchanger } from './Bitcoin.js';
import { EthereumExchanger } from './Ethereum.js';
import { LitecoinExchanger } from './Litecoin.js';
import { MoneroExchanger } from './Monero.js';

const styles = StyleSheet.create({
  largeColumnBox: {
    flex: 0,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  wideRowBox: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',

    width: "75%",
  },

  heeboRegularFont: {
    fontFamily: "HeeboMedium",
  }

});

// var bitcoinExchanger, litecoinExchanger, ethereumExchanger, moneroExchanger;
//
// export function loadExchangers() {
//   bitcoinExchanger = ();
//   ethereumExchanger = ();
//   moneroExchanger = ();
//   litecoinExchanger = (<LitecoinExchanger />);
// }

export class ExchangerScreen extends Component {
  constructor(props) {
    super(props);

    console.log("ExchangerScreen initialized...");

    this.state = {
      /** The type of crypto which the user is currently exchanging **/
      chosenCrypto: 'btc',

      graphTimeframe: '7d',
    }

    exchangerScreen = this;
  }

  getExchanger() {
    if(this.state.chosenCrypto == null)
      return (<BitcoinExchanger />);

    if(this.state.chosenCrypto === "btc") {
      return(<BitcoinExchanger cryptoExchanger={getCryptoExchanger("bitcoin")}/>);
    } else if(this.state.chosenCrypto === "eth") {
      return(<EthereumExchanger cryptoExchanger={getCryptoExchanger("ethereum")}/>);
    } else if(this.state.chosenCrypto === "ltc") {
      return(<LitecoinExchanger cryptoExchanger={getCryptoExchanger("litecoin")}/>);
    } else if(this.state.chosenCrypto === "mon") {
      return(<MoneroExchanger cryptoExchanger={getCryptoExchanger("monero")}/>);
    }
  }

  getGraphTimeframe() {
    return graphTimeframe;
  }

  setGraphTimeframe(inGraphtimeframe) {
    this.setState({graphTimeframe: inGraphtimeframe}, () => updateGraphTimeFrame(inGraphtimeframe));
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={ styles.largeColumnBox }
        extraHeight={50}
        style={{backgroundColor: "#ffffff"}}>

        <View style={ styles.wideRowBox }>
          <Picker
            selectedValue={this.state.chosenCrypto}
            style={[{height: 50, flex: 2, flexDirection: 'row'}, styles.heeboRegularFont]}
            itemStyle={styles.heeboRegularFont}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({chosenCrypto: itemValue})
            }>
            <Picker.Item label="Bitcoin" value="btc" />
            <Picker.Item label="Ethereum" value="eth" />
            <Picker.Item label="Litecoin" value="ltc" />
            <Picker.Item label="Monero" value="mon" />
          </Picker>

          <Picker
            selectedValue={ this.state.graphTimeframe }
            style={{height: 50, flex: 1, flexDirection: 'row'}}
            onValueChange={(itemValue, itemIndex) =>
              this.setGraphTimeframe(itemValue)
            }>
            <Picker.Item label="7d" value="7d" />
            <Picker.Item label="24h" value="24h" />
            <Picker.Item label="1m" value="1m" />
          </Picker>

        </View>


        { this.getExchanger() }

      </KeyboardAwareScrollView>
    );
  }
}
