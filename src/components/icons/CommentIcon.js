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

 export default class CommentIcon extends Component {
  render() {
     return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M19 13C19 14.1046 18.1046 15 17 15H5L1 19V3C1 1.89543 1.89543 1 3 1H17C18.1046 1 19 1.89543 19 3V13Z" stroke="#939DAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </Svg>     
        );
    }
}