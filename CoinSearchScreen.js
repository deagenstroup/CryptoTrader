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

import { SearchBar } from 'react-native-elements';

import { Entypo } from '@expo/vector-icons';

import CryptoExchanger from "./CryptoExchanger.js";

import { ConfirmationModal } from "./MiscComponents.js";



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
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    // margin: 6,
    padding: 6,
  },

  searchBarContainer: {
    width: '85%',
    marginTop: 10,
    // marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.0)',

    borderWidth: 0,
    shadowColor: 'white',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent'
  },

  searchBarInputContainer: {
    borderRadius: 6,
    backgroundColor: 'rgba(54, 54, 54, 0.8)',
  },

  searchBarInput: {

    fontSize: 16,
  },

  scrollBoxContainer: {
    flex: 1,
    flexDirection: 'column',
    // borderColor: 'blue',
    // borderWidth: 2,
  },

  listText: {
    fontFamily: 'TitilliumWebSemiBold',
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

      coinRemovalDialogVisible: false,

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
        this.setState({availableCryptos: cryptoArry, searchResults: []},
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
      if(this.state.searchText == null || this.state.searchText == "") {
        this.setState({searchResults: []});
        return;
      }

      var results = [];
      // this.state.searchResults.splice(0, this.state.searchResults.length);
      this.binSearchResults((item) => results.push(item), 0, this.state.availableCryptos.length-1, this.state.searchText.toLowerCase());
      // this.forceUpdate();
      this.setState({searchResults: results});
  }

  binSearchResults(pushFunc, leftI, rightI, searchText) {
    if(rightI >= leftI) {
      var mid = Math.trunc(leftI + (rightI - leftI) / 2);

      var midSubString = this.state.availableCryptos[mid].name.substring(0, searchText.length).toLowerCase();
      if(midSubString === searchText) {
        pushFunc(this.state.availableCryptos[mid]);
        this.binSearchResults(pushFunc, leftI, mid-1, searchText);
        this.binSearchResults(pushFunc, mid+1, rightI, searchText);
      } else if(midSubString > searchText) {
        this.binSearchResults(pushFunc, leftI, mid-1, searchText);
      } else {
        this.binSearchResults(pushFunc, mid+1, rightI, searchText);
      }
    }
  }


  getSearchBox() {
    return (
      <SearchBar
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInputContainer}
        inputStyle={styles.searchBarInput}
        placeholder="Search cryptocurrencies..."
        onChangeText={(text) => this.setSearchText(text)}
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
              this.setState({selectedResultIndex: -1});
            }}>
            <Entypo name="plus" size={18} color="black" />
          </TouchableOpacity>);
        }

        // If this cryptocurrency already exists in the portfolio, add a minus button
        else {
          return (<TouchableOpacity
            style={styles.listButton}
            onPress={() => {
              this.setState({coinRemovalDialogVisible: true});
            }}>
            <Entypo name="minus" size={18} color="black" />
          </TouchableOpacity>);
        }

      }

    }

    return (
      <TouchableOpacity
        style={styles.screenRow}
        onPress={() => {
          if(this.state.selectedResultIndex != null && this.state.selectedResultIndex == i) {
            this.setState({selectedResultIndex: -1});
          } else {
            this.setState({selectedResultIndex: i});
          }
        }}>
        <View style={styles.listRowContainer } >
          { listButton() }
          <Text style={ styles.listText }>{inCryptoObj.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  getCryptoRemovalDialog() {
    return (<ConfirmationModal
              visible={this.state.coinRemovalDialogVisible}
              setVisibility={(visibility) => this.setState({coinRemovalDialogVisible: visibility})}
              promptString="Are you sure you would like to remove this cryptocurrency from your portfolio?"
              onConfirmation={() => {
                var selectedCrypto = this.state.searchResults[this.state.selectedResultIndex];
                CryptoExchanger.removeCryptoExchanger(selectedCrypto.id, selectedCrypto.name);
                this.setState({selectedResultIndex: -1});
              }}/>);
  }

  render() {
    if(!this.state.cryptoListLoaded) {
      return (
        <View style={ styles.screenContainer }>

          {this.getSearchBox()}

          <ScrollView style={ [styles.scrollBoxContainer, styles.screenRow] }>
            <Text>Loading list of available cryptocurrencies...</Text>
          </ScrollView>

          { this.getCryptoRemovalDialog() }

        </View>
      );
    }

    return (
      <View style={ styles.screenContainer }>

        {this.getSearchBox()}

        <ScrollView style={ [styles.scrollBoxContainer, styles.screenRow] }>
          { this.state.searchResults.map((cryptoObj, i) => this.getCryptoListBox(cryptoObj, i))}
        </ScrollView>

        { this.getCryptoRemovalDialog() }

      </View>
    );
  }

}
