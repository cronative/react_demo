import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {View, Text, TextInput, Keyboard} from 'react-native';
import commonStyle from '../../assets/css/mainStyle';

const BookingNotesModal = ({
  setNoteEditText,
  noteEditText,
  noteEditId,
  ...props
}) => {
  const [noteTextOnFocus, setNoteTextOnFocus] = useState(false);
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
        <Text style={[commonStyle.modalforgotheading]}>
          {noteEditId || noteEditId == 0 ? 'Save Note' : 'Add a note'}
        </Text>
      </View>
      <View style={commonStyle.typeofServiceFilterWrap}>
        <View style={commonStyle.mb2}>
          <View
            style={[
              commonStyle.textInput,
              commonStyle.textareainput,
              noteTextOnFocus && commonStyle.focusinput,
            ]}>
            <TextInput
              style={[
                commonStyle.newtextareaInput,
                {height: 110, textAlignVertical: 'top'},
              ]}
              onFocus={() => setNoteTextOnFocus(true)}
              onBlur={() => setNoteTextOnFocus(false)}
              onChangeText={(text) => setNoteEditText(text)}
              // value={setNoteEditText}
              returnKeyType="done"
              keyboardType="default"
              autoCapitalize={'none'}
              multiline={true}
              numberOfLines={10}
              maxLength={500}
              value={noteEditText}
              blurOnSubmit={true}
              onSubmitEditing={(e) => {
                console.log('On Submit Editing');
                e.target.blur();
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default BookingNotesModal;
