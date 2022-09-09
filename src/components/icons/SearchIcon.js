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

 export default class SearchIcon extends Component {
  render() {
     return (
            <Svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20">
                <Path fill="#110F17" d="M19.762 18.663l-4.878-4.878c1.212-1.458 1.943-3.33 1.943-5.371C16.827 3.774 13.053 0 8.414 0 3.774 0 0 3.774 0 8.414c0 4.639 3.774 8.413 8.414 8.413 2.04 0 3.912-.73 5.37-1.943l4.88 4.878c.151.152.35.228.549.228.199 0 .398-.076.55-.228.303-.303.303-.795 0-1.099zM1.554 8.413c0-3.781 3.077-6.859 6.86-6.859 3.782 0 6.859 3.078 6.859 6.86 0 3.782-3.077 6.859-6.86 6.859-3.782 0-6.859-3.077-6.859-6.86z"/>
            </Svg>
        );
    }
}