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

 export default class CheckedOrange extends Component {
  render() {
     return (
            <Svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M15 1L5.375 10L1 5.90909" stroke="#F36A46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}