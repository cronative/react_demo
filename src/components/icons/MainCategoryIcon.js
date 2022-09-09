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

 export default class MainCategoryIcon extends Component {
  render() {
     return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Circle cx="12" cy="12" r="8.25" fill="white" stroke="#110F17" stroke-width="1.5"/>
        <Circle cx="12" cy="12" r="3.25" fill="white" stroke="#110F17" stroke-width="1.5"/>
        </Svg>        
        );
    }
}