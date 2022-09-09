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

 export default class LeftArrowIos extends Component {
  render() {
     return (
        <Svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
          width="14" height="18" viewBox="0 0 792.082 792.082">
            <G>
              <Path fill="#000000" d="M317.896,396.024l304.749-276.467c27.36-27.36,27.36-71.677,0-99.037s-71.677-27.36-99.036,0L169.11,342.161
                c-14.783,14.783-21.302,34.538-20.084,53.897c-1.218,19.359,5.301,39.114,20.084,53.897l354.531,321.606
                c27.36,27.36,71.677,27.36,99.037,0s27.36-71.677,0-99.036L317.896,396.024z"/>
            </G>
        </Svg>
    );
  }
}