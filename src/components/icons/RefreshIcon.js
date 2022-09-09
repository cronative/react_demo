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

 export default class RefreshIcon extends Component {
  render() {
     return (
            <Svg version="1.1" id="Capa_1" height="18" width="18" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 480.35 480.35" style="enable-background:new 0 0 480.35 480.35;">
            <G>
                <G fill="#727272">
                    <Path d="M171.821,10.011C117.777,26.075,71.114,60.653,40.015,107.682c-4.271,7.706-6.938,16.196-7.84,24.96v-84.32h-32v128h128
                        v-32h-72.32c35.828-68.925,106.646-112.572,184.32-113.6c92.115,1.071,172.856,61.854,199.36,150.08l30.72-9.12
                        C432.489,44.627,298.876-27.755,171.821,10.011z"/>
                </G>
            </G>
            <G>
                <G fill="#727272">
                    <Path d="M352.175,304.322v32h72.32c-35.828,68.925-106.646,112.572-184.32,113.6c-92.115-1.071-172.856-61.854-199.36-150.08
                        l-30.72,9.12c37.928,127.006,171.634,199.218,298.64,161.29c55.628-16.612,103.349-52.826,134.32-101.93
                        c3.318-6.262,5.075-13.233,5.12-20.32v84.32h32v-128H352.175z"/>
                </G>
            </G>
            </Svg>
        );
    }
}