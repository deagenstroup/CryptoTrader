/* components imported from React */
import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View
} from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';

import Exchanger, { getChartLabels, round } from "./Exchanger.js";

export class MoneroExchanger extends Exchanger {
  constructor(props) {
    super(props);

    this.fetchCoinPrice.bind(this);
    this.getCoinFileName.bind(this);
  }

  getCoinName() {
    return "monero";
  }

  getCoinIcon(inColor) {
    if(inColor === "white")
      return (<FontAwesome5 name="monero" size={28} color="white" />);
    else
      return (<FontAwesome5 name="monero" size={28} color="black" />);
  }

  getCoinFileName() {
    return "monero.txt";
  }

  /** Opens a connection to CoinGecko and gets the current market price of the coin **/
  fetchCoinPrice() {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=usd")
      .then((response) => response.json())
      .then((json) => {
        this.setState({coinPrice: json.monero.usd});
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
