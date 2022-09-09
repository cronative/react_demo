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

 export default class UserSingle extends Component {
  render() {
     return (
            <Svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M11.6673 12.25V11.0833C11.6673 9.79467 10.6226 8.75 9.33398 8.75H4.66732C3.37865 8.75 2.33398 9.79467 2.33398 11.0833V12.25" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M6.99935 6.41667C8.28801 6.41667 9.33268 5.372 9.33268 4.08333C9.33268 2.79467 8.28801 1.75 6.99935 1.75C5.71068 1.75 4.66602 2.79467 4.66602 4.08333C4.66602 5.372 5.71068 6.41667 6.99935 6.41667Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>        
        );
    }
}