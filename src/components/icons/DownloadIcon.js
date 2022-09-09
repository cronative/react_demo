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

 export default class DownloadIcon extends Component {
  render() {
     return (
            <Svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M2.33203 7V11.6667C2.33203 12.311 2.85437 12.8333 3.4987 12.8333H10.4987C11.143 12.8333 11.6654 12.311 11.6654 11.6667V7" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M9.33464 3.49984L7.0013 1.1665L4.66797 3.49984" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M7 1.1665V8.74984" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}