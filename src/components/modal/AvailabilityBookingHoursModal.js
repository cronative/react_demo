import React, { Fragment, useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { CircleCheckedBoxOutline, CircleCheckedBoxActive } from '../icons';
import { BookingHoursData } from '../../utility/staticData';

import commonStyle from '../../assets/css/mainStyle';

const AvailabilityBookingHoursModal = ({
    navigation,
    setBookingHoursTemp,
    bookingHours,
}) => {
    const [bookingHoursSelect, setBookingHoursSelect] = useState(
        bookingHours || null,
    );

    /**
     * This method will call on Business Name Select.
     */
    const bookingHoursSelectHelper = (index, value) => {
        setBookingHoursTemp(value);
        setBookingHoursSelect(value);
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
                    Booking Hours
                </Text>
            </View>

            <View style={commonStyle.typeofServiceFilterWrap}>
                <View>
                    <RadioGroup
                        style={commonStyle.setupradioGroup}
                        color="#ffffff"
                        activeColor="#ffffff"
                        highlightColor={'#ffffff'}
                        selectedIndex={bookingHoursSelect}
                        onSelect={(index, value) => {
                            bookingHoursSelectHelper(index, value);
                        }}>
                        {BookingHoursData.map((item, index) => (
                            <RadioButton
                                key={index}
                                style={commonStyle.setupradioButton}
                                value={item.value}>
                                <View style={commonStyle.radioCustomView}>
                                    <Text style={commonStyle.blackTextR}>
                                        {item.availabilitywindow}
                                    </Text>
                                    {bookingHoursSelect == item.value ? (
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

export default AvailabilityBookingHoursModal;
