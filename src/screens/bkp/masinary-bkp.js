// import React from 'react';
// import {LoginStyles} from '../utility/styles';
// import { ScrollView, View, Text, Button, Dimensions} from 'react-native';
// import MasinaryCard from '../components/MasinaryCard';
// import RNPickerSelect from "react-native-picker-select";

// const itemWidth = Dimensions.get('window').width;

// const Explore = ({navigation}) => {
//  const masinary= [
//   {
//   id: 1,
//   categoriesTitle:'Hair',
//   categoriesSubtitle:'5442 pro’s',
//   categoriesImg: require("../assets/images/categories-icon/hair.png")
//   },
//   {
//   id: 2,
//   categoriesTitle:'MakeUp',
//   categoriesSubtitle:'1298 pro’s',
//   categoriesImg: require("../assets/images/categories-icon/makeup.png")
//   },
//   {
//   id: 3,
//   categoriesTitle:'Nails',
//   categoriesSubtitle:'2475 pro’s',
//   isChacked: false,
//   categoriesImg: require("../assets/images/categories-icon/nails.png")
//   },
//   {
//   id: 4,
//   categoriesTitle:'Skincare',
//   categoriesSubtitle:'1988 pro’s',
//   isChacked: false,
//   categoriesImg: require("../assets/images/categories-icon/skincare.png")
//   },
//   {
//   id: 5,
//   categoriesTitle:'Microblading',
//   categoriesSubtitle:'1265 pro’s',
//   isChacked: false,
//   categoriesImg: require("../assets/images/categories-icon/microblading.png")
//   },
//   {
//   id: 6,
//   categoriesTitle:'Eyebrows',
//   categoriesSubtitle:'1893 pro’s',
//   isChacked: false,
//   categoriesImg: require("../assets/images/categories-icon/eyebrows.png")
//   },
//   {
//   id: 7,
//   categoriesTitle:'Eyelashes',
//   categoriesSubtitle:'1290 pro’s',
//   isChacked: false,
//   categoriesImg: require("../assets/images/categories-icon/eyelashes.png")
//   },
// ]

//   return (
//     <ScrollView>
//         <View>
//             <View
//               style={{
//                 width: itemWidth,
//                 flexDirection: 'row'
//               }}
//             >
//                 <View style={{width: itemWidth *.5 - 15, marginHorizontal:10,marginTop: 10 }}>
//                   {
//                     masinary.length ?
//                     masinary.map(
//                         (item, di) => {
//                           if(di%2==0){
//                           return <View key={item.id} style={{ marginTop: 10   }}>
//                               <MasinaryCard
//                               data={item}
//                               // itemWidth={(itemWidth - 20) / 2}
//                               // goToProductDetails={this.goToProductDetails}
//                               // goToPostDetails={this.goToPostDetails}
//                               // goToFindSmililarItem={
//                               //   this.goToFindSmililarItem
//                               // }
//                             />
//                             </View>
//                           }
//                         }) : (<></>)
//                   }
//                 </View>
//                 <View style={{width: itemWidth *.5 - 15,marginTop: 10  }}>
//                   {
//                     masinary.length ?
//                     masinary
//                         .map((item, di) => {
//                           if(di%2==1){
//                           return <View key={item.id} style={{marginTop: 10  }}>
//                             <MasinaryCard
//                       data={item}
//                       // itemWidth={(itemWidth - 20) / 2}
//                       // goToProductDetails={this.goToProductDetails}
//                       // goToPostDetails={this.goToPostDetails}
//                       // goToFindSmililarItem={
//                       //   this.goToFindSmililarItem
//                       // }
//                     />
//                             </View>}
//                         }) : (<></>)
//                   }
//                 </View>
//             </View>


//                   <View>
//                   <RNPickerSelect
//                             onValueChange={(value) => console.log(value)}
//                             useNativeAndroidPickerStyle={false}
//                             placeholder={placeholder}
//                             items={[
//                                 { label: "JavaScript", value: "JavaScript" },
//                                 { label: "TypeStript", value: "TypeStript" },
//                                 { label: "Python", value: "Python" },
//                                 { label: "Java", value: "Java" },
//                                 { label: "C++", value: "C++" },
//                                 { label: "C", value: "C" },
//                             ]}
//                             Icon={() => {
//                               return <DownArrow/>;
//                             }}
//                             style={{
//                               ...customPickerStyles,
//                               iconContainer: {
//                                 top: Platform.OS === 'ios' ? 15 : 23,
//                                 right: Platform.OS === 'ios' ? 15 : 18,
//                               },                
//                             }}
//                         />
//                   </View>


//         </View>
//     </ScrollView>
//   );
// };


// const customPickerStyles = StyleSheet.create({
//   inputIOS: {
//     fontSize: 16,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderWidth: 1,
//     borderColor: '#ECEDEE',
//     borderRadius: 8,
//     color: '#939DAA',
//     paddingRight: 30, // to ensure the text is never behind the icon
//     fontFamily: 'SofiaPro',
//   },
//   inputAndroid: {
//     fontSize: 16,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderWidth: 1,
//     borderColor: '#ECEDEE',
//     borderRadius: 8,
//     color: '#939DAA',
//     paddingRight: 30, // to ensure the text is never behind the icon
//     fontFamily: 'SofiaPro',
//   },
// });

// export default Explore;
