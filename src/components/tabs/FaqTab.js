import {Body, Left, List as ListNative, ListItem, Title} from 'native-base';
import React, {Fragment, useEffect} from 'react';
import {
  Image,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {List} from 'react-native-paper';
import ReadMore from 'react-native-read-more-text';
import {useSelector} from 'react-redux';
import commonStyle from '../../assets/css/mainStyle';
import {CommentBox, RightAngle} from '../../components/icons';
import {
  handleTextReady,
  renderReadMore,
  renderShowLess,
} from '../../utility/readMoreHelperFunctions';

// import FaqQuestionAddModal from '../../components/modal/FaqQuestionAddModal';

const FaqTab = ({isOwnProfile, onMessage, ProMetas}) => {
  // const [expanded, setExpanded] = useState(true);
  // const handlePress = () => setExpanded(!expanded);
  useEffect(() => {
    console.log('ProMetas is', ProMetas);
  }, []);
  const profileData = useSelector((state) => state.professionalDetails.details);

  function AccordionIcon1() {
    return (
      <Image
        style={{
          resizeMode: 'contain',
          width: 20,
          height: 20,
          marginRight: 0,
          alignItems: 'center',
          alignSelf: 'center',
        }}
        source={require('../../assets/images/coin.png')}
      />
    );
  }
  function AccordionIcon2() {
    return (
      <Image
        style={{
          resizeMode: 'contain',
          width: 15,
          height: 20,
          marginRight: 0,
          alignItems: 'center',
          alignSelf: 'center',
        }}
        source={require('../../assets/images/phonefram.png')}
      />
    );
  }

  /**
   * =======================.
   */

  /**
   * This method will call on Modal show hide.
   */
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };
  /**
   * =======================.
   */

  const preDepositAmount = (proMetaInfo) => {
    switch (proMetaInfo?.depositType) {
      case 1:
        return `${proMetaInfo?.depositeAmount ?? 0}% `;
      case 2:
        return `$${proMetaInfo?.depositeAmount ?? '0'} `;
      case 3:
        return `the full booking amount `;
      default:
        console.log('default case');
        return '';
    }
  };

  return (
    <View>
      <View style={[commonStyle.setupCardBox, {marginTop: 20}]}>
        <Text style={[commonStyle.subtextbold, commonStyle.mb1]}>
          Terms of payment
        </Text>
        <List.Section style={[commonStyle.commListitem]}>
          {profileData?.ProMetas[0]?.payInCash == 1 && (
            <List.Accordion
              style={[
                commonStyle.commListitem,
                {paddingBottom: 8, paddingTop: 8},
              ]}
              title="Pay in cash"
              titleStyle={commonStyle.blackTextR}
              left={(props) => <AccordionIcon1 {...props} />}>
              <View
                style={[
                  commonStyle.termswrap,
                  {paddingLeft: 0, paddingBottom: 20},
                ]}>
                {profileData.ProMetas[0].depositType == 0 ? (
                  <Text style={commonStyle.grayText16}>
                    No deposits is required for scheduling an appointment - you
                    will pay after your appointment.
                  </Text>
                ) : (
                  <Text style={commonStyle.grayText16}>
                    To pay in cash you’ll be asked to confirm your booking via
                    debit/credit card. This Pro charges{' '}
                    <Text style={commonStyle.blackTextR}>
                      deposit of {preDepositAmount(profileData.ProMetas[0])}
                    </Text>
                    ahead.
                    {profileData.ProMetas[0]?.depositType !== 3
                      ? ` The rest will be `
                      : ''}
                    {profileData.ProMetas[0]?.depositType !== 3 && (
                      <Text style={commonStyle.blackTextR}>
                        collected in-store
                      </Text>
                    )}
                    {profileData.ProMetas[0]?.depositType !== 3
                      ? ` after your service is completed.`
                      : ''}
                    {/* <Title style={commonStyle.blackTextR}>
                          deposit of $
                          {(profileData &&
                            profileData.ProMetas &&
                            profileData.ProMetas[0] &&
                            profileData.ProMetas[0].depositeAmount) ||
                            0}{' '}
                          ahead
                        </Title>
                        , the rest will be{' '}
                        <Title style={commonStyle.blackTextR}>
                          collected in-store
                        </Title>{' '}
                        after your booking */}
                  </Text>
                )}
              </View>
            </List.Accordion>
          )}

          {profileData?.ProMetas[0]?.payInApp == 1 && (
            <>
              <View style={commonStyle.dividerlinefull} />
              <List.Accordion
                style={[
                  commonStyle.commListitem,
                  {paddingBottom: 8, paddingTop: 8},
                ]}
                title="Pay in app"
                titleStyle={commonStyle.blackTextR}
                left={(props) => <AccordionIcon2 {...props} />}>
                <View
                  style={[
                    commonStyle.termswrap,
                    {paddingLeft: 0, paddingBottom: 20},
                  ]}>
                  {profileData.ProMetas[0].depositType == 0 ? (
                    <Text style={commonStyle.grayText16}>
                      No deposits is required for scheduling an appointment -
                      you will pay after your appointment.
                    </Text>
                  ) : (
                    <Text style={commonStyle.grayText16}>
                      Make payments using Credit/Debit card. To confirm your
                      appointment this pro charges{' '}
                      <Title style={commonStyle.blackTextR}>
                        deposit of {preDepositAmount(profileData.ProMetas[0])}.
                      </Title>
                      {profileData.ProMetas[0]?.depositType !== 3
                        ? ` The remaining balance will be charged only after your service is completed.`
                        : ''}
                    </Text>
                  )}
                </View>
              </List.Accordion>
            </>
          )}
        </List.Section>
      </View>

      {!!profileData.ProMetas[0]?.applyDeposite && (
        <View style={[commonStyle.setupCardBox]}>
          <Text style={[commonStyle.subtextblack, commonStyle.mb15]}>
            Cancellation policies
          </Text>
          {profileData?.ProMetas[0]?.cancellationHours == -1 ? (
            <View>
              <Text style={commonStyle.grayText16}>
                Cancel for free anytime before your appointment. For{' '}
                <Title style={commonStyle.blackTextR}>not showing up</Title> you
                will loose your full deposit.
              </Text>
            </View>
          ) : (
            <View style={commonStyle.termswrap}>
              <Text style={commonStyle.grayText16}>
                Cancel for free up to{' '}
                <Title style={commonStyle.blackTextR}>
                  {(profileData &&
                    profileData.ProMetas &&
                    profileData.ProMetas[0] &&
                    profileData.ProMetas[0].cancellationHours) ||
                    0}{' '}
                  {profileData &&
                  profileData.ProMetas &&
                  profileData.ProMetas[0] &&
                  profileData.ProMetas[0].cancellationHours &&
                  profileData.ProMetas[0].cancellationHours > 1
                    ? 'hours'
                    : 'hour'}{' '}
                  ahead{' '}
                </Title>
                of your appointment time, after this grace period you will loose
                your deposit. For{' '}
                <Title style={commonStyle.blackTextR}>not showing up</Title> you
                will loose your full deposit too.
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={[commonStyle.setupCardBox]}>
        <View>
          <Text style={[commonStyle.subtextbold, commonStyle.mb05]}>
            {isOwnProfile ? 'General FAQ' : 'FAQ'}
          </Text>
          {/* {faqData && faqData.map(item => (
            <TouchableOpacity style={commonStyle.generalFaqList}>
              <Text style={[commonStyle.blackTextR, {width:'90%'}]}>{item.question ? item.question : "NA"}</Text>
              <TouchableHighlight><RightAngle/></TouchableHighlight>
            </TouchableOpacity>
          ))} */}
          <List.Section style={[commonStyle.commListitem]}>
            {profileData &&
              profileData.ProFaqs &&
              profileData.ProFaqs.map((item, index) => (
                <Fragment key={index}>
                  <List.Accordion
                    style={[
                      commonStyle.commListitem,
                      {paddingBottom: 8, paddingTop: 8},
                    ]}
                    title={item.question ? item.question : 'NA'}
                    titleStyle={commonStyle.blackTextR}
                    // left={(props) => <AccordionIcon1 {...props} />}
                  >
                    <View
                      style={{
                        paddingLeft: 0,
                        paddingBottom: 20,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                      }}>
                      {/* <Text style={[commonStyle.grayText16,{textAlign: 'left'}]}>{item.answer ? item.answer : "No Answer Available"} </Text> */}
                      <ReadMore
                        numberOfLines={3}
                        renderTruncatedFooter={renderReadMore}
                        renderRevealedFooter={renderShowLess}
                        onReady={handleTextReady}>
                        <Text
                          style={[commonStyle.grayText16, {textAlign: 'left'}]}>
                          {item.answer ? item.answer : 'No Answer Available'}{' '}
                        </Text>
                      </ReadMore>
                    </View>
                  </List.Accordion>
                  <View style={commonStyle.dividerlinefull} />
                </Fragment>
              ))}
          </List.Section>
          {!isOwnProfile ? (
            <ListNative style={[commonStyle.contactwaylist, {marginTop: 20}]}>
              <ListItem thumbnail style={commonStyle.switchAccountView}>
                <Left>
                  <CommentBox />
                </Left>
                <Body style={commonStyle.switchAccountbody}>
                  <TouchableOpacity onPress={onMessage}>
                    <>
                      <Text style={commonStyle.blackTextR}>Ask a question</Text>
                      {/* <Text style={commonStyle.grayText14} numberOfLines={1}>
                        Usually responds within 3 hours
                      </Text> */}
                    </>
                  </TouchableOpacity>
                </Body>
                <TouchableOpacity style={{marginLeft: 10}}>
                  <RightAngle />
                </TouchableOpacity>
              </ListItem>
            </ListNative>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default FaqTab;
