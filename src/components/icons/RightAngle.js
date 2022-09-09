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

 export default class RightAngle extends Component {
  render() {
     return (
            <Svg xmlns="http://www.w3.org/2000/svg" width="8" height="13" viewBox="0 0 8 13">
                <G fill="none" fill-rule="evenodd">
                    <G fill="#000000" fill-rule="nonzero">
                        <G>
                            <G>
                                <Path d="M9.636 3.234c-.31-.312-.816-.312-1.127 0L3.945 7.825-.64 3.234c-.31-.312-.817-.312-1.128 0-.31.311-.31.818 0 1.13L3.361 9.5c.156.156.35.233.564.233.195 0 .409-.077.564-.233l5.128-5.137c.33-.312.33-.819.02-1.13z" transform="translate(-333 -349) translate(35 345) translate(298 4) rotate(-90 3.934 6.367)"/>
                            </G>
                        </G>
                    </G>
                </G>
            </Svg>
        );
    }
}