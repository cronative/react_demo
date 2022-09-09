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

 export default class PlayIcon extends Component {
  render() {
     return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M1 3C1 1.89543 1.89543 1 3 1H17C18.1046 1 19 1.89543 19 3V6.2C19 7.30457 18.1046 8.2 17 8.2H3C1.89543 8.2 1 7.30457 1 6.2V3Z" stroke="#939DAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M1 13.7998C1 12.6952 1.89543 11.7998 3 11.7998H17C18.1046 11.7998 19 12.6952 19 13.7998V16.9998C19 18.1044 18.1046 18.9998 17 18.9998H3C1.89543 18.9998 1 18.1044 1 16.9998V13.7998Z" stroke="#939DAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </Svg>        
        );
    }
}