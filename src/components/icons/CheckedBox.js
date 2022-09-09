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

 export default class CheckedBox extends Component {
  render() {
     return (
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Rect width="24" height="24" rx="4" fill="#F36A46"/>
                <Path d="M17.3346 8.66675L10.0013 16.0001L6.66797 12.6667" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}