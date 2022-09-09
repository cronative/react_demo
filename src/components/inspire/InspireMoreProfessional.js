import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Image as ImageU, Dimensions} from 'react-native';
import RNMasonryScroll from 'react-native-masonry-scrollview';
import commonStyle from '../../assets/css/mainStyle';
import {SingleInspire} from '../../components/inspire';

const InspireMoreProfessional = (props) => {
  const {width, height} = Dimensions.get('window');

  const [inspireDetailsList, setInspireDetailsList] = useState(
    // props.otherInspiration.rows,
    [],
  );

  useEffect(() => {
    props.otherInspiration.rows.map((other) => {
      other.pro = props.professionalDetails.pro;
    });
    console.log(
      '***************\n\n\n InspireMoreProfessional list recieved \n,',
      props.otherInspiration.rows,
    );
    setInspireDetailsList(props.otherInspiration.rows);
  }, [props.otherInspiration.rows]);

  const modificationInspireFavourite = (data, index) => {
    const tempInspireDetails = [...inspireDetailsList];
    tempInspireDetails[index] = data;
    setInspireDetailsList([...tempInspireDetails]);
  };

  return (
    <View style={[commonStyle.setupCardBox, {paddingLeft: 0, paddingRight: 0}]}>
      <Text
        style={[commonStyle.subtextblack, commonStyle.mb2, {paddingLeft: 15}]}>
        More from this professional
      </Text>

      {inspireDetailsList && inspireDetailsList.length > 0 ? (
        <RNMasonryScroll
          // removeClippedSubviews={true}
          columns={2}
          horizontal={false}>
          {inspireDetailsList.map((item, index) => (
            <View style={{width: 0.48 * width}} key={index}>
              <SingleInspire
                key={index}
                itemDetails={item}
                index={index}
                modificationInspireFavourite={modificationInspireFavourite}
                professionalDetails={props.professionalDetails}
                isPublicInspirition={props.logedInUserId}
              />
            </View>
          ))}
        </RNMasonryScroll>
      ) : (
        <View style={commonStyle.noMassegeWrap}>
          <ImageU
            style={[commonStyle.nobookingsimg, {marginBottom: 0}]}
            source={require('../../assets/images/no-massege-img.png')}
          />
          <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
            {'No more inspiration yet'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default InspireMoreProfessional;
