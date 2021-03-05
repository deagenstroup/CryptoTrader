/* components imported from React */
import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Button,
} from 'react-native';

import AppLoading from 'expo-app-loading';
import * as FileSystem from 'expo-file-system';
import { Feather, MaterialIcons, Foundation } from '@expo/vector-icons';

import { PieChart } from 'react-native-chart-kit';

// import { Modal, ModalContent, ModalPortal } from 'react-native-modals';

import CryptoExchanger from "./CryptoExchanger.js";

function round(value, decimals) {
  var num = Number(Math.trunc(value+'e'+decimals)+'e-'+decimals);
  if(!isNaN(num))
    return num;
  return 0;
}

const styles = StyleSheet.create({

  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',

    backgroundColor: 'white',

    // borderWidth: 2,
    // borderColor: 'blue',
  },

  subcontainerSpacer: {
    paddingTop: 24,
    paddingBottom: 24,
  },

  profileTitle: {
    fontFamily: 'Aldrich',
    fontSize: 22,
  },

  statsContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    padding: 10,

    width: '75%',

    borderWidth: 2,
    borderRadius: 6,
    borderColor: 'black',
  },

  statsContainerLeft: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',

  },

  statsContainerRight: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  statsText: {
    fontFamily: 'TitilliumWeb',
    fontSize: 18,
  },

  statsTextLabel: {
    fontFamily: 'TitilliumWeb',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'lowercase',
  },

  statsSubtext: {
    color: 'rgb(128, 128, 128)'
  },

  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    width: '75%',
  },

  profileButton: {
    // marginLeft: 6,
    // marginRight: 6,
    margin: 6,
    padding: 4,
    width: 46,
    height: 46,

    borderRadius: 6,
    backgroundColor: 'black', //'#cdcdd1',
  },

  iconContainer: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    // borderColor: 'green',
    // borderWidth: 2,
  },

  dialogContainer: {
    flex: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    padding: 15,

    // borderColor: 'red',
    // borderWidth: 2,
  },

  dialogRow: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,

    // borderWidth: 2,
    // borderColor: 'blue',
  },

  dialogButton: {
    width: 100,
    height: 45,
    borderRadius: 5 ,
    backgroundColor: 'rgb(181, 181, 181)',
    marginLeft: 5,
    marginRight: 5,
  },

  dialogTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dialogText: {
    fontFamily: 'TitilliumWeb',
    fontSize: 22,
  },

});

export default class Profile extends Component {

  static profileComponent;

  static colorsArray = ['rgba(131, 167, 234, 1)', '#F00', 'rgb(0, 0, 255)', 'rgb(155, 0, 0)'];

  static forceProfileUpdate() {
    if(Profile.profileComponent != null)
      Profile.profileComponent.forceUpdate();

    console.log("Forcing profile update...");
  }

  constructor(props) {
    super(props);

    this.state = {

      dateCreated: new Date(),

      fileName: 'profile.txt',

      isLoaded: false,

      resetDialogVisible: false,

    }

    Profile.profileComponent = this;
  }

  componentDidMount() {
    this.loadValuesFromFile()
        .catch((error) => console.log("Error loading profile from file."))
        .finally(() => this.setState({isLoaded: true}));
  }



  getDateCreated() {
    return this.state.dateCreated;
  }

  getDateCreatedString() {
    return this.state.dateCreated.toDateString();
  }

  getProfileAge() {
    var todaysDate = new Date();
    var timeDifference = todaysDate.getTime() - this.getDateCreated().getTime();
    return Math.trunc(timeDifference / (1000 * 3600 * 24));
  }

  getPieChartData() {
    var data = CryptoExchanger.getCryptoPercentageDataArray();
    var colorGradient = 255 / data.length;
    var color = 0;
    for(var i = 0; i < data.length; i++) {
      data[i].color = "rgb(" + color + "," + color + "," + color + ")";
      data[i].legendFontSize = 15;
      data[i].legendFontColor = "black";
      color = Math.trunc(color + colorGradient);
    }
    return data;
  }

  isResetDialogVisible() {
    return this.state.resetDialogVisible;
  }

