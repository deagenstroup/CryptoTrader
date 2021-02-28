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

  getCoinIcon(inColor) {
    if(inColor === "white")
      return (<FontAwesome5 name="monero" size={28} color="white" />);
    else
      return (<FontAwesome5 name="monero" size={28} color="black" />);
  }

}
