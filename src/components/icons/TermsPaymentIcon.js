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

 export default class TermsPaymentIcon extends Component {
  render() {
     return (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C12 21 19 17.4 19 12V4.8L12 3L5 4.8V12C5 17.4 12 21 12 21Z" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <Path d="M11.7101 7V7.92441C10.7707 8.03672 10.0562 8.71058 10.0562 9.68683C10.0562 10.2311 10.2649 10.9827 11.4853 11.3974L12.1516 11.5961C12.7056 11.7689 12.826 12.0022 12.818 12.27C12.81 12.6587 12.4888 12.9006 12.0071 12.9006C11.4692 12.9006 11.2043 12.5637 11.1802 12.1836H10C10 13.1771 10.6583 13.8942 11.7101 14.0065V15H12.2961V14.0065C13.1713 13.9114 13.9741 13.3499 13.9982 12.2786C14.0223 11.7171 13.8216 10.8963 12.4808 10.4816L11.8225 10.257C11.2765 10.0929 11.2284 9.80778 11.2284 9.65227C11.2284 9.29806 11.5334 9.05616 11.9429 9.05616C12.4166 9.05616 12.6574 9.32397 12.6574 9.73002H13.8296C13.8296 8.71058 13.1953 8.07127 12.2961 7.93305V7H11.7101Z" fill="black"/>
        </Svg>      
        );
    }
}