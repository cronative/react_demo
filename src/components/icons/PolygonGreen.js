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

 export default class PolygonGreen extends Component {
  render() {
     return (
            <Svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M4 0L7.4641 4.5H0.535898L4 0Z" fill="#26C967"/>
            </Svg>
        );
    }
}