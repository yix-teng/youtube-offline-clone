import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Dimensions, StatusBar } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/Entypo';
import Video from 'react-native-video';
import Videos from "./Videos";


function VideoModal({ video, setVideo, setModalVisible, loadVideosList, getVideoList }) {

    const videoRef = React.createRef();
    const [state, setState] = useState({
        fullscreen: false,
        play: false,
        currentTime: 0,
        duration: 0,
        showControls: true,
    });

    useEffect(() => {
        Orientation.addOrientationListener(handleOrientation);

        return () => {
            Orientation.removeOrientationListener(handleOrientation);
        };
    }, []);

    function handleOrientation(orientation) {
        orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
            ? (setState(s => ({ ...s, fullscreen: true })), StatusBar.setHidden(true))
            : (setState(s => ({ ...s, fullscreen: false })), StatusBar.setHidden(false));
    }

    function handleFullscreen() {
        state.fullscreen
            ? Orientation.unlockAllOrientations()
            : Orientation.lockToLandscapeLeft();
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={{ backgroundColor: "#ffffff", height: 230 }}>

                    <Video
                        style={state.fullscreen ? styles.fullscreenVideo : styles.video}
                        ref={videoRef}
                        resizeMode={'contain'}
                        // fullscreen={true}
                        // fullscreenOrientation={"landscape"}
                        controls={true}
                        source={{ uri: `file://${video.videoPath}` }}
                        hideShutterView={true}
                        onEnd={() => {
                            const shuffled = getVideoList.sort(() => 0.5 - Math.random());
                            setVideo(shuffled[0])
                            loadVideosList()
                        }}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                >
                    {/* <Icon name="chevron-thin-down" size={25} color="#ffffff" /> */}
                </TouchableOpacity>
                {/* <View style={{ flex: 1, backgroundColor: "#ffffff", height: 300 }}>
                    <Text>YOOOOO</Text>
                </View> */}
                {state.fullscreen ?
                    <></>
                    :
                    <Videos
                        setVideo={setVideo}
                        setModalVisible={setModalVisible}
                        loadVideosList={loadVideosList}
                        getVideoList={getVideoList}
                    />
                }
            </SafeAreaView>
        </View>
    )
}

export default VideoModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ebebeb',
    },
    video: {
        height: Dimensions.get('window').width * (9 / 16),
        width: Dimensions.get('window').width,
        backgroundColor: 'black',
    },
    fullscreenVideo: {
        height: Dimensions.get('window').width-45,
        width: Dimensions.get('window').height+20,
        backgroundColor: 'black',
    },
    text: {
        marginTop: 30,
        marginHorizontal: 20,
        fontSize: 15,
        textAlign: 'justify',
    },
    fullscreenButton: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'flex-end',
        alignItems: 'center',
        paddingRight: 10,
    },
    controlOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000000c4',
        justifyContent: 'space-between',
    },
});