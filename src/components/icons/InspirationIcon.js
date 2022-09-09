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

 export default class InspirationIcon extends Component {
  render() {
     return (
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M12 3L14.781 8.59516L21 9.4979L16.5 13.8507L17.562 20L12 17.0952L6.438 20L7.5 13.8507L3 9.4979L9.219 8.59516L12 3Z" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}