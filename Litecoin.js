/* components imported from React */
import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import Exchanger, { getChartLabels, round } from "./Exchanger.js";

export class LitecoinExchanger extends Exchanger {
  constructor(props) {
    super(props);

    this.fetchCoinPrice.bind(this);
    this.getCoinFileName.bind(this);
  }

  getCoinName() {
    return "litecoin";
  }

  getCoinIcon(inColor) {
    if(inColor === "white")
      return (<MaterialCommunityIcons name="litecoin" size={28} color="white" />);
    else
      return (<MaterialCommunityIcons name="litecoin" size={28} color="black" />);
  }

  getCoinFileName() {
    return "litecoin.txt";
  }

  /** Opens a connection to CoinGecko and gets the current market price of the coin **/
  fetchCoinPrice() {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd")
      .then((response) => response.json())
      .then((json) => {
        this.setState({coinPrice: json.litecoin.usd});
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({isPriceLoaded: true});
        this.updateProfileValues();
      });
  }

  fetchCoinData() {
    this.fetchCoinDataWithName(this.getCoinName());
  }

}
