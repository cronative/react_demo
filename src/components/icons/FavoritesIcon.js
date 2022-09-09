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

 export default class FavoritesIcon extends Component {
  render() {
     return (
            <Svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M17.612 2.41452C16.7238 1.50884 15.5188 1 14.2623 1C13.0058 1 11.8008 1.50884 10.9126 2.41452L9.99977 3.34476L9.08699 2.41452C7.23698 0.52912 4.23752 0.529121 2.38751 2.41452C0.537497 4.29991 0.537497 7.35674 2.38751 9.24214L3.30029 10.1724L9.99977 17L16.6992 10.1724L17.612 9.24214C18.5007 8.33689 19 7.10885 19 5.82833C19 4.54781 18.5007 3.31977 17.612 2.41452Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}