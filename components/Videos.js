import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Video from './Video';

function Videos({ setModalVisible, setVideo, loadVideosList, getVideoList }) {

    const [videos, setVideos] = useState([])
    const [onEndReachedCalledDuringMomentum, setonEndReachedCalledDuringMomentum] = useState(false)
    const refContainer = useRef(null); 

    const selectVideo = (video) => {
        if (refContainer.current) {
            refContainer.current.scrollToIndex({ animated: true, index: 0 });
        }
        setModalVisible(true);
        setVideo(video);
        loadVideosList();
    }

    useEffect(() => {
        loadVideosList()
    }, [])

    const retrieveMore = () => {
        if (!onEndReachedCalledDuringMomentum) {
            console.log("retrieveMore")
            loadVideosList(true);
            setonEndReachedCalledDuringMomentum(true)
        }
    };

    return (
        getVideoList ? (
            <FlatList
                ref={refContainer}
                // Data
                data={getVideoList}
                // Render Items
                renderItem={(video) => (
                    <TouchableOpacity
                        onPress={() => selectVideo(video.item)}
                        key={video.index}>
                        <Video
                            videoObj={video.item}
                        />
                    </TouchableOpacity>
                )}
                onMomentumScrollBegin={() => { setonEndReachedCalledDuringMomentum(false) }}
                // Item Key
                // keyExtractor={(video, index) => String(index)}
                // Header (Title)
                // ListHeaderComponent={this.renderHeader}
                // Footer (Activity Indicator)
                // ListFooterComponent={this.renderFooter}
                // On End Reached (Takes a function)
                onEndReached={({ distanceFromEnd }) => { if (distanceFromEnd < 0) return; retrieveMore() }}
                // How Close To The End Of List Until Next Data Request Is Made
                onEndReachedThreshold={0}
            // Refreshing (Set To True When End Reached)
            // refreshing={this.state.refreshing}
            />
        ) : <></>
        // <ScrollView style={styles.container}>
        //     {getVideoList && getVideoList.map((video, index) => {
        //         // console.log("video=", video)
        //         return (
        //             <TouchableOpacity
        //                 onPress={() => selectVideo(video)}
        //                 key={index}>
        //                 <Video
        //                     videoObj={video}
        //                 />
        //             </TouchableOpacity>

        //         )
        //     }
        //     )}
        // </ScrollView>
    )
}

export default Videos

const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    }
})
