import React, {Component} from 'react';
import {TouchableOpacity, Dimensions, View, Text, Platform,} from "react-native";
import commonStyle from '../../assets/css/mainStyle';
import {WarningIcon} from '../icons';

export default class ServerError extends Component {

    constructor(props) {
		super(props);
	}

	
	Retry(){
		this.setState({
		  isLoading:true,
		  isError:false,
		})
	} 
	
    render() {
        return (
			<View style={commonStyle.errorwrap}>
				<View style={{alignItems: 'center',}}>
					<WarningIcon/>
					<View style={{marginTop: 30, alignItems: 'center',}}>
						<Text style={commonStyle.errortext}>Something went wrong</Text>
						<TouchableOpacity onPress={this.Retry.bind(this)}>
							<Text style={commonStyle.retrytext}>Retry</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
    }
}
