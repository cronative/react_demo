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

 export default class FilterIconWhite extends Component {
  render() {
     return (
            <Svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M4 7H10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M1.75 3.5H12.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M6 10.5H8" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}