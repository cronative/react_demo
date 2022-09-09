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

 export default class MenuBar extends Component {
  render() {
     return (
        <Svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M4 11H20" stroke="#939DAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M4 7H20" stroke="#939DAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M4 15H20" stroke="#939DAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </Svg>
        );
    }
}