  getResetDialog() {
    return (
      <Modal
        visible={this.state.resetDialogVisible}
        transparent={true}
        onRequestClose={() => {
          this.setState({resetDialogVisible: false});
        }} >

          <View style={styles.centeredContainer}>

            <View style={ styles.dialogContainer } >

              <View style={ styles.dialogRow }>
                <Text style={ styles.dialogText }>Are you sure you would like to reset your profile?</Text>
              </View>

              <View style={ styles.dialogRow }>

                <TouchableOpacity
                  style={ styles.dialogButton }
                  onPress={() => {
                    console.log("Yes button pressed...");
                    this.resetProfile();
                    this.setState({resetDialogVisible: false});
                  }} >
                  <View style={styles.dialogTextContainer}>
                    <Text style={styles.dialogText}>Yes</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={ styles.dialogButton }
                  onPress={() => {
                    this.setState({resetDialogVisible: false});
                  }} >
                  <View style={styles.dialogTextContainer}>
                    <Text style={styles.dialogText}>No</Text>
                  </View>
                </TouchableOpacity>

                {/**<Button title="close" onPress={() => {
                  console.log("Yes button pressed...");
                  this.resetProfile();
                  this.setState({resetDialogVisible: false});
                }} />**/}

              </View>

            </View>

          </View>

      </Modal>
    );
  }



  setResetDialogVisible(inVisible) {
    this.setState({resetDialogVisible: inVisible});
  }

  resetProfile() {
    console.log("Reset profile button pressed.");

    this.setState({
      dateCreated: new Date(),
    }, () => this.saveValuesToFile());

    CryptoExchanger.resetCryptoExchangers();
  }



  async saveValuesToFile() {
    var fileObj = {
      fileDateString: this.getDateCreatedString(),
    }

    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + this.state.fileName,
      JSON.stringify(fileObj),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    console.log("Profile saved successfully.");
  }

  async loadValuesFromFile() {
    let fileString = await FileSystem.readAsStringAsync(
      FileSystem.documentDirectory + this.state.fileName,
      { encoding: FileSystem.EncodingType.UTF8 }
    );

    var fileObj = JSON.parse(fileString);
    this.setState({
      dateCreated: new Date(fileObj.fileDateString),
    });
  }



  render() {
    if(!this.state.isLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={ styles.screenContainer } >

          <PieChart
            data={this.getPieChartData()}
            width={Dimensions.get('window').width - 16}
            height={220}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            //absolute //for the absolute number remove if you want percentage
          />

          <View style={ [styles.statsContainer, styles.subcontainerSpacer] } >

            <View style={ styles.statsContainerLeft }>
              <Text style={ styles.statsTextLabel } >date started</Text>
              <Text style={ styles.statsTextLabel } >profile age</Text>
              <Text style={ styles.statsTextLabel } >net worth</Text>
              <Text style={ [styles.statsTextLabel, styles.statsSubtext] }>total crypto value</Text>
              <Text style={ [styles.statsTextLabel, styles.statsSubtext] }>total dollars</Text>
            </View>

            <View style={ styles.statsContainerRight }>
              <Text style={ styles.statsText } >{this.getDateCreatedString()}</Text>
              <Text style={ styles.statsText } >{this.getProfileAge()} days</Text>
              <Text style={ styles.statsText } >${round(CryptoExchanger.getTotalCurrentNetValue(), 2)}</Text>
              <Text style={ [styles.statsText, styles.statsSubtext] } >${round(CryptoExchanger.getTotalCryptoValue(), 2)}</Text>
              <Text style={ [styles.statsText, styles.statsSubtext] } >${round(CryptoExchanger.getDollars(), 2)}</Text>
            </View>

          </View>

          <View style={ [styles.buttonContainer, styles.subcontainerSpacer] } >

            <TouchableOpacity
              style={ styles.profileButton }
              onPress={ () => {
                this.setState({resetDialogVisible: true});
              }} >
              <View style={ styles.iconContainer }>
                <Foundation name="loop" size={34} color="white" />
              </View>
            </TouchableOpacity>

            {this.getResetDialog()}

          </View>

        </View>
      );
    }
  }
}
