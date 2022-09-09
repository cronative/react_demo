import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  ScrollView,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {KeyboardAwareView} from 'react-native-keyboard-aware-view';
import commonStyle from '../../assets/css/mainStyle';
import {Button} from 'react-native-elements';
import {useForm, Controller} from 'react-hook-form';
import ActivityLoader from '../ActivityLoader';
import {useSelector, useDispatch} from 'react-redux';
import {
  professionalFaqAddRequest,
  professionalFaqEditRequest,
  professionalFaqDeleteRequest,
} from '../../store/actions';
import global from '../commonservices/toast';
import {FAQ_QUESTION_REGX, FAQ_ANSWER_REGX} from '../../utility/commonRegex';
const {width, height} = Dimensions.get('window');
import {useFocusEffect} from '@react-navigation/native';

const FaqQuestionAddModal = (props) => {
  console.log('props', props);
  const scrollViewRef = useRef(0);
  const ref_answerinput = useRef();
  const dispatch = useDispatch();
  const propsValue = props && props.singleFaqDetails;
  const {handleSubmit, control, errors} = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questionFocus, setQuestionFocus] = useState(false);

  const [answerFocus, setAnswerFocus] = useState(false);

  const faqDetails = useSelector((state) => state.faqDetails);

  const [scrollOffset, setScrollOffset] = useState();

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

  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const onSubmitHandler = (value) => {
    setIsSubmitted(true);
    if (propsValue) {
      value.faqId = propsValue.id.toString();
      dispatch(professionalFaqEditRequest(value));
    } else {
      dispatch(professionalFaqAddRequest(value));
    }
  };

  const onClickDeleteFaqApi = (faqId) => {
    setIsSubmitted(true);
    dispatch(professionalFaqDeleteRequest({faqId: faqId.toString()}));
  };

  useEffect(() => {
    if (isSubmitted && (faqDetails.addEditDeleteStatus || faqDetails.error)) {
      setIsSubmitted(false);
      if (
        faqDetails.addEditDeleteStatus === 200 ||
        faqDetails.addEditDeleteStatus === 201
      ) {
        props.onSuccessFaqManupulation();
        global.showToast(faqDetails.message, 'success');
        dispatch({type: 'PROFESSIONAL_FAQ_ADD_CLEAR'});
      } else {
        global.showToast(faqDetails.message || faqDetails.error, 'error');
        dispatch({type: 'PROFESSIONAL_FAQ_ADD_CLEAR'});
      }
    }
  }, [faqDetails]);

  const onClickDeleteFaqHandler = (id) => {
    let msg = 'Are you sure, you want to delete?';
    Alert.alert(
      'Confirmation',
      msg,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => onClickDeleteFaqApi(id)},
      ],
      {cancelable: false},
    );
  };

  return (
    <>
      <KeyboardAwareScrollView
        // <KeyboardAwareView
        animated={true}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onScroll={handleOnScroll}
        enableAutomaticScroll={Platform.OS === 'android'}
        keyboardShouldPersistTaps="handled">
        <View style={[commonStyle.modalContent]}>
          <View
            style={[
              commonStyle.dialogheadingbg,
              {borderBottomWidth: 0, paddingBottom: 0},
            ]}>
            <Text style={[commonStyle.modalforgotheading]}>
              {propsValue ? 'Edit a question' : 'Add a question'}
            </Text>
            {propsValue ? (
              <TouchableOpacity
                onPress={() => onClickDeleteFaqHandler(propsValue.id)}>
                <Text style={commonStyle.grayText16}>Delete</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={commonStyle.typeofServiceFilterWrap}>
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Question
              </Text>
              <Controller
                name="question"
                control={control}
                defaultValue={propsValue && propsValue.question}
                rules={{
                  required: {value: true, message: 'Required'},
                  // pattern: {
                  //   value: FAQ_QUESTION_REGX,
                  //   message: 'Maximum length 100 character',
                  // },
                }}
                render={({onChange, value}) => (
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      commonStyle.icontextinput,
                      questionFocus && commonStyle.focusinput,
                    ]}
                    onFocus={() => setQuestionFocus(true)}
                    onChangeText={(text) => onChange(text)}
                    onSubmitEditing={() => ref_answerinput.current.focus()}
                    returnKeyType="next"
                    autoCapitalize={'none'}
                    keyboardType="default"
                    maxLength={100}
                    value={value}
                  />
                )}
              />

              {errors.question && (
                <Text style={commonStyle.inputfielderror}>
                  {errors?.question?.message}
                </Text>
              )}
            </View>
            <View>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Answer
              </Text>
              <Controller
                name="answer"
                control={control}
                defaultValue={propsValue && propsValue.answer}
                rules={{
                  required: {value: true, message: 'Required'},
                  // pattern: {
                  //   value: FAQ_ANSWER_REGX,
                  //   message: 'Maximum length 500 character',
                  // },
                }}
                render={({onChange, value}) => (
                  <>
                    <TextInput
                      style={[
                        commonStyle.textInput,
                        commonStyle.textareainput,
                        answerFocus && commonStyle.focusinput,
                      ]}
                      onFocus={() => setAnswerFocus(true)}
                      ref={ref_answerinput}
                      returnKeyType="done"
                      keyboardType="default"
                      autoCapitalize={'none'}
                      multiline={true}
                      numberOfLines={6}
                      maxLength={500}
                      value={value}
                      onChangeText={(text) => onChange(text)}
                      blurOnSubmit={true}
                      onSubmitEditing={(e) => {
                        console.log('On Submit Editing');
                        e.target.blur();
                      }}
                    />
                  </>
                )}
              />

              {errors.answer && (
                <Text style={commonStyle.inputfielderror}>
                  {errors?.answer?.message}
                </Text>
              )}
            </View>
          </View>
          {/* <View style={{height: keyboardStatus ? keyboardStatus - 70 : 0}}>
          </View> */}
        </View>

        {/* </KeyboardAwareView> */}
      </KeyboardAwareScrollView>

      <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
        <Button
          title="Apply"
          containerStyle={commonStyle.buttoncontainerothersStyle}
          buttonStyle={commonStyle.commonbuttonStyle}
          titleStyle={commonStyle.buttontitleStyle}
          disabled={isSubmitted}
          onPress={handleSubmit(onSubmitHandler)}
        />
      </View>
    </>
  );
};

export default FaqQuestionAddModal;
