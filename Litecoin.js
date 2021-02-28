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

  getCoinIcon(inColor) {
    if(inColor === "white")
      return (<MaterialCommunityIcons name="litecoin" size={28} color="white" />);
    else
      return (<MaterialCommunityIcons name="litecoin" size={28} color="black" />);
  }

}
