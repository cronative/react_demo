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

 export default class MoreVertical extends Component {
  render() {
     return (
        <Svg width="4" height="14" viewBox="0 0 4 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M2 3.5C2.82843 3.5 3.5 2.82843 3.5 2C3.5 1.17157 2.82843 0.5 2 0.5C1.17157 0.5 0.5 1.17157 0.5 2C0.5 2.82843 1.17157 3.5 2 3.5Z" fill="#110F17"/>
        <Path d="M2 8.5C2.82843 8.5 3.5 7.82843 3.5 7C3.5 6.17157 2.82843 5.5 2 5.5C1.17157 5.5 0.5 6.17157 0.5 7C0.5 7.82843 1.17157 8.5 2 8.5Z" fill="#110F17"/>
        <Path d="M2 13.5C2.82843 13.5 3.5 12.8284 3.5 12C3.5 11.1716 2.82843 10.5 2 10.5C1.17157 10.5 0.5 11.1716 0.5 12C0.5 12.8284 1.17157 13.5 2 13.5Z" fill="#110F17"/>
        </Svg>        
        );
    }
}