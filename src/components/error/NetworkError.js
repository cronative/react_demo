import React, {Component} from 'react';
import {
  TouchableOpacity,
  Dimensions,
  Image,
  View,
  Text,
  Platform,
} from 'react-native';
import commonStyle from '../../assets/css/mainStyle';
export default class NetworkError extends Component {
  // First load this file
  constructor(props) {
    super(props);
    this.retryEvent = this.retryEvent.bind(this);
  }

  retryEvent() {
    if (!!this.props.refresh) {
      this.props.refresh();
    }
  }

  // This this the function for the render view data
  render() {
    return (
      <View style={commonStyle.errorwrap}>
        <View style={{alignItems: 'center'}}>
          <Image source={require('../../assets/images/nointernet.png')} />
          <View
            style={{marginTop: 0, paddingHorizontal: 10, alignItems: 'center'}}>
            <Text style={commonStyle.errortext}>
              Please check your internet connectivity and try again
            </Text>
            <TouchableOpacity onPress={this.retryEvent}>
              <Text style={commonStyle.retrytext}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
