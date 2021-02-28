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

export class BitcoinExchanger extends Exchanger {
  constructor(props) {
    super(props);

    this.getCoinFileName.bind(this);
  }

  getCoinIcon(inColor) {
    if(inColor === "white")
      return (<FontAwesome name="bitcoin" size={34} color="white" />);
    else {
      return (<FontAwesome name="bitcoin" size={34} color="black" />);
    }
  }

  // /** Opens a connection to CoinGecko and gets the current market price of the coin **/
  // fetchCoinPrice() {
  //   fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
  //     .then((response) => response.json())
  //     .then((json) => {
  //       this.setState({coinPrice: json.bitcoin.usd});
  //     })
  //     .catch((error) => console.error(error))
  //     .finally(() => {
  //       this.setState({isPriceLoaded: true});
  //       this.updateProfileValues();
  //     });
  // }
}
