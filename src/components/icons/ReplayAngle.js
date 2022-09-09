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

 export default class ReplayAngle extends Component {
  render() {
     return (
            <Svg width="15" height="30" viewBox="0 0 12 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M1 1V25H11" stroke="#dcdcdc" stroke-linecap="round"/>
            </Svg>
        );
    }
}