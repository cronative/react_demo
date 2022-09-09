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

 export default class LocationList extends Component {
  render() {
     return (
            <Svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M6 4.5H15.75" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M6 9H15.75" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M6 13.5H15.75" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M3 4.5H2.25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M3 9H2.25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M3 13.5H2.25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}