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

 export default class CommentBox extends Component {
  render() {
     return (
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H24V24H0V0Z" fill="white"/>
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M20 14.6667C20 15.6485 19.2041 16.4444 18.2222 16.4444H7.55556L4 20V5.77778C4 4.79594 4.79594 4 5.77778 4H18.2222C19.2041 4 20 4.79594 20 5.77778V14.6667Z" stroke="#939DAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>        
        );
    }
}