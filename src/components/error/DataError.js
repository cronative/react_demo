import React, {Component} from 'react';
import {TouchableOpacity, Dimensions, View, Text, Platform,} from "react-native";
import commonStyle from '../../assets/css/mainStyle';
import {DataErrorIcon} from '../icons';

export default class DataError extends Component {

  constructor(props) {
		super(props);
	}

    render() {
        return (
			<View style={commonStyle.errorwrap}>
				<View style={{alignItems: 'center',}}>
					<DataErrorIcon/>
					<View style={{marginTop: 30, alignItems: 'center',}}>
						<Text style={commonStyle.errortext}>Data not found</Text>
					</View>
				</View>
			</View>
		);
    }
}
