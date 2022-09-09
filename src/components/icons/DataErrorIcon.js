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

 export default class DataErrorIcon extends Component {
  render() {
     return (
            <Svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
                <G fill="#ff5f22" fill-rule="nonzero" opacity=".2">
                    <Path d="M58.322 16.874H24.155l23.406-13.54a1.56 1.56 0 0 1 2.13.571l5.282 9.166a1.558 1.558 0 0 0 2.13.572 1.564 1.564 0 0 0 .57-2.135l-5.28-9.165A4.679 4.679 0 0 0 46.001.627l-28.05 16.228-.03.019H4.677A4.688 4.688 0 0 0 0 21.56v53.751A4.688 4.688 0 0 0 4.678 80h53.644A4.688 4.688 0 0 0 63 75.312v-53.75a4.689 4.689 0 0 0-4.678-4.688zm1.56 58.438c0 .862-.7 1.563-1.56 1.563H4.678c-.86 0-1.56-.701-1.56-1.563v-53.75c0-.862.7-1.563 1.56-1.563h53.644c.86 0 1.56.7 1.56 1.562v53.751zM69.56 33.44A1.512 1.512 0 0 0 68.5 33c-.394 0-.781.16-1.06.44-.28.279-.44.666-.44 1.06 0 .395.16.782.44 1.06.279.28.666.44 1.06.44s.781-.16 1.06-.44c.28-.279.44-.666.44-1.06 0-.395-.16-.782-.44-1.06zM79.362 49.277L72.78 37.801a1.585 1.585 0 0 0-2.173-.586 1.607 1.607 0 0 0-.582 2.187l6.58 11.476a1.61 1.61 0 0 1-.581 2.188l-10.23 5.946a1.607 1.607 0 0 0-.582 2.187 1.588 1.588 0 0 0 2.173.586l10.23-5.946c2.278-1.324 3.061-4.268 1.746-6.562z"/>
                    <Path d="M41.56 25.44A1.51 1.51 0 0 0 40.5 25c-.395 0-.782.16-1.06.44-.28.278-.44.665-.44 1.06s.16.782.44 1.06c.279.28.666.44 1.06.44.395 0 .782-.16 1.06-.44.28-.278.44-.665.44-1.06s-.16-.782-.44-1.06z"/>
                    <Path d="M53.41 25h-6.205c-.879 0-1.591.689-1.591 1.538 0 .85.712 1.539 1.59 1.539h4.614V50.01l-12.63-12.214a1.62 1.62 0 0 0-1.125-.45 1.62 1.62 0 0 0-1.125.45l-8.428 8.15a1.503 1.503 0 0 0 0 2.176c.621.6 1.628.6 2.25 0l7.303-7.062 13.744 13.29.011.01v7.562H11.432l11.55-11.168 8.579 8.296c.621.601 1.628.601 2.25 0 .621-.6.621-1.575 0-2.175l-9.705-9.385a1.62 1.62 0 0 0-1.125-.45 1.62 1.62 0 0 0-1.125.45L9.182 59.748V28.077H30.5c.879 0 1.591-.689 1.591-1.539S31.379 25 30.501 25H7.59C6.712 25 6 25.689 6 26.538v36.924C6 64.312 6.712 65 7.59 65h45.82c.878 0 1.59-.689 1.59-1.538V26.538c0-.85-.712-1.538-1.59-1.538z"/>
                    <Path d="M23 31c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 6.875A1.877 1.877 0 0 1 21.125 36c0-1.034.841-1.875 1.875-1.875s1.875.841 1.875 1.875A1.877 1.877 0 0 1 23 37.875z"/>
                </G>
            </Svg>
        );
    }
}