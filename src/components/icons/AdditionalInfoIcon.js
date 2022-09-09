import React, { Component } from 'react';
import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Use,
    Defs,
    Stop
} from 'react-native-svg';

 export default class AdditionalInfoIcon extends Component {
  render() {
     return (
            <Svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M9.80078 1H2.60078C1.60667 1 0.800781 1.80589 0.800781 2.8V17.2C0.800781 18.1941 1.60667 19 2.60078 19H13.4008C14.3949 19 15.2008 18.1941 15.2008 17.2V6.4L9.80078 1Z" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M9.80078 1V6.4H15.2008" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M8 14V10" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M6 12H10" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>     
        );
    }
}