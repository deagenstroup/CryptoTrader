/* components imported from React */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import AppLoading from 'expo-app-loading';
import * as FileSystem from 'expo-file-system';
import { Feather, MaterialIcons, Foundation } from '@expo/vector-icons';

import { PieChart } from 'react-native-chart-kit';

import { getCryptoPercentageDataArray } from "./Exchanger.js";

// import Dialog, { DialogTitle, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';

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
    justifyContent: 'center',
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

});

var profileComponent;

export function updateTotalNetValue(inValue) {
  profileComponent.setTotalNetValue(inValue);
  profileComponent.forceUpdate();
}

export function updateNetValues(inCryptoValue, inDollarValue) {
  profileComponent.setTotalCryptoValue(inCryptoValue);
  profileComponent.setDollarValue(inDollarValue);
  profileComponent.forceUpdate();
}

var colorsArray = ['rgba(131, 167, 234, 1)', '#F00', 'rgb(0, 0, 255)', 'rgb(155, 0, 0)'];

export default class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {

      currentTotalNetValue: 0,

      currentTotalCryptoValue: 0,

      currentDollarValue: 0,

      dateCreated: new Date(),

      fileName: 'profile.txt',

      isLoaded: false,

      resetDialogVisible: false,

    }

    this.setResetDialogVisible.bind(this);
    this.getResetDialog.bind(this);
    this.getDateCreated.bind(this);
    this.getDateCreatedString.bind(this);
    this.getProfileAge.bind(this);
    this.changeProfile.bind(this);
    this.resetProfile.bind(this);
    this.deleteProfile.bind(this);

    profileComponent = this;
  }

  componentDidMount() {
    this.loadValuesFromFile()
        .catch((error) => console.log("Error loading profile from file."))
        .finally(() => this.setState({isLoaded: true}));
    // this.setState({isLoaded: true});
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
    var data = getCryptoPercentageDataArray();
    var colorGradient = 255 / data.length;
    var color = 0;
    for(var i = 0; i < data.length; i++) {
      data[i].color = "rgb(" + color + "," + color + "," + color + ")";
      data[i].legendFontSize = 15;
      data[i].legendFontColor = "black";
      color = Math.trunc(color + colorGradient);
      console.log(data[i]);
    }
    return data;
  }

  getResetDialog() {
    return (
    {/**<Dialog
        onDismiss={() => {
          this.setResetDialogVisible(false);
        }}
        width={0.9}
        visible={this.state.resetDialogVisible}
        dialogTitle={
          <DialogTitle
            title="Reset Profile"
            style={{
              backgroundColor: '#F7F7F8',
            }}
            hasTitleBar={false}
            align="left"
          />
        }
        footer={
          <DialogFooter>
            <DialogButton
              text="Yes"
              onPress={() => {
                this.resetProfile();
                this.setResetDialogVisible(false);
              }}
              key="button-1"
            />
            <DialogButton
              text="No"
              onPress={() => {
                this.setResetDialogVisible(false);
              }}
              key="button-2"
            />
          </DialogFooter>
        }>
        <DialogContent
          style={{
            backgroundColor: '#F7F7F8',
          }}>
          <Text>Are you sure you would like to reset your profile?</Text>
        </DialogContent>
      </Dialog>**/}
    );
  }


  setTotalNetValue(inValue) {
    this.setState({
      currentTotalNetValue: inValue,
    });
  }

  setTotalCryptoValue(inValue) {
    this.setState({
      currentTotalCryptoValue: inValue,
    });
  }

  setDollarValue(inValue) {
    this.setState({
      currentDollarValue: inValue,
    });
  }

  setResetDialogVisible(inVisible) {
    this.setState({resetDialogVisible: inVisible});
  }



  changeProfile() {
    console.log("Change profile button pressed.");
    this.saveValuesToFile();
  }

  resetProfile() {
    console.log("Reset profile button pressed.");
  }

  deleteProfile() {
    console.log("Delete profile button pressed.");
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
              <Text style={ styles.statsText } >${round(this.state.currentTotalCryptoValue+this.state.currentDollarValue, 2)}</Text>
              <Text style={ [styles.statsText, styles.statsSubtext] } >${round(this.state.currentTotalCryptoValue, 2)}</Text>
              <Text style={ [styles.statsText, styles.statsSubtext] } >${round(this.state.currentDollarValue, 2)}</Text>
            </View>

            {/**<Text style={ styles.statsText } >date started: {this.getDateCreatedString()}</Text>
            <Text style={ styles.statsText } >profile age: {this.getProfileAge()} days</Text>
            <Text style={ styles.statsText } >net worth: ${round(this.state.currentTotalNetValue, 2)}</Text>**/}
          </View>

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

          <View style={ [styles.buttonContainer, styles.subcontainerSpacer] } >


            <TouchableOpacity
              style={ styles.profileButton }
              onPress={ () => this.setResetDialogVisible(true) } >
              <View style={ styles.iconContainer }>
                <Foundation name="loop" size={34} color="white" />
              </View>
            </TouchableOpacity>

            {/**<Dialog
                onDismiss={() => {
                  this.setResetDialogVisible(false);
                }}
                width={0.9}
                visible={this.state.resetDialogVisible}
                dialogTitle={
                  <DialogTitle
                    title="Reset Profile"
                    style={{
                      backgroundColor: '#F7F7F8',
                    }}
                    hasTitleBar={false}
                    align="left"
                  />
                }
                footer={
                  <DialogFooter>
                    <DialogButton
                      text="Yes"
                      onPress={() => {
                        this.resetProfile();
                        this.setResetDialogVisible(false);
                      }}
                      key="button-1"
                    />
                    <DialogButton
                      text="No"
                      onPress={() => {
                        this.setResetDialogVisible(false);
                      }}
                      key="button-2"
                    />
                  </DialogFooter>
                }>
                <DialogContent
                  style={{
                    backgroundColor: '#F7F7F8',
                  }}>
                  <Text>Are you sure you would like to reset your profile?</Text>
                </DialogContent>
              </Dialog>**/}

          </View>

        </View>
      );
    }
  }
}
