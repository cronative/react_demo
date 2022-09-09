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

 export default class EditIconOrange extends Component {
  render() {
     return (
            <Svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M8.33333 0.75L11.25 3.66667L3.66667 11.25H0.75V8.33333L8.33333 0.75Z" stroke="#F36A46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}