import React, { Component, useState } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

const styles = StyleSheet.create({
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
      width: '90%',

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

    numberInputBox: {
      flex: 1,
      height: 45,
      borderRadius: 5,
      marginLeft: 5,
      marginRight: 5,
    },
});

/** Styles used for light theme **/
export const lightStyles = StyleSheet.create({
  primColor: {
    color: 'black',
  },
  backgroundColor: {
    backgroundColor: "white",
  },
  borderColor: {
    borderColor: 'black',
  },

  filledButton: {
    backgroundColor: "black",
    borderColor: "black",
  },
  filledButtonLabel: {
    color: 'white',
  },

  unfilledButton: {
    backgroundColor: "white",
    borderColor: "black",
  },
  unfilledButtonLabel: {
    color: 'black', 
  },

  piechart: {
    backgroundColor: 'transparent',
  },
});


/** Styles used for dark theme **/
export const darkStyles = StyleSheet.create({
  primColor: {
    color: 'white',
  },
  backgroundColor: {
    backgroundColor: "black",
  },
  borderColor: {
    borderColor: 'white',
  },

  filledButton: {
    backgroundColor: "white",
    borderColor: "white",
  },
  filledButtonLabel: {
    color: 'black',
  },

  unfilledButton: {
    backgroundColor: "black",
    borderColor: "white",
  },
  unfilledButtonLabel: {
    color: 'white', 
  },

  piechart: {
    backgroundColor: 'grey',
  },
});

export const NumberInputModal = (props) => {
  const [inputText, setInputText] = useState("10000");
  return (
    <Modal
      transparent={true}
      onRequestClose={() => {
        props.setVisibility(false);
      }} { ...props }>
      
      {/* Container which expands across the entire screen and places the 
          modal in the center of it. */}
      <View style={styles.centeredContainer}>

        {/* Container for the actual modal which places items in a single column
            inside the modal */}
        <View style={styles.dialogContainer}>
          
          {/* The text which is displayed to the user inside the modal */}
          <View style={ styles.dialogRow }>
            <Text style={ styles.dialogText }>{props.promptString}</Text>
          </View>

          <View style={ styles.dialogRow }>

            <TouchableOpacity
              style={ [styles.dialogButton, {width: 45}] }
              onPress={() => {
                props.onConfirmation(inputText);
                props.setVisibility(false);
              }} >
              <View style={styles.dialogTextContainer}>
                <FontAwesome name="check" size={24} color="black" />
              </View>
            </TouchableOpacity>

            <TextInput
              style={ [styles.numberInputBox, styles.dialogText]  }
              keyboardType="decimal-pad" 
              onChangeText={text => setInputText(text)}  
              placeholder="0" 
              value={inputText} />
            
          </View>
        </View>
      </View>
    </Modal> 
  );
}


/** A popup Modal that displays a simple message to the user. 
    required props:
      visible: Value which determines the visibility of the Modal (boolean)
      setVisibility: Function which sets the visibility of the Modal (boolean)
      messageString: String which is shown in the popup to the user.
 **/
export const InformationModal = (props) => {
  return (
    <Modal
      transparent={true}
      onRequestClose={() => {
       props.setVisibility(false);
      }} { ...props }>

        <View style={styles.centeredContainer}>

          <View style={ styles.dialogContainer } >

            <View style={ styles.dialogRow }>
              <Text style={ styles.dialogText }>{props.messageString}</Text>
            </View>
            
            <View style={ styles.dialogRow }>
              <TouchableOpacity
                style={ [styles.dialogButton, {width:100}] }
                onPress={() => {
                  props.setVisibility(false);
                }} >
                <View style={styles.dialogTextContainer}>
                  <Text style={styles.dialogText}>OK</Text>
                </View>
              </TouchableOpacity>
            </View>

          </View>

        </View>

    </Modal>
  );
}

/** A popup Modal that confirms that the user would like to do a certain action.
    required props:
      visible: Value which determines the visibility of the Modal (boolean)
      setVisibility: Function which sets the visibility of the Modal (boolean)
      promptString: String which is shown in the popup to the user.
      onConfirmation: Function which performs the action which requires conformation.
 **/
export const ConfirmationModal = (props) => {
  return (
    <Modal
      transparent={true}
      onRequestClose={() => {
        props.setVisibility(false);
      }} { ...props }>

        <View style={styles.centeredContainer}>

          <View style={ styles.dialogContainer } >

            <View style={ styles.dialogRow }>
              <Text style={ styles.dialogText }>{props.promptString}</Text>
            </View>

            <View style={ styles.dialogRow }>

              <TouchableOpacity
                style={ [styles.dialogButton, {width: 100}] }
                onPress={() => {
                  props.onConfirmation();
                  props.setVisibility(false);
                }} >
                <View style={styles.dialogTextContainer}>
                  <Text style={styles.dialogText}>Yes</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={ [styles.dialogButton, {width:100}] }
                onPress={() => {
                  props.setVisibility(false);
                }} >
                <View style={styles.dialogTextContainer}>
                  <Text style={styles.dialogText}>No</Text>
                </View>
              </TouchableOpacity>

            </View>

          </View>

        </View>

    </Modal>
  );
}
