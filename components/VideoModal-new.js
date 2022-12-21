import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import Video, {
    OnSeekData,
    OnLoadData,
    OnProgressData,
} from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import { FullscreenClose, FullscreenOpen } from '../src/assets/icons';
// import { PlayerControls, ProgressBar } from '../components';
import Videos from "./Videos";

function VideoModal ({ video, setVideo, setModalVisible, loadVideosList, getVideoList }) {

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
            : (setState(s => ({ ...s, fullscreen: false })),
                StatusBar.setHidden(false));
    }

    function handleFullscreen() {
        state.fullscreen
            ? Orientation.unlockAllOrientations()
            : Orientation.lockToLandscapeLeft();
    }

    function handlePlayPause() {
        // If playing, pause and show controls immediately.
        if (state.play) {
            setState({ ...state, play: false, showControls: true });
            return;
        }

        setState({ ...state, play: true });
        setTimeout(() => setState(s => ({ ...s, showControls: false })), 2000);
    }

    function skipBackward() {
        videoRef.current.seek(state.currentTime - 15);
        setState({ ...state, currentTime: state.currentTime - 15 });
    }

    function skipForward() {
        videoRef.current.seek(state.currentTime + 15);
        setState({ ...state, currentTime: state.currentTime + 15 });
    }

    function onSeek(data) {
        videoRef.current.seek(data.seekTime);
        setState({ ...state, currentTime: data.seekTime });
    }

    function onLoadEnd(data) {
        setState(s => ({
            ...s,
            duration: data.duration,
            currentTime: data.currentTime,
        }));
    }

    function onProgress(data) {
        setState(s => ({
            ...s,
            currentTime: data.currentTime,
        }));
    }

    function onEnd() {
        setState({ ...state, play: false });
        videoRef.current.seek(0);
    }

    function showControls() {
        state.showControls
            ? setState({ ...state, showControls: false })
            : setState({ ...state, showControls: true });
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback >
                <View>
                    <Video
                        ref={videoRef}
                        source={{ uri: `file://${video.videoPath}` }}
                        style={state.fullscreen ? styles.fullscreenVideo : styles.video}
                        controls={true}
                        resizeMode={'contain'}
                        onLoad={onLoadEnd}
                        onProgress={onProgress}
                        onEnd={onEnd}
                        paused={!state.play}
                    />
                    {state.showControls && (
                        <View style={styles.controlOverlay}>
                            <TouchableOpacity
                                onPress={handleFullscreen}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                style={styles.fullscreenButton}>
                                {state.fullscreen ? <FullscreenClose /> : <FullscreenOpen />}
                            </TouchableOpacity>
                            {/* <PlayerControls
                                onPlay={handlePlayPause}
                                onPause={handlePlayPause}
                                playing={state.play}
                                showPreviousAndNext={false}
                                showSkip={true}
                                skipBackwards={skipBackward}
                                skipForwards={skipForward}
                            />
                            <ProgressBar
                                currentTime={state.currentTime}
                                duration={state.duration > 0 ? state.duration : 0}
                                onSlideStart={handlePlayPause}
                                onSlideComplete={handlePlayPause}
                                onSlideCapture={onSeek}
                            /> */}
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
            <Videos
                setVideo={setVideo}
                setModalVisible={setModalVisible}
                loadVideosList={loadVideosList}
                getVideoList={getVideoList}
            />
        </View>
    );

 
};

export default VideoModal;


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
        height: Dimensions.get('window').width,
        width: Dimensions.get('window').height,
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