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

 export default class WarningIcon extends Component {
  render() {
     return (
            <Svg xmlns="http://www.w3.org/2000/svg" width="70" height="62" viewBox="0 0 70 62">
                <G fill="#ff5f22" fill-rule="evenodd">
                    <Path fill-rule="nonzero" d="M69.332 54.6L39.268 2.467A4.877 4.877 0 0 0 35 0a4.877 4.877 0 0 0-4.268 2.467L.668 54.6a4.888 4.888 0 0 0 0 4.933A4.877 4.877 0 0 0 4.936 62h60.128a4.877 4.877 0 0 0 4.268-2.467 4.888 4.888 0 0 0 0-4.933zm-3.556 2.878a.795.795 0 0 1-.712.41H4.936a.794.794 0 0 1-.711-.41.797.797 0 0 1 0-.823L34.289 4.522a.795.795 0 0 1 .71-.41c.178 0 .506.053.712.41l30.064 52.133a.797.797 0 0 1 0 .823z"/>
                    <Path d="M33 19h4v22h-4z"/>
                    <Circle cx="35.5" cy="47.5" r="2.5"/>
                </G>
            </Svg>
        );
    }
}