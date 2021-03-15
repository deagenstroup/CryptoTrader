import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';

import { Entypo } from '@expo/vector-icons';

import CryptoExchanger from "./CryptoExchanger.js";



const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    // borderColor: 'green',
    // borderWidth: 2,
  },

  // textBoxContainer: {
  //   flex: 0,
  //   flexDirection: 'column',
  //   alignItems: "flex-start",
  //   width: '75%',
  //   borderColor: 'red',
  //   borderWidth: 2,
  // },

  screenRow: {
    width: '75%',
    marginTop: 10,
    marginBottom: 10,
  },

  listRowContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 6,
    padding: 6,
  },

  searchBox: {
    fontSize: 22,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: 'rgb(128, 128, 128)',
    padding: 4,
    paddingBottom: 6,
  },

  scrollBoxContainer: {
    flex: 1,
    flexDirection: 'column',
    // borderColor: 'blue',
    // borderWidth: 2,
  },

  listText: {
    fontSize: 24,
  },

  selected: {
    backgroundColor: 'rgba(64, 64, 64, 0.2)',
    borderColor: 'rgba(64, 64, 64, 0.2)',
    borderWidth: 1,
    borderRadius: 6,
  },

  whiteBackground: {
    backgroundColor: "white",
  },

  listButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginLeft: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'black',
  },

});



export default class CoinSearchScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {

      // The text that the user enters to search the list of cryptos
      searchText: "",

      // An array containing the names of all the cryptos which can be added
      // to the users portfolio
      availableCryptos: [],

      // An array
      searchResults: [],

      selectedResultIndex: -1,

      // If true, the names of all available cryptos has been loaded into the
      // component
      cryptoListLoaded: false,



    }

  }

  componentDidMount() {
    this.fetchCryptoList();
  }

  fetchCryptoList() {
    fetch("https://api.coingecko.com/api/v3/coins/list")
      .then((response) => response.json())
      .then((json) => {
        var cryptoArry = [];
        json.map((currObj, i) => cryptoArry[i] = {name: currObj.name, id: currObj.id} );
        this.setState({availableCryptos: cryptoArry, searchResults: cryptoArry},
          () => this.setState({cryptoListLoaded: true}));
      })
      .catch((error) => console.log("Error fetching crypto list: \n" + error));
  }


  setSearchText(inSearchText) {
    this.setState({searchText: inSearchText}, () => {
      this.updateSearchResults();
    })
  }

  updateSearchResults() {
    if(this.state.searchText == null || this.state.searchText == "")
      this.setState({searchResults: this.state.availableCryptos});

    var results = [];
    for(var i = 0; i < this.state.availableCryptos.length; i++) {
      var currSubString = this.state.availableCryptos[i].name.substring(0, this.state.searchText.length).toLowerCase();
      if(currSubString === this.state.searchText.toLowerCase())
        results.push(this.state.availableCryptos[i]);
    }

    this.setState({searchResults: results});
  }


  getSearchBox() {
    return (
      <TextInput
        style={[styles.searchBox, styles.screenRow]}
        onChangeText={(text) => this.setSearchText(text)}
        placeholder="Dojecoin"
        value={this.state.searchText} />
    );
  }

  getCryptoListBox(inCryptoObj, i) {

    // The plus or minux button which adds or removes a selected cryptocurrency
    // from the portfolio
    var listButton = () => {

      // If this cryptocurrency from the list is selected, add the plus or minus button
      if(this.state.selectedResultIndex != null && this.state.selectedResultIndex == i) {

        // If this cryptocurrency does not exist in the porfolio already, add a plus button
        if(CryptoExchanger.getCryptoExchanger(inCryptoObj.id) == null) {
          return (<TouchableOpacity
            style={styles.listButton}
            onPress={() => {
              CryptoExchanger.addCryptoExchanger(inCryptoObj.id, inCryptoObj.name);
            }}>
            <Entypo name="plus" size={18} color="black" />
          </TouchableOpacity>);
        }

        // If this cryptocurrency already exists in the portfolio, add a minus button
        else {
          return (<TouchableOpacity
            style={styles.listButton}
            onPress={() => {
              CryptoExchanger.removeCryptoExchanger(inCryptoObj.id, inCryptoObj.name);
            }}>
            <Entypo name="minus" size={18} color="black" />
          </TouchableOpacity>);
        }

      }

    }

    return (
      <TouchableOpacity
        onPress={() => {
          if(this.state.selectedResultIndex != null && this.state.selectedResultIndex == i) {
            this.setState({selectedResultIndex: -1});
          } else {
            this.setState({selectedResultIndex: i});
          }
        }}>
        <View style={ this.state.selectedResultIndex==i?[styles.screenRow, styles.listRowContainer, styles.selected]:[styles.screenRow, styles.listRowContainer] }>
          { listButton() }
          <Text style={ styles.listText }>{inCryptoObj.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    if(!this.state.cryptoListLoaded) {
      return (
        <View style={ styles.screenContainer }>

          {this.getSearchBox()}

          <ScrollView style={ [styles.scrollBoxContainer, styles.screenRow] }>
            <Text>Loading list of available cryptocurrencies...</Text>
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={ styles.screenContainer }>

        {this.getSearchBox()}

        <ScrollView style={ [styles.scrollBoxContainer, styles.screenRow] }>
          { this.state.searchResults.map((cryptoObj, i) => this.getCryptoListBox(cryptoObj, i))}
        </ScrollView>
      </View>
    );
  }

}
