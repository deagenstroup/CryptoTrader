/* components imported from React */
import React, { Component, useState } from 'react';
import {
  ScrollView,
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

import { AdMobBanner } from "expo-ads-admob";

import AppLoading from 'expo-app-loading';

// import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import CryptoExchanger from "./CryptoExchanger.js";
import  ExchangerComponent from './Exchanger.js';
import Profile from './Profile.js';
import { getAppStyleSet } from "./App.js";
import { InformationModal } from "./MiscComponents.js";

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    // borderColor: 'green',
    // borderWidth: 2,
  },

  largeColumnBox: {
    flex: 0,
    flexDirection: 'column',
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
    maxHeight: '75%',

    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    padding: 15,

    // borderColor: 'red',
    // borderWidth: 2,
  },

  scrollView: {
    flex: 0,
    flexGrow: 0,
    flexDirection: 'column',
  },

  scrollViewContent: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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

  widthExpand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },



  pickerButton: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },

  startJustified: {
    justifyContent: 'flex-start',
  },

  endJustified: {
    justifyContent: 'flex-end',
  },

  modalButton: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },

  basicButton: {
    // borderColor: 'red',
    // borderWidth: 2,
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

const lightStyles = StyleSheet.create({
  backgroundColor: {
    backgroundColor: "#ffffff",
  },
});

const blueStyles = StyleSheet.create({
  backgroundColor: {
    backgroundColor: "#ffffff",
  },
});

const darkStyles = StyleSheet.create({
  backgroundColor: {
    backgroundColor: "#000000",
  },
});

const PickerModal = (props) => {
  return (
    <Modal
      {...props} >

      <View style={styles.centeredContainer}>
        <View style={styles.dialogContainer}>
          <ScrollView style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}>

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
          </ScrollView>
        </View>
      </View>

    </Modal>
  );
}

export default class ExchangerScreen extends Component {

  static exchangerScreen;

  static forceUpdate() {
    if(CryptoExchanger.getCryptoExchangerArray().length == 1)
      ExchangerScreen.resetChosenCrypto();
    if(ExchangerScreen.exchangerScreen != null)
      ExchangerScreen.exchangerScreen.forceUpdate();
  }

  /** Resets the chosen cryptocurrency to the first available one. **/
  static resetChosenCrypto() {
    if(ExchangerScreen.exchangerScreen != null)
      ExchangerScreen.exchangerScreen.resetChosenCrypto();
  }

  static showInvalidExchangeModal() {
    if(ExchangerScreen.exchangerScreen != null)
      ExchangerScreen.exchangerScreen.setInvalidExchangeModal(true);
  }

  constructor(props) {
    super(props);

    console.log("firstName: "+ CryptoExchanger.getFirstCryptoExchangerName());
    this.state = {
      /** The type of crypto which the user is currently exchanging **/
      chosenCryptoName: CryptoExchanger.getFirstCryptoExchangerName(),

      graphTimeframe: '7d',

      coinPickerModalVisible: false,

      graphPickerModalVisible: false,
    }

    ExchangerScreen.exchangerScreen = this;
  }

  getStyleSet() {
    return getAppStyleSet(); 
  }


  getChosenCryptoName() {
    return this.state.chosenCryptoName;
  }

  getChosenCryptoExchanger() {
    return CryptoExchanger.getCryptoExchangerByName(this.state.chosenCryptoName);
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

  setChosenCryptoName(inCryptoName) {
    this.setState({
      chosenCryptoName: inCryptoName,
    }, () => {
      ExchangerComponent.reinitalizeValues(this.getChosenCryptoExchanger());
    });
  }

  setGraphTimeframe(inGraphtimeframe) {
    this.setState({graphTimeframe: inGraphtimeframe}, () => ExchangerComponent.updateGraphTimeFrame(inGraphtimeframe));
  }

  resetChosenCrypto() {
    this.setState({chosenCryptoName: CryptoExchanger.getFirstCryptoExchangerName()});
  }



  getCoinPickerButton() {
    return (<TouchableOpacity
              style={[styles.pickerButton, styles.startJustified]}
              onPress={() => this.setCoinPickerModalVisible(true)} >
                <Text style={[styles.webFontSemiBold, getAppStyleSet().primColor]}>
                  {this.getChosenCryptoName()}
                </Text>
            </TouchableOpacity>);
  }

  getGraphPickerButton() {
    return (<TouchableOpacity
              style={[styles.pickerButton, styles.endJustified]}
              onPress={() => this.setGraphPickerModalVisible(true)} >
                <Text style={ [styles.webFontSemiBold, getAppStyleSet().primColor] }>
                  {this.state.graphTimeframe}
                </Text>
            </TouchableOpacity> );
  }
  
  getCoinPickerModal() {
    return (<PickerModal
              optionsArray={CryptoExchanger.getCryptoNameList()}
              onOptionSelected={(selectedOption) => {
                this.setChosenCryptoName(selectedOption);
                this.setCoinPickerModalVisible(false);
              }}
              visible={this.state.coinPickerModalVisible}
              textStyle={ [styles.webFont] }
              buttonStyle={styles.modalButton}
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
              buttonStyle={styles.modalButton}
              transparent={true}
              onRequestClose={() => {
                this.setGraphPickerModalVisible(false);
              }} />
            );
  }

  render() {
    
    if(this.state.chosenCryptoName == null ||
       CryptoExchanger.getCryptoExchangerByName(this.state.chosenCryptoName) == null
    || !CryptoExchanger.getAreCryptosLoaded()) {
      return <AppLoading />;
    }

    return (

        <KeyboardAwareScrollView
          contentContainerStyle={ [styles.largeColumnBox, this.getStyleSet().backgroundColor] }
          extraHeight={50}>
          
          <AdMobBanner
            bannerSize="smartBannerPortrait"
            adUnitID="ca-app-pub-3940256099942544/6300978111" />
          
          {/* Coin picker and Graph time picker buttons at top of screen */}
          <View style={[styles.wideRowBox, this.getStyleSet().backgroundColor]}>
            { this.getCoinPickerButton() }
            { this.getGraphPickerButton() }
          </View>
          
          <ExchangerComponent 
            cryptoExchanger={
              CryptoExchanger.getCryptoExchangerByName(this.state.chosenCryptoName)
            }/>

          { this.getCoinPickerModal() }

          { this.getGraphPickerModal() }

        </KeyboardAwareScrollView>

    );
  }
}
