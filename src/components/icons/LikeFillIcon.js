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

 export default class LikeFillIcon extends Component {
  render() {
     return (
        <Svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#F36A46">    
        <Path d="M 11.677734 2.1816406 C 11.255625 2.2202656 10.879797 2.5279063 10.779297 2.9726562 L 10.224609 5.4179688 L 7.5136719 8.4296875 C 7.1826719 8.7966875 7 9.2735781 7 9.7675781 L 7 19 C 7 20.105 7.895 21 9 21 L 17.03125 21 C 17.77225 21 18.443141 20.563719 18.744141 19.886719 L 21.746094 13.130859 C 21.913094 12.756859 22 12.351406 22 11.941406 L 22 11 C 22 9.9 21.1 9 20 9 L 13 9 C 13 9 14 6.6292813 14 4.8632812 C 14 3.2502813 12.962422 2.5443281 12.107422 2.2363281 C 11.964672 2.1845781 11.818437 2.1687656 11.677734 2.1816406 z M 3.5 9 C 2.672 9 2 9.672 2 10.5 L 2 19.5 C 2 20.328 2.672 21 3.5 21 C 4.328 21 5 20.328 5 19.5 L 5 10.5 C 5 9.672 4.328 9 3.5 9 z"></Path>
        </Svg>  
        );
    }
}