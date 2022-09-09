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

 export default class Location extends Component {
  render() {
     return (
            <Svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path fill-rule="evenodd" clip-rule="evenodd" d="M0.75 4.5V16.5L6 13.5L12 16.5L17.25 13.5V1.5L12 4.5L6 1.5L0.75 4.5Z" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <Path d="M6 1.5V13.5" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <Path d="M12 4.5V16.5" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}