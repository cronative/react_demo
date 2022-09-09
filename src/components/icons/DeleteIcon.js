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

 export default class DeleteIcon extends Component {
  render() {
     return (
            <Svg xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 19 21">
                <G fill="#FFF" fill-rule="nonzero" opacity=".8">
                    <Path d="M18.276 2.923h-4.264v-.69A2.246 2.246 0 0 0 11.758 0H7.705a2.246 2.246 0 0 0-2.253 2.234v.689H1.188a.564.564 0 1 0 0 1.127h1.028v13.244c0 1.662 1.365 3.015 3.042 3.015h8.948c1.677 0 3.042-1.353 3.042-3.015V4.05h1.028a.564.564 0 1 0 0-1.127zM6.59 2.233c0-.609.501-1.106 1.116-1.106h4.053c.616 0 1.117.497 1.117 1.107v.689H6.589v-.69zm9.522 15.061a1.9 1.9 0 0 1-1.905 1.887H5.258a1.9 1.9 0 0 1-1.905-1.887V4.05h12.762v13.244h-.004z"/>
                    <Path d="M9.472 17.184c.289 0 .52-.247.52-.556V6.805c0-.31-.231-.556-.52-.556-.29 0-.521.247-.521.556v9.82c0 .308.231.56.52.56zM5.826 16.663c.29 0 .521-.251.521-.566V7.336c0-.315-.231-.566-.52-.566-.29 0-.521.251-.521.566v8.761c0 .315.235.566.52.566zM13.117 16.663c.289 0 .52-.251.52-.566V7.336c0-.315-.231-.566-.52-.566-.29 0-.521.251-.521.566v8.761c0 .315.231.566.52.566z"/>
                </G>
            </Svg>
        );
    }
}