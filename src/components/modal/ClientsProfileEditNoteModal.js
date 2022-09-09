import {useFocusEffect} from '@react-navigation/native';
import React, {Fragment, useState, useEffect, useRef, useCallback} from 'react';
import {
  ScrollView,
  Dimensions,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Keyboard,
} from 'react-native';
import commonStyle from '../../assets/css/mainStyle';

const ClientsProfileEditNoteModal = (props) => {
  const [nameOfServiceFocus, setNameOfServiceFocus] = useState(false);
  const [nameOfService, setNameOfService] = useState('');
  const [isClientNoteDescriptionFocus, setIsClientNoteDescriptionFocus] =
    useState(false);
  const [clientNoteDescription, setClientNoteDescription] = useState('');
  const [content, setContent] = useState(props.oldContent || '');

  useFocusEffect(
    useCallback(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
        console.log('Keyboard is being visible');
        props.setKeyboardStatus(e.endCoordinates.height);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        console.log('Keyboard is being hidden');
        props.setKeyboardStatus(0);
      });

      return () => {
        props.setKeyboardStatus(0);
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []),
  );

  return (
    <View style={commonStyle.modalContent}>
      <View
        style={[
          commonStyle.dialogheadingbg,
          {borderBottomWidth: 0, paddingBottom: 0},
        ]}>
        <Text style={[commonStyle.modalforgotheading]}>Edit note</Text>
        {clientNoteDescription.length > 0 ? (
          <TouchableOpacity>
            <Text style={commonStyle.grayText16}>Delete</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={commonStyle.typeofServiceFilterWrap}>
        <View style={commonStyle.mb2}>
          <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
            Save a note
          </Text>
          <TextInput
            style={[
              commonStyle.textInput,
              commonStyle.textareainput,
              isClientNoteDescriptionFocus && commonStyle.focusinput,
            ]}
            onSubmitEditing={(e) => {
              console.log('On Submit Editing');
              e.target.blur();
            }}
            value={content}
            onFocus={() => setIsClientNoteDescriptionFocus(true)}
            // onChangeText={(text) => setClientNoteDescription(text)}
            onChangeText={(text) => {
              setContent(text);
              props.setNoteTextBoxContent(text);
            }}
            returnKeyType="done"
            keyboardType="default"
            autoCapitalize={'none'}
            multiline={true}
            numberOfLines={10}
            maxLength={500}
            blurOnSubmit={true}
            autoFocus
          />
        </View>
      </View>
    </View>
  );
};

export default ClientsProfileEditNoteModal;
