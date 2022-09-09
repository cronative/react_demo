import moment from 'moment';
import {Body, Left, List, ListItem} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import ReadMore from 'react-native-read-more-text';
import Stars from 'react-native-stars';
// import {useNavigation} from '@react-navigation/native';
import commonStyle from '../../assets/css/mainStyle';
import {
  ratingsRequest,
  reviewsClear,
  reviewsRequest,
} from '../../store/actions/reviewsAction';
import {
  handleTextReady,
  renderReadMore,
  renderShowLess,
} from '../../utility/readMoreHelperFunctions';
import ActivityLoaderSolid from '../ActivityLoaderSolid';
import {StarIcon} from '../icons';
import {Get} from '../../api/apiAgent';

const ReviewsTab = ({navigation, proId, isOwnProfile, currentTab}) => {
  // Get the current state
  const [reviewsData, setReviewsData] = useState(null);
  const [ratingsData, setRatingsData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [canFetchMoreReviews, setCanFetchMoreReviews] = useState(true);

  let PAGE_OFFSET = 5; //number of reviews fetched at once
  const [page, setPage] = useState(1);

  const [mostPopularRating, setMostPopularRating] = useState(null);

  // const navigation = useNavigation();

  useEffect(() => {
    if (currentTab === 1) {
      getReviews(page);
      getRatings();
    } else {
      setReviewsData([]);
      setRatingsData([]);
    }
  }, [currentTab]);

  const getReviews = (page) => {
    setLoading(true);
    Get(`/user/reviews?proId=${proId}&limit=${PAGE_OFFSET}&page=${page}`)
      .then((response) => {
        if (response.status === 200) {
          // if((reviewsData && response.data && (reviewsData.length + response.data.length >= response.rows) || response.data.length >= response.rows)) {
          if (
            response.data.length < PAGE_OFFSET ||
            response.data.length === 0
          ) {
            console.log('SETTING IT OFF');
            setCanFetchMoreReviews(false);
          }
          if (response.data.length) {
            if (reviewsData && reviewsData.length) {
              setReviewsData([...reviewsData, ...response.data]);
            } else {
              setReviewsData(response.data);
            }
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setReviewsData(null);
        setLoading(false);
      });
  };

  const getRatings = () => {
    Get(`/user/ratings?proId=${proId}`)
      .then((response) => {
        if (response.status === 200) {
          setRatingsData(response.data);
        }
      })
      .catch((err) => {
        console.log(err);
        // setRatingsData(null)
      });
  };

  const showMore = () => {
    if (canFetchMoreReviews) {
      getReviews(page + 1);
      setPage(page + 1);
    }
  };

  const removeDuplicateReviews = (data) => {
    const unique_reviews = data.filter(
      (val, index, originalArray) =>
        originalArray.findIndex((t) => t.id === val.id) === index,
    );
    return unique_reviews;
  };

  return (
    <>
      {/* {loading ? <ActivityLoaderSolid /> : null} */}

      {/* RATINGS SECTION */}
      {ratingsData?.totalReviews > 0 &&
      ratingsData?.avgRatingPersons &&
      ratingsData?.avgRatingPersons !== 'NaN' ? (
        <View style={[commonStyle.categoriseListWrap, commonStyle.mt2]}>
          <View style={[commonStyle.setupCardBox]}>
            <View style={commonStyle.ratingReviewRow}>
              <View style={[commonStyle.ratingReviewCol, commonStyle.bRight]}>
                <View style={{paddingRight: 20}}>
                  <Text
                    style={[commonStyle.textheading, commonStyle.textCenter]}>
                    {ratingsData &&
                    ratingsData.avgRatingPersons &&
                    ratingsData.avgRatingPersons !== 'NaN'
                      ? ratingsData.avgRatingPersons
                      : 0}
                  </Text>
                  <View style={{alignItems: 'center'}}>
                    <Stars
                      display={
                        ratingsData &&
                        ratingsData.avgRatingPersons &&
                        ratingsData.avgRatingPersons !== 'NaN'
                          ? ratingsData.avgRatingPersons
                          : 0
                      }
                      spacing={8}
                      count={5}
                      starSize={20}
                      fullStar={require('../../assets/images/starFilled.png')}
                      emptyStar={require('../../assets/images/starEmpty.png')}
                    />
                  </View>
                  <Text
                    style={[commonStyle.grayText14, commonStyle.textCenter]}>
                    based on&nbsp;
                    {/* {(ratingsData && ratingsData.totalReviews) || 0} */}
                    {ratingsData && ratingsData.totalReviews
                      ? ratingsData.totalReviews
                      : 0}
                    &nbsp;reviews
                  </Text>
                </View>
              </View>
              <View style={commonStyle.ratingReviewCol}>
                <View style={commonStyle.ratingprecessWrap}>
                  <Text style={commonStyle.texttimeblack}>5</Text>
                  <TouchableHighlight style={{marginLeft: 4}}>
                    <StarIcon />
                  </TouchableHighlight>
                  <TouchableHighlight style={{marginLeft: 8, marginRight: 8}}>
                    <Progress.Bar
                      progress={
                        mostPopularRating
                          ? ratingsData.Rating5Persons / mostPopularRating
                          : 0
                      }
                      // progress={
                      //   ratingsData.totalNumberOfPerson > 0 ?
                      //   ratingsData.Rating5Persons /
                      //   ratingsData.totalNumberOfPerson : 0
                      // }
                      width={80}
                      color="#F36A46"
                      unfilledColor="#ECEDEE"
                      borderColor="transparent"
                      borderWidth={0}
                      borderRadius={0}
                      height={3}
                    />
                  </TouchableHighlight>
                  <Text style={commonStyle.filterBlackText}>
                    {ratingsData && ratingsData.Rating5Persons
                      ? ratingsData.Rating5Persons
                      : 0}
                    {/* {(ratingsData && ratingsData.Rating5Persons) || 0} */}
                  </Text>
                </View>
                <View style={commonStyle.ratingprecessWrap}>
                  <Text style={commonStyle.texttimeblack}>4</Text>
                  <TouchableHighlight style={{marginLeft: 4}}>
                    <StarIcon />
                  </TouchableHighlight>
                  <TouchableHighlight style={{marginLeft: 8, marginRight: 8}}>
                    <Progress.Bar
                      // progress={
                      //   ratingsData.totalNumberOfPerson > 0 ?
                      //   ratingsData.Rating4Persons /
                      //   ratingsData.totalNumberOfPerson : 0
                      // }
                      progress={
                        mostPopularRating
                          ? ratingsData.Rating4Persons / mostPopularRating
                          : 0
                      }
                      width={80}
                      color="#F36A46"
                      unfilledColor="#ECEDEE"
                      borderColor="transparent"
                      borderWidth={0}
                      borderRadius={0}
                      height={3}
                    />
                  </TouchableHighlight>
                  <Text style={commonStyle.filterBlackText}>
                    {ratingsData && ratingsData.Rating4Persons
                      ? ratingsData.Rating4Persons
                      : 0}
                  </Text>
                </View>
                <View style={commonStyle.ratingprecessWrap}>
                  <Text style={commonStyle.texttimeblack}>3</Text>
                  <TouchableHighlight style={{marginLeft: 4}}>
                    <StarIcon />
                  </TouchableHighlight>
                  <TouchableHighlight style={{marginLeft: 8, marginRight: 8}}>
                    <Progress.Bar
                      // progress={
                      //   ratingsData.totalNumberOfPerson > 0 ?
                      //   ratingsData.Rating3Persons /
                      //   ratingsData.totalNumberOfPerson : 0
                      // }
                      progress={
                        mostPopularRating
                          ? ratingsData.Rating3Persons / mostPopularRating
                          : 0
                      }
                      width={80}
                      color="#F36A46"
                      unfilledColor="#ECEDEE"
                      borderColor="transparent"
                      borderWidth={0}
                      borderRadius={0}
                      height={3}
                    />
                  </TouchableHighlight>
                  <Text style={commonStyle.filterBlackText}>
                    {ratingsData && ratingsData.Rating3Persons
                      ? ratingsData.Rating3Persons
                      : 0}
                  </Text>
                </View>
                <View style={commonStyle.ratingprecessWrap}>
                  <Text style={commonStyle.texttimeblack}>2</Text>
                  <TouchableHighlight style={{marginLeft: 4}}>
                    <StarIcon />
                  </TouchableHighlight>
                  <TouchableHighlight style={{marginLeft: 8, marginRight: 8}}>
                    <Progress.Bar
                      // progress={
                      //   ratingsData.totalNumberOfPerson ?
                      //   ratingsData.Rating2Persons /
                      //   ratingsData.totalNumberOfPerson : 0
                      // }
                      progress={
                        mostPopularRating
                          ? ratingsData.Rating2Persons / mostPopularRating
                          : 0
                      }
                      width={80}
                      color="#F36A46"
                      unfilledColor="#ECEDEE"
                      borderColor="transparent"
                      borderWidth={0}
                      borderRadius={0}
                      height={3}
                    />
                  </TouchableHighlight>
                  <Text style={commonStyle.filterBlackText}>
                    {ratingsData && ratingsData.Rating2Persons
                      ? ratingsData.Rating2Persons
                      : 0}
                  </Text>
                </View>
                <View style={commonStyle.ratingprecessWrap}>
                  <Text style={commonStyle.texttimeblack}>1</Text>
                  <TouchableHighlight style={{marginLeft: 4}}>
                    <StarIcon />
                  </TouchableHighlight>
                  <TouchableHighlight style={{marginLeft: 8, marginRight: 8}}>
                    <Progress.Bar
                      // progress={
                      //   ratingsData.totalNumberOfPerson ?
                      //   ratingsData.Rating1Persons /
                      //   ratingsData.totalNumberOfPerson : 0
                      // }
                      progress={
                        mostPopularRating
                          ? ratingsData.Rating1Persons / mostPopularRating
                          : 0
                      }
                      width={80}
                      color="#F36A46"
                      unfilledColor="#ECEDEE"
                      borderColor="transparent"
                      borderWidth={0}
                      borderRadius={0}
                      height={3}
                    />
                  </TouchableHighlight>
                  <Text style={commonStyle.filterBlackText}>
                    {ratingsData && ratingsData.Rating1Persons
                      ? ratingsData.Rating1Persons
                      : 0}
                    {/* {(ratingsData && ratingsData?.[`Rating1Persons`]) || 0} */}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : null}

      {/* REVIEWS SECTION */}
      {reviewsData && !!reviewsData.length ? (
        <View style={commonStyle.categoriseListWrap}>
          <View style={[commonStyle.setupCardBox]}>
            <View>
              <Text style={[commonStyle.subtextbold, commonStyle.pr2]}>
                Reviews
              </Text>
            </View>
            <View>
              {reviewsData.map((eachReview, index) => (
                <View key={index}>
                  <List style={commonStyle.reviewslist}>
                    <ListItem
                      thumbnail
                      style={[commonStyle.switchAccountView, commonStyle.mb15]}>
                      <Left style={commonStyle.reviewsAvaterwrap}>
                        <Image
                          style={commonStyle.reviewsAvaterImg}
                          source={
                            eachReview.customer &&
                            eachReview.customer.profileImage
                              ? {
                                  uri: eachReview.customer.profileImage,
                                }
                              : require('../../assets/images/default-new.png')
                          }
                        />
                      </Left>
                      <Body style={commonStyle.switchAccountbody}>
                        <Text
                          style={[commonStyle.blackTextR, commonStyle.mb05]}>
                          {eachReview.customer && eachReview.customer.userName
                            ? eachReview.customer.userName
                            : null}
                        </Text>
                        <Text style={commonStyle.grayText14} numberOfLines={1}>
                          {eachReview.createdAt
                            ? moment(eachReview.createdAt).format(
                                'D, MMM, YYYY',
                              )
                            : 'NA'}
                        </Text>
                      </Body>
                      <TouchableOpacity
                        style={[commonStyle.ratingPoints, {marginLeft: 10}]}>
                        <StarIcon />
                        <Text style={[commonStyle.text14bold, {marginLeft: 4}]}>
                          {eachReview.ProRating && eachReview.ProRating.rating
                            ? eachReview.ProRating.rating
                            : 0}
                          {/* {(eachReview.ProRating &&
                            eachReview.ProRating.rating) ||
                            0} */}
                        </Text>
                      </TouchableOpacity>
                    </ListItem>
                    <TouchableHighlight style={commonStyle.outlintextbtn}>
                      <Text style={commonStyle.categorytagsText}>
                        {eachReview.booking &&
                        eachReview.booking.bookedService &&
                        eachReview.booking.bookedService.name
                          ? eachReview.booking.bookedService.name
                          : 'NA'}
                      </Text>
                    </TouchableHighlight>
                    <View style={commonStyle.mt1}>
                      {eachReview.content ? (
                        <ReadMore
                          numberOfLines={3}
                          renderTruncatedFooter={renderReadMore}
                          renderRevealedFooter={renderShowLess}
                          onReady={handleTextReady}>
                          <Text style={commonStyle.blackTextR}>
                            {eachReview.content}
                          </Text>
                        </ReadMore>
                      ) : (
                        <Text
                          style={[
                            commonStyle.grayText16,
                            commonStyle.textCenter,
                          ]}>
                          NO CONTENT AVAILABLE
                        </Text>
                      )}
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={commonStyle.mt2}>
                      {eachReview.resource && eachReview.resource.length
                        ? eachReview.resource.map((img, i) => (
                            <View
                              key={i}
                              style={[commonStyle.reviewuploadedpicWrap]}>
                              <Image
                                source={
                                  img.url
                                    ? {uri: img.url}
                                    : require('../../assets/images/review-img-1.png')
                                }
                                style={commonStyle.reviewuploadedpic}
                              />
                            </View>
                          ))
                        : null}
                    </ScrollView>
                  </List>
                </View>
              ))}
              {canFetchMoreReviews ? (
                <View style={commonStyle.showmoretextwrap}>
                  <TouchableOpacity
                    disabled={!canFetchMoreReviews}
                    onPress={() => showMore()}>
                    <Text
                      style={
                        canFetchMoreReviews
                          ? commonStyle.clearfilterText
                          : [commonStyle.clearfilterText, {color: 'grey'}]
                      }>
                      Show more
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      ) : (
        <View style={commonStyle.noMassegeWrap}>
          <View style={[commonStyle.nodatabg, {backgroundColor: '#FDF5ED'}]}>
            <Image
              style={[commonStyle.nodataimg]}
              source={require('../../assets/images/no-review.png')}
            />
          </View>
          <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
            No reviews yet
          </Text>
        </View>
      )}
    </>
  );
};

export default ReviewsTab;
