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

 export default class CameraIcon extends Component {
  render() {
     return (
            <Svg xmlns="http://www.w3.org/2000/svg" width="19" height="15" viewBox="0 0 19 15">
                <Path fill="#FFF" d="M9.5 5.429c-1.5 0-2.714 1.215-2.714 2.714 0 1.499 1.215 2.714 2.714 2.714 1.499 0 2.714-1.215 2.714-2.714 0-1.499-1.215-2.714-2.714-2.714zm7.6-2.63h-2.28c-.313 0-.651-.239-.75-.531L13.48.531C13.38.239 13.043 0 12.73 0H6.27c-.313 0-.651.239-.75.531l-.59 1.737c-.1.292-.436.531-.75.531H1.9C.855 2.8 0 3.64 0 4.665v8.398c0 1.026.855 1.866 1.9 1.866h15.2c1.045 0 1.9-.84 1.9-1.867V4.665C19 3.64 18.145 2.8 17.1 2.8zM9.5 12.893c-2.623 0-4.75-2.127-4.75-4.75s2.127-4.75 4.75-4.75 4.75 2.127 4.75 4.75-2.127 4.75-4.75 4.75zm6.786-6.786c-.375 0-.679-.303-.679-.678 0-.375.304-.679.679-.679.375 0 .678.304.678.679 0 .375-.304.678-.678.678z"/>
            </Svg>
        );
    }
}