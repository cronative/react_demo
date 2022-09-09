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

 export default class AddIcon extends Component {
  render() {
     return (
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#939DAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M12 8.18162V15.8184" stroke="#939DAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <Path d="M8.18164 12H15.8184" stroke="#939DAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}