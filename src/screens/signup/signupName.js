import AsyncStorage from '@react-native-async-storage/async-storage';
import {Container} from 'native-base';
import React, {Fragment, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  BackHandler,
  Image,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Get, Put} from '../../api/apiAgent';
import commonStyle from '../../assets/css/mainStyle';
import logo from '../../assets/images/logo.png';
import ActivityLoader from '../../components/ActivityLoader';
import global from '../../components/commonservices/toast';
import {NAME_CHARECTER_PATTERN} from '../../utility/commonRegex';

const SignupName = ({navigation, route}) => {
  const [isFullNameFocus, setIsFullNameFocus] = useState(false);
  const [fullName, setFullName] = useState('');
  const {handleSubmit, control, errors} = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (value) => {
    await AsyncStorage.setItem('fullName', value.userName);
    signupNameApi(value);
  };

  const signupNameApi = (payload) => {
    setLoading(true);
    console.log('sending payload is', payload);
    Put('user/profile', payload)
      .then((result) => {
        setLoading(false);
        console.log(">>>>>>>>> After Profile Name")
        if (result.status === 200) {
          // global.showToast(result.message, 'success');
          navigation.navigate('SignupPhone');
          console.log(">>>>>>>>> After Profile Name", route)
          if(route.params.user_type === 'professional account') {
            Get('user/welcome-mail?isProfessional=1')
              .then((response) => {
                console.log(response);
              })
              .catch((err) => {
                console.log({err});
              });
          } else {
            Get('user/welcome-mail?isProfessional=0')
            .then((response) => {
              console.log(response);
            })
            .catch((err) => {
              console.log({err});
            });
          }
        } else {
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log('response error is', error.response);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Something went wrong',
          'error',
        );
      });
  };

  const backAction = () => {
    return true;
  };

  useEffect(() => {
    const backHandlerdata = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandlerdata.remove();
  }, []);

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loading ? <ActivityLoader /> : null}
      <Container style={[commonStyle.mainContainer]}>
        <View style={commonStyle.headerlogo}>
          <Image source={logo} style={commonStyle.logo} />
        </View>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={commonStyle.fromwrap}>
            <Text style={[commonStyle.subheading, commonStyle.mb2]}>
              What is your name?
            </Text>

            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Full name
              </Text>
              <Controller
                name="userName"
                control={control}
                defaultValue=""
                // ! rules will apply in up to down order

                rules={{
                  required: {value: true, message: 'Name is required'},
                  pattern: {
                    value: NAME_CHARECTER_PATTERN,
                    message: 'Not a valid name',
                  },
                  maxLength: {
                    value: 30,
                    message: 'Maximum 30 charecters are allowed',
                  },
                }}
                render={({onChange, value}) => (
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      isFullNameFocus && commonStyle.focusinput,
                    ]}
                    onFocus={() => setIsFullNameFocus(true)}
                    returnKeyType="done"
                    autoCapitalize={'none'}
                    autoFocus={true}
                    // ! this value is coming from Controllar's render function
                    value={value}
                    onChangeText={(text) => {
                      // ! this on change is coming from Controllar's render function
                      onChange(text);
                      setFullName(text);
                    }}
                  />
                )}
              />
              {
                // ! this is the error text out put deginar need to fix the styling
              }
              {errors.userName && (
                <Text style={commonStyle.inputfielderror}>
                  {errors?.userName?.message}
                </Text>
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
        {fullName.length > 0 ? (
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title="Continue"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={handleSubmit(onSubmitHandler)}
              />
            </View>
          </View>
        ) : null}
      </Container>
    </Fragment>
  );
};

export default SignupName;
