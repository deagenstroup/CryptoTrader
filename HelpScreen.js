/* components imported from React */
import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Button,
} from 'react-native';

import { AdMobBanner } from 'expo-ads-admob';
import YoutubePlayer from 'react-native-youtube-iframe';

export default class HelpScreen extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={ {flex: 1, flexDirection: 'column'} } >
        <AdMobBanner
          bannerSize="smartBannerPortrait"
          adUnitID="ca-app-pub-3940256099942544/6300978111" />

        <View style={{flex:1, justifyContent: "center"}}>
          <YoutubePlayer height={250} videoId={"iQwwvzn5l20"} />
        </View>

      </View>
    );
  }

}
