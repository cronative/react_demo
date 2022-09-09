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

 export default class FavoritesRedSolid extends Component {
  render() {
     return (
            <Svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M12.3626 1.60378L12.3628 1.60403C12.9101 2.15105 13.2176 2.89312 13.2176 3.66691C13.2176 4.44069 12.9101 5.18277 12.3628 5.72979L12.3627 5.72991L11.656 6.43658L6.99968 11.0929L2.34334 6.43658L1.63667 5.72991C0.497309 4.59055 0.497309 2.74327 1.63667 1.6039C2.77604 0.464539 4.62332 0.464539 5.76268 1.6039L6.46935 2.31057C6.61 2.45122 6.80077 2.53024 6.99968 2.53024C7.19859 2.53024 7.38936 2.45122 7.53001 2.31057L8.23667 1.6039L8.2368 1.60378C8.78382 1.0565 9.52589 0.749023 10.2997 0.749023C11.0735 0.749023 11.8155 1.0565 12.3626 1.60378Z" fill="#F36A46" stroke="#F36A46" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>
        );
    }
}