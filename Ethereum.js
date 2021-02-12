/* components imported from React */
import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

/* custom resources from expo */
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons
} from '@expo/vector-icons';

import Exchanger, { getChartLabels, round } from "./Exchanger.js";

export class EthereumExchanger extends Exchanger {
  constructor(props) {
    super(props);

    this.fetchCoinPrice.bind(this);
    this.getCoinFileName.bind(this);
  }

  getCoinName() {
    return "ethereum";
  }

  getCoinIcon(inColor) {
    if(inColor === "white")
      return (<MaterialCommunityIcons name="ethereum" size={34} color="white" />);
    else {
      return (<MaterialCommunityIcons name="ethereum" size={34} color="black" />);
    }
  }

  getCoinFileName() {
    return "ethereum.txt";
  }

  /** Opens a connection to CoinGecko and gets the current market price of the coin **/
  fetchCoinPrice() {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
      .then((response) => response.json())
      .then((json) => {
        this.setCoinPrice(json.ethereum.usd);
        // this.setState({coinPrice: json.ethereum.usd});
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({isPriceLoaded: true});
        this.updateProfileValues();
      });
    // this.setState({
    //   coinPrice: 2000,
    //   isPriceLoaded: true,
    // });

  }

  fetchCoinData() {
    this.fetchCoinDataFromURL("https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7&interval=daily");
  }
}
