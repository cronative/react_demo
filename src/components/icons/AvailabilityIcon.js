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

 export default class AvailabilityIcon extends Component {
  render() {
     return (
            <Svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M15.2222 2.7998H2.77778C1.79594 2.7998 1 3.60569 1 4.5998V17.1998C1 18.1939 1.79594 18.9998 2.77778 18.9998H15.2222C16.2041 18.9998 17 18.1939 17 17.1998V4.5998C17 3.60569 16.2041 2.7998 15.2222 2.7998Z" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M1 8.2002H17" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M12.5547 1V4.6" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M5.44531 1V4.6" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}