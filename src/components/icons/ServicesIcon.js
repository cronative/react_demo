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

 export default class ServicesIcon extends Component {
  render() {
     return (
        <Svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M6 1H17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M6 7H17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M6 13H17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M2 1H1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M2 7H1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M2 13H1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </Svg>        
        );
    }
}