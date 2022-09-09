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

 export default class MailBox extends Component {
  render() {
     return (
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H24V24H0V0Z" fill="white"/>
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M4.8 5H19.2C20.19 5 21 5.7875 21 6.75V17.25C21 18.2125 20.19 19 19.2 19H4.8C3.81 19 3 18.2125 3 17.25V6.75C3 5.7875 3.81 5 4.8 5Z" stroke="#939DAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M21 6.75L12 12.875L3 6.75" stroke="#939DAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}