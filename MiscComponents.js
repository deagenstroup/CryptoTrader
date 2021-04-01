import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

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

/** Styles used for light theme **/
export const lightStyles = StyleSheet.create({
  primColor: {
    color: 'black',
  },
  backgroundColor: {
    backgroundColor: "white",
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
});


/** Styles used for dark theme **/
export const darkStyles = StyleSheet.create({
  primColor: {
    color: 'white',
  },
  backgroundColor: {
    backgroundColor: "black",
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
});


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
                style={ styles.dialogButton }
                onPress={() => {
                  props.onConfirmation();
                  props.setVisibility(false);
                }} >
                <View style={styles.dialogTextContainer}>
                  <Text style={styles.dialogText}>Yes</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={ styles.dialogButton }
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
