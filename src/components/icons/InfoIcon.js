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

 export default class InfoIcon extends Component {
  render() {
     return (
        <Svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M9 13V9H8" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <Ellipse cx="9.00313" cy="5.8" rx="0.8" ry="0.8" fill="black"/>
        </Svg>                
        );
    }
}