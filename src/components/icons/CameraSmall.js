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

 export default class CameraSmall extends Component {
  render() {
     return (
            <Svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M14.4154 11.0833C14.4154 11.7277 13.893 12.25 13.2487 12.25H2.7487C2.10437 12.25 1.58203 11.7277 1.58203 11.0833V4.66667C1.58203 4.02233 2.10437 3.5 2.7487 3.5H5.08203L6.2487 1.75H9.7487L10.9154 3.5H13.2487C13.893 3.5 14.4154 4.02233 14.4154 4.66667V11.0833Z" stroke="#F36A46" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <Path fill-rule="evenodd" clip-rule="evenodd" d="M8.0013 9.91667C9.28997 9.91667 10.3346 8.872 10.3346 7.58333C10.3346 6.29467 9.28997 5.25 8.0013 5.25C6.71264 5.25 5.66797 6.29467 5.66797 7.58333C5.66797 8.872 6.71264 9.91667 8.0013 9.91667Z" stroke="#F36A46" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}