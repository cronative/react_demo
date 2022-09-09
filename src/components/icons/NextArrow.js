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

 export default class NextArrow extends Component {
  render() {
     return (
      <Svg width="8" height="14" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M0.749999 1.5L5.25 6L0.75 10.5" stroke="#939DAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </Svg>
    );
  }
}