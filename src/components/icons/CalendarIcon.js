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

 export default class CalendarIcon extends Component {
  render() {
     return (
            <Svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M1 4.7998C1 3.69524 1.89543 2.7998 3 2.7998H15C16.1046 2.7998 17 3.69524 17 4.7998V16.9998C17 18.1044 16.1046 18.9998 15 18.9998H3C1.89543 18.9998 1 18.1044 1 16.9998V4.7998Z" stroke="#939DAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M12.5547 1V4.6" stroke="#939DAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M5.44531 1V4.6" stroke="#939DAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M1 8.2002H17" stroke="#939DAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}