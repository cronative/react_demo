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

 export default class VideoPlayIcon extends Component {
  render() {
     return (
            <Svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M12.9394 6.70001C14.5907 7.61366 15.4163 8.07048 15.69 8.67323C15.9285 9.19861 15.9285 9.8014 15.69 10.3268C15.4163 10.9295 14.5907 11.3863 12.9394 12.3L4.74921 16.8316C3.18637 17.6963 2.40494 18.1287 1.76558 18.0532C1.20771 17.9874 0.703254 17.6899 0.375562 17.2337C1.08947e-06 16.7108 1.12851e-06 15.8177 1.20659e-06 14.0316L1.60275e-06 4.96841C1.68082e-06 3.18228 1.71986e-06 2.28922 0.375563 1.76632C0.703255 1.31006 1.20771 1.01265 1.76558 0.946806C2.40494 0.871346 3.18637 1.3037 4.74922 2.16842L12.9394 6.70001Z" fill="#F36A46"/>
            </Svg>        
        );
    }
}