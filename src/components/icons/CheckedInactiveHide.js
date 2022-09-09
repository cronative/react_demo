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

 export default class CheckedInactiveHide extends Component {
  render() {
     return (
            <Svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" viewBox="0 0 13 10">
                <Path fill="#FFFFFF" fill-rule="nonzero" d="M12.81.19a.65.65 0 0 0-.92 0L4.103 7.966 1.11 4.977a.65.65 0 0 0-.92.918l3.453 3.448a.65.65 0 0 0 .92 0l8.247-8.235a.648.648 0 0 0 0-.918z"/>
            </Svg>
        );
    }
}