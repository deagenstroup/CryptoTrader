/* components imported from React */
import React, { Component, useState } from 'react';
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Picker,
} from 'react-native';

// import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import CryptoExchanger from "./CryptoExchanger.js";
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
    justifyContent: 'space-between',
    alignItems: 'center',

    width: "95%",
  },

  heeboRegularFont: {
    fontFamily: "HeeboMedium",
    fontSize: 22,
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

  buttonInsideContainer: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 50,
  },

  basicButton: {
    height: 50,
    borderRadius: 10,
  },

  webFontSemiBold: {
    fontFamily: 'TitilliumWebSemiBold',
    fontSize: 24,
  },

  webFont: {
    fontFamily: 'TitilliumWeb',
    fontSize: 24,
  },

});

const PickerModal = (props) => {
  return (
    <Modal
      {...props} >

      <View style={styles.centeredContainer}>
        <View style={styles.dialogContainer}>
          <View>
          {
            props.optionsArray.map((label, i) => (
              <TouchableOpacity
                style={props.buttonStyle}
                onPress={() => {
                  props.onOptionSelected(label);
                }}>
                <Text style={props.textStyle}>{label}</Text>
              </TouchableOpacity>
              )
            )
          }
          </View>
        </View>
      </View>

    </Modal>
  );
}

export default class ExchangerScreen extends Component {
  constructor(props) {
    super(props);

    console.log("ExchangerScreen initialized...");

    this.state = {
      /** The type of crypto which the user is currently exchanging **/
      chosenCrypto: 'Bitcoin',

      graphTimeframe: '7d',

      coinPickerModalVisible: false,

      graphPickerModalVisible: false,
    }

    exchangerScreen = this;
  }

  getExchanger() {
    if(this.state.chosenCrypto == null)
      return (<BitcoinExchanger />);

    if(this.state.chosenCrypto === "Bitcoin") {
      return(<BitcoinExchanger cryptoExchanger={CryptoExchanger.getCryptoExchanger("bitcoin")}/>);
    } else if(this.state.chosenCrypto === "Ethereum") {
      return(<EthereumExchanger cryptoExchanger={CryptoExchanger.getCryptoExchanger("ethereum")}/>);
    } else if(this.state.chosenCrypto === "Litecoin") {
      return(<LitecoinExchanger cryptoExchanger={CryptoExchanger.getCryptoExchanger("litecoin")}/>);
    } else if(this.state.chosenCrypto === "Monero") {
      return(<MoneroExchanger cryptoExchanger={CryptoExchanger.getCryptoExchanger("monero")}/>);
    }
  }

  getGraphTimeframe() {
    return graphTimeframe;
  }

  setCoinPickerModalVisible(inVisible) {
    this.setState({coinPickerModalVisible: inVisible});
  }

  setGraphPickerModalVisible(inVisible) {
    this.setState({graphPickerModalVisible: inVisible});
  }

  setChosenCrypto(inCrypto) {
    this.setState({
      chosenCrypto: inCrypto,
    });
  }

  setGraphTimeframe(inGraphtimeframe) {
    this.setState({graphTimeframe: inGraphtimeframe}, () => updateGraphTimeFrame(inGraphtimeframe));
  }

  getCoinPickerButton() {
    return (<TouchableOpacity
              style={styles.basicButton}
              onPress={() => this.setCoinPickerModalVisible(true)} >
              <View style={styles.buttonInsideContainer} >
                <Text style={styles.webFontSemiBold}>{this.state.chosenCrypto}</Text>
              </View>
            </TouchableOpacity> );
  }

  getGraphPickerButton() {
    return (<TouchableOpacity
              style={styles.basicButton}
              onPress={() => this.setGraphPickerModalVisible(true)} >
              <View style={styles.buttonInsideContainer} >
                <Text style={styles.webFontSemiBold}>{this.state.graphTimeframe}</Text>
              </View>
            </TouchableOpacity> );
  }

  getCoinPickerModal() {
    return (<PickerModal
              optionsArray={["Bitcoin", "Ethereum", "Litecoin", "Monero"]}
              onOptionSelected={(selectedOption) => {
                this.setChosenCrypto(selectedOption);
                this.setCoinPickerModalVisible(false);
              }}
              visible={this.state.coinPickerModalVisible}
              textStyle={styles.webFont}
              buttonStyle={styles.basicButton}
              transparent={true}
              onRequestClose={() => {
                this.setCoinPickerModalVisible(false);
              }} />
            );
  }

  getGraphPickerModal() {
    return (<PickerModal
              optionsArray={["7d", "24h", "1m"]}
              onOptionSelected={(selectedOption) => {
                this.setGraphTimeframe(selectedOption);
                this.setGraphPickerModalVisible(false);
              }}
              visible={this.state.graphPickerModalVisible}
              textStyle={styles.webFont}
              buttonStyle={styles.basicButton}
              transparent={true}
              onRequestClose={() => {
                this.setGraphPickerModalVisible(false);
              }} />
            );
  }

  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={ styles.largeColumnBox }
        extraHeight={50}
        style={{backgroundColor: "#ffffff"}}>

        <View style={styles.wideRowBox}>
          { this.getCoinPickerButton() }
          { this.getGraphPickerButton() }
        </View>

        { this.getExchanger() }

        { this.getCoinPickerModal() }

        { this.getGraphPickerModal() }

      </KeyboardAwareScrollView>
    );
  }
}
