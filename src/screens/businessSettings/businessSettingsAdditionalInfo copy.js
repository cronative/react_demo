import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {ScrollView, FlatList, Dimensions, TextInput, View, Text, StatusBar, TouchableOpacity, TouchableHighlight, ImageBackground, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Container, Footer, List, ListItem, Body, Left} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import ImagePicker from 'react-native-image-picker';
import {AdditionalInstraFeedData} from '../../utility/staticData';
import {LeftArrowIos, LeftArrowAndroid, CloseIcon} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';

const { width, height } = Dimensions.get('window')

const BusinessSettingsAdditionalInfo = () => {

  const navigation = useNavigation();
  const [isServiceDescriptionFocus, setIsServiceDescriptionFocus] = useState(false);
  const [serviceDescription, setServiceDescription] = useState('');

  const [isAdditionalLinkFocus, setIsAdditionalLinkFocus] = useState(false);
  const [additionalLink, setAdditionalLink] = useState('');

  const [filePath, setFilePath] = useState({});

  const chooseFile = () => {
    let options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log(
          'User tapped custom button: ',
          response.customButton
        );
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = {
        //   uri: 'data:image/jpeg;base64,' + response.data
        // };
        setFilePath(source);
      }
    });
  };

return (
      <Fragment>
        <StatusBar backgroundColor="#F36A46"/>
        <Container style={[commonStyle.mainContainer, commonStyle.pb1, {paddingTop: 0}]}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={[commonStyle.fromwrap]}>
            <Text style={[commonStyle.subheading]}>Additional info</Text>
            </View>
                <View style={commonStyle.categoriseListWrap}>
                  <View style={commonStyle.horizontalPadd}>
                    <View style={commonStyle.mb2}>
                      <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>Bio (highly recommended)</Text>
                      <TextInput
                        style={[
                          commonStyle.textInput,
                          commonStyle.textareainput,
                          isServiceDescriptionFocus && commonStyle.focusinput,
                        ]}
                        onFocus={() => setIsServiceDescriptionFocus(true)}
                        onChangeText={(text) => setServiceDescription(text)}
                        returnKeyType="done"
                        keyboardType="default"
                        autoCapitalize={'none'}
                        multiline = {true}
                        numberOfLines = {10}
                        maxLength = {500}
                      />
                      <Text style={commonStyle.textlength}>0/500</Text>
                    </View>
                  </View>

                    <View style={[commonStyle.horizontalPadd, commonStyle.mb15]}>
                        <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>Upload portfolio photos (up to 10)</Text>
                      <View style={commonStyle.portfolioPhotosWrap}>
                      <TouchableOpacity style={commonStyle.addPortfolioPhoto} onPress={chooseFile}>
                        <Text style={[commonStyle.plusText, {opacity: 0.4}]}>+</Text>
                      </TouchableOpacity>
                      <ScrollView 
                      horizontal
                      showsHorizontalScrollIndicator={false}>
                        <View style={commonStyle.scrollPortfolioPhotos}>
                          <Image source={{uri: filePath.uri}} style={commonStyle.scrollPortfolioPhotosImg} />
                        </View>
                      </ScrollView>
                      </View>  
                    </View>
  
                      <View style={[commonStyle.exploreCommListWrap, commonStyle.mb2]}>
                        <View style={commonStyle.horizontalPadd}>
                          <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>Instagram feed</Text>
                        </View>
                      {/*  Instagram Feed FlatList Start  */}
                        <FlatList
                        horizontal
                        ItemSeparatorComponent={() => <View style={{marginRight: -26}}/>}
                        showsHorizontalScrollIndicator={false}
                        data={AdditionalInstraFeedData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => ( 
                          <TouchableOpacity activeOpacity={.8}>
                            <View style={commonStyle.additionalInstraFeedCard}>
                              <Image defaultSource={require('../../assets/images/default.png')} source={item.InstraFeedAvater} style= {commonStyle.additionalInstraFeedCardImg} />
                            </View>
                          </TouchableOpacity>
                          )}
                        />
                      {/* Instagram Feed FlatList End  */}
                        <View style={[commonStyle.mt2, commonStyle.mb1]}>
                          <TouchableOpacity activeOpacity={0.5} style={commonStyle.btnsocial}>
                            <Image style={commonStyle.socialIcon} source={require('../../assets/images/instagramm.png')}/>
                            <Text style={[commonStyle.blackText16, commonStyle.dicconnectsocialtext]}>Disconnect</Text>
                          </TouchableOpacity>
                        </View>

                      </View>

                      <View style={commonStyle.horizontalPadd}>
                        <View style={commonStyle.mb15}>
                          <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>Additional link (it’s optional)</Text>
                          <TextInput
                            style={[
                              commonStyle.textInput,
                              isAdditionalLinkFocus && commonStyle.focusinput,
                            ]}
                            onFocus={() => setIsAdditionalLinkFocus(true)}
                            onChangeText={(text) => setAdditionalLink(text)}
                            returnKeyType="done"
                            autoCapitalize={'none'}
                            placeholder='e.g. website address'
                            placeholderTextColor={'#939DAA'}                
                          />
                          <View style={commonStyle.addLinkList}>
                            <Text style={commonStyle.blackTextR} numberOfLines={1}>htts://www.facebook.com/profile</Text>
                            <TouchableOpacity><CloseIcon/></TouchableOpacity>
                          </View>
                          <View style={commonStyle.addLinkList}>
                            <Text style={commonStyle.blackTextR} numberOfLines={1}>htts://www.pinterest.com/profile</Text>
                            <TouchableOpacity><CloseIcon/></TouchableOpacity>
                          </View>
                        </View>
                        
                        <View style={commonStyle.mb2}>
                          <TouchableOpacity style={[commonStyle.searchBarText, {alignSelf: 'flex-start'}]}>
                            <TouchableHighlight>
                              <Text style={{fontSize: 36, fontFamily: 'SofiaPro-ExtraLight', lineHeight: 36, marginRight: 15}}>+</Text>
                            </TouchableHighlight> 
                            <Text style={commonStyle.blackTextR}>Add a link</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                </View>
          </KeyboardAwareScrollView>
        </Container>
      </Fragment>
  );
};


export default BusinessSettingsAdditionalInfo;