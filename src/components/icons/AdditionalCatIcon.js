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

 export default class AdditionalCatIcon extends Component {
  render() {
     return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Rect x="3.75" y="3.75" width="16.5" height="16.5" rx="3.25" fill="white" stroke="#110F17" stroke-width="1.5"/>
        <Path d="M16 9.5L10.5 15L8 12.5" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </Svg>      
        );
    }
}