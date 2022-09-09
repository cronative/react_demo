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

 export default class ErrorIcon extends Component {
  render() {
     return (
            <Svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18">
                <G fill="#9D9D9D">
                    <Path d="M19.697 14.592L11.933 1.144C11.53.445 10.807.028 10 .028c-.807 0-1.53.417-1.933 1.116L.303 14.592c-.404.699-.404 1.533 0 2.232.403.7 1.126 1.117 1.933 1.117h15.528c.807 0 1.53-.418 1.933-1.117.404-.699.404-1.533 0-2.232zm-1.015 1.646c-.192.332-.535.53-.918.53H2.236c-.383 0-.726-.198-.918-.53-.191-.332-.191-.728 0-1.06L9.082 1.731c.192-.332.535-.53.918-.53s.726.198.918.53l7.764 13.447c.191.332.191.728 0 1.06z"/>
                    <Path d="M10 12.859c-.431 0-.782.35-.782.782 0 .43.35.781.782.781.431 0 .782-.35.782-.781 0-.432-.35-.782-.782-.782zM9.414 5.627H10.587V11.686H9.414z"/>
                </G>
            </Svg>
        );
    }
}