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

 export default class InviteIcon extends Component {
  render() {
     return (
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M16.1654 19V17.3333C16.1654 15.4924 14.673 14 12.832 14H6.16536C4.32441 14 2.83203 15.4924 2.83203 17.3333V19" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M9.4974 10.6667C11.3383 10.6667 12.8307 9.17428 12.8307 7.33333C12.8307 5.49238 11.3383 4 9.4974 4C7.65645 4 6.16406 5.49238 6.16406 7.33333C6.16406 9.17428 7.65645 10.6667 9.4974 10.6667Z" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M21.1641 19.0001V17.3334C21.1629 15.8143 20.1349 14.4882 18.6641 14.1084" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M15.332 4.1084C16.807 4.48604 17.8386 5.81506 17.8386 7.33756C17.8386 8.86007 16.807 10.1891 15.332 10.5667" stroke="#110F17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}