import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {List, ListItem, Body, Left} from 'native-base';
import {LikeSmallIcon, LikeSmallSolidIcon, LikeFillSmallIcon} from '../icons';
import commonStyle from '../../assets/css/mainStyle';
import moment from 'moment';
import * as Constant from '../../api/constant';
import global from '../../components/commonservices/toast';
import HTMLView from 'react-native-htmlview';
import {useSelector} from 'react-redux';

const InspireComments = (props) => {
  const [commentList, setCommentList] = useState(props.commentsDetails.rows);
  const [isShowMore, setIsShowMore] = useState(false);
  const [tempCmntList, setTempCmntList] = useState([]);
  useEffect(() => {
    setCommentList(props.commentsDetails.rows);
  }, [props.commentsDetails.rows]);

  useEffect(() => {
    if (!isShowMore) {
      if (props.commentsDetails.count > 5) {
        let holdData = props.commentsDetails.rows.slice(0, 5);
        setTempCmntList(holdData);
      } else {
        setTempCmntList(props.commentsDetails.rows);
      }
    } else {
      setTempCmntList(props.commentsDetails.rows);
    }
  }, [props, isShowMore]);

  const likeOrUnLikeCommentByProfessional = (index) => {
    console.log('LIKED');
    console.log(commentList[index]);
    console.log(commentList[index].proId);
    if (props.logedInUserId == commentList[index].proId) {
      props.likeOrUnLikeCommentByProfessional(index);
    }
  };

  const userType = useSelector((state) => state.auth.userType);

  return (
    <View style={commonStyle.setupCardBox}>
      <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
        Comments (
        {props && props.commentsDetails && props.commentsDetails.count})
      </Text>
      {tempCmntList.map((eachComment, index) => (
        <List key={index}>
          <ListItem
            thumbnail
            style={[commonStyle.switchAccountView, commonStyle.mb2]}>
            <Left
              style={[
                commonStyle.reviewsAvaterwrap,
                {alignSelf: 'flex-start'},
              ]}>
              <Image
                style={commonStyle.reviewsAvaterImg}
                defaultSource={require('../../assets/images/default-user.png')}
                source={
                  eachComment.customer && eachComment.customer.profileImage
                    ? {
                        uri: eachComment.customer.profileImage,
                      }
                    : require('../../assets/images/default-user.png')
                }
              />
            </Left>
            <Body style={commonStyle.switchAccountbody}>
              <Text style={commonStyle.texttimeblack}>
                {eachComment.customer && eachComment.customer.userName}
              </Text>
              <View style={[commonStyle.mb05, {maxWidth: '60%'}]}>
                <HTMLView value={eachComment.content} />
              </View>
              <Text style={commonStyle.grayText14} numberOfLines={1}>
                {eachComment.createdAt
                  ? moment(eachComment.createdAt).fromNow()
                  : null}
              </Text>
            </Body>
            {userType === 1 ? (
              <View style={{alignSelf: 'center'}}>
                <TouchableOpacity
                  style={commonStyle.moreInfoCircle}
                  onPress={() => likeOrUnLikeCommentByProfessional(index)}>
                  {eachComment.commentLikes &&
                  eachComment.commentLikes.length ? (
                    <LikeSmallSolidIcon />
                  ) : (
                    <LikeSmallIcon />
                  )}
                </TouchableOpacity>
              </View>
            ) : null}
            {userType != 1 ? (
              <View style={{alignSelf: 'center'}}>
                {eachComment.commentLikes && eachComment.commentLikes.length ? (
                  <View
                  // style={commonStyle.moreInfoCircle}
                  >
                    {/* <LikeSmallSolidIcon /> */}
                    <LikeFillSmallIcon />
                  </View>
                ) : null}
              </View>
            ) : null}
          </ListItem>
        </List>
      ))}
      {!isShowMore && props.commentsDetails.count > 5 && (
        <Text
          style={commonStyle.showMoreTxt}
          onPress={() => setIsShowMore(!isShowMore)}>
          Show More
        </Text>
      )}
    </View>
  );
};

export default InspireComments;

const styles = StyleSheet.create({
  div: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 14,
    textAlign: 'left',
    marginTop: 0,
    paddingTop: 0,
  },
  strong: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 18,
    textAlign: 'left',
  },
  a: {
    fontWeight: '300',
    color: '#ff5f22',
    fontFamily: 'SofiaPro',
    fontSize: 14,
    textAlign: 'left',
  },
  p: {
    fontWeight: '300',
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 14,
    textAlign: 'left',
    lineHeight: 24,
  },
  span: {
    fontWeight: '300',
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 14,
    textAlign: 'left',
    lineHeight: 24,
  },
  ul: {
    color: '#292929',
    marginBottom: 10,
  },
  li: {
    fontWeight: '300',
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 14,
    textAlign: 'left',
    paddingLeft: 0,
  },
  b: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 14,
    textAlign: 'left',
  },
  i: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 14,
    textAlign: 'left',
  },
  h3: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 24,
    textAlign: 'left',
  },
  h4: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 16,
    textAlign: 'left',
  },
  h2: {
    color: '#292929',
    fontFamily: 'SofiaPro',
    fontSize: 32,
    textAlign: 'left',
  },
});
