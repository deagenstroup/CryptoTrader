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

  getCoinIcon(inColor) {
    if(inColor === "white")
      return (<MaterialCommunityIcons name="ethereum" size={34} color="white" />);
    else {
      return (<MaterialCommunityIcons name="ethereum" size={34} color="black" />);
    }
  }
}
