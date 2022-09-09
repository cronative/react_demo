import React, { Fragment, useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { CircleCheckedBoxOutline, CircleCheckedBoxActive } from '../icons';
import { BookingLimitData } from '../../utility/staticData';

import commonStyle from '../../assets/css/mainStyle';

const AvailabilityBookingLimitModal = ({
    navigation,
    setMaxBookingLimitTemp,
    maxBookingLimit,
}) => {
    const [bookingLimitSelect, setBookingLimitSelect] = useState(
        maxBookingLimit || null,
    );

    /**
     * This method will call on Business Name Select.
     */
    const bookingLimitSelectHelper = (index, value) => {
        setMaxBookingLimitTemp(value);
        setBookingLimitSelect(value);
    };
    /**
     * #######################.
     */

    return (
        <View style={commonStyle.modalContent}>
            <View
                style={[
                    commonStyle.dialogheadingbg,
                    { borderBottomWidth: 0, paddingBottom: 0 },
                ]}>
                <Text style={[commonStyle.modalforgotheading]}>
                    Maximum bookings per day
                </Text>
            </View>

            <View style={commonStyle.typeofServiceFilterWrap}>
                <View>
                    <RadioGroup
                        style={commonStyle.setupradioGroup}
                        color="#ffffff"
                        activeColor="#ffffff"
                        highlightColor={'#ffffff'}
                        selectedIndex={bookingLimitSelect}
                        onSelect={(index, value) => {
                            bookingLimitSelectHelper(index, value);
                        }}>
                        {BookingLimitData.map((item, index) => (
                            <RadioButton
                                key={index}
                                style={commonStyle.setupradioButton}
                                value={item.value}>
                                <View style={commonStyle.radioCustomView}>
                                    <Text style={commonStyle.blackTextR}>
                                        {item.limit}
                                    </Text>
                                    {bookingLimitSelect == item.value ? (
                                        <CircleCheckedBoxActive />
                                    ) : (
                                        <CircleCheckedBoxOutline />
                                    )}
                                </View>
                            </RadioButton>
                        ))}
                    </RadioGroup>
                </View>
            </View>
        </View>
    );
};

export default AvailabilityBookingLimitModal;
