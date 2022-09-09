import React, {Component} from 'react';
import {
    View, Text, StyleSheet, ScrollView, Alert,
   Image, TouchableOpacity, NativeModules, Dimensions, StatusBar, SafeAreaView
} from 'react-native';
import {CarColors} from "../assets/Colors";

var commonStyles = require('../assets/style');
var ImagePicker = NativeModules.ImageCropPicker;


export default class App extends Component {

    constructor() {
        super();
        this.state = {
            image: null,
            images: null
        };
    }

    cleanupImages() {
        ImagePicker.clean().then(() => {
            // console.log('removed tmp images from tmp directory');
            alert('Temporary images history cleared')
        }).catch(e => {
            alert(e);
        });
    }

    pickMultiple() {
        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            includeExif: true,
            forceJpg: true,
        }).then(images => {
            this.setState({
                image: null,
                images: images.map(i => {
                    console.log('received image', i);
                    return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
                })
            });
        }).catch(e => alert(e));
    }

    scaledHeight(oldW, oldH, newW) {
        return (oldH / oldW) * newW;
    }

    renderImage(image) {
        return <Image style={{width: 200, height: 200, resizeMode: 'contain'}} source={image}/>
    }

    renderAsset(image) {
        if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
            return this.renderVideo(image);
        }

        return this.renderImage(image);
    }

    render() {
        return (
            <SafeAreaView style={styles.safeArea}>

                <View style={styles.container}>
                    <StatusBar
                        backgroundColor={CarColors.primary}
                        barStyle="light-content"/>
                    <TouchableOpacity onPress={this.pickMultiple.bind(this)} style={commonStyles.button}>
                        <Text style={commonStyles.text}>Select Images</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.cleanupImages.bind(this)} style={commonStyles.button}>
                        <Text style={commonStyles.text}>Clean History</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.imgContainer}>
                    {this.state.image ? this.renderAsset(this.state.image) : null}
                    {this.state.images ? this.state.images.map(i => <View style={styles.imgView}
                                                                          key={i.uri}>{this.renderAsset(i)}</View>) : null}
                    {
                        this.state.images &&
                        <TouchableOpacity onPress={this.cleanupImages.bind(this)} style={commonStyles.bottomBtn}>
                            <Text style={commonStyles.text}>Upload</Text>
                        </TouchableOpacity>
                    }
                </ScrollView>


            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: CarColors.white,
    },
    imgContainer: {
        marginVertical: 20
    },
    button: {
        backgroundColor: 'blue',
        marginBottom: 10,
    },
    text: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22
    },
    safeArea: {
        marginTop: 20
    },
    dateContainer: {
        flexDirection: 'row',
    },
    imgView: {
        width: '50%',
        marginVertical: 10,

    }
});