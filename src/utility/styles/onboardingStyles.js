import { Dimensions, Platform } from 'react-native';
const { width, height } = Dimensions.get('window')
export const OnboardingStyles = {
  swiperstyle: {
    height: Platform.OS === 'ios' ? 575 : 575,
  },
  dotsinactive: {
    backgroundColor: '#ECEDEE',
    width: 6,
    height: 6,
    borderRadius: 6,
    marginLeft: 4,
    marginRight: 4
  },
  dotsactive: {
    backgroundColor: '#110F17',
    width: 7,
    height: 7,
    borderRadius: 6,
    marginLeft: 4,
    marginRight: 4
  },
};
