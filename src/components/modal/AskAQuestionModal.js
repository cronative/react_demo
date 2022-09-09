import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import commonStyle from '../../assets/css/mainStyle';
import {Button} from 'react-native-elements';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useFocusEffect} from '@react-navigation/native';

const AskAQuestionModal = ({
  askAQuestionHandler,
  setIsModalVisible,
  scrollViewRefModal,
  handleOnScrollHandler,
  setKeyboardStatus,
}) => {
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [noteTextOnFocus, setNoteTextOnFocus] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
        console.log('Keyboard is being visible');
        setKeyboardStatus(e.endCoordinates.height);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        console.log('Keyboard is being hidden');
        setKeyboardStatus(0);
      });

      return () => {
        setKeyboardStatus(0);
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []),
  );

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRefModal}
        onScroll={handleOnScrollHandler}
        scrollEventThrottle={10}>
        <View style={commonStyle.modalContent}>
          {isLoading ? (
            <ActivityLoaderSolid />
          ) : (
            <>
              <View
                style={[
                  commonStyle.dialogheadingbg,
                  {borderBottomWidth: 0, paddingBottom: 0},
                ]}>
                <Text style={[commonStyle.modalforgotheading]}>
                  Ask a Question
                </Text>
              </View>
              <View style={[commonStyle.typeofServiceFilterWrap]}>
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
                      onChangeText={(text) => setQuestion(text)}
                      value={question}
                      returnKeyType="done"
                      keyboardType="default"
                      autoCapitalize={'none'}
                      multiline={true}
                      numberOfLines={10}
                      maxLength={500}
                      blurOnSubmit={true}
                      onSubmitEditing={(e) => {
                        console.log('On Submit Editing');
                        e.target.blur();
                      }}
                    />
                  </View>
                </View>
              </View>
              <Button
                title="Ask Question"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() => {
                  askAQuestionHandler(question);
                  setIsLoading(true);
                  setQuestion(null);
                  // setIsModalVisible(false);
                }}
              />
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default AskAQuestionModal;
