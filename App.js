import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Modal, PermissionsAndroid, SafeAreaView, StyleSheet, View } from "react-native";
import * as RNFS from 'react-native-fs';
import GestureRecognizer from 'react-native-swipe-gestures';
import Categories from "./components/Categories";
import Footer from './components/Footer';
import Header from "./components/Header";
import VideoModal from "./components/VideoModal";
import Videos from "./components/Videos";

export default function App() {

  const [modalVisible, setModalVisible] = useState(false)
  const [video, setVideo] = useState({})
  const [videoList, setVideoList] = useState()
  const [statusBarVisible, setStatusBarVisible] = useState(true)

  async function getVidList(path) {

    const items = await RNFS.readDir(path);

    var videoItemList = [];

    // https://stackoverflow.com/questions/71594061/recursion-async-function-does-not-respect-wait-for-promise
    for (const item of items) {
      // items.forEach(item => {
      if (item.isFile()) {
        // console.log("file=", item.path);
        if (item.path.endsWith(".mp4")) {
          var videoItem = {
            thumbnail: item.path.replace(".mp4", ".png"),
            title: item.name.replace(".mp4", ""),
            videoPath: item.path,
            publishedAt: new Date()
          }
          videoItemList.push(videoItem);
        }
      } else if (item.isDirectory()) {
        // console.log("dir=", item.path);
        const files = await getVidList(item.path);
        // console.log("files from dir=", files);
        if (videoItemList.length === 0)
          videoItemList = files
        else {
          // console.log("files from dir=", files);
          videoItemList = videoItemList.concat(files);
          // console.log("videoItemList=", videoItemList);
        }
        // console.log("videoItemList=", videoItemList);

      }
    }
    return videoItemList;
  }

  const loadVideosList = (append = false) => {

    // Ask for permission
    const granted = PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Storage permission needed',
        message: 'Can read ?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    getVidList(RNFS.ExternalStorageDirectoryPath + "/Download/youtube").then(files => {

      var rawFiles = files;
      // console.log("rawFiles=", rawFiles)

      // const shuffled = rawFiles.sort(() => 0.5 - Math.random());
      const shuffled = shuffle(rawFiles);
      // console.log(shuffled)
      if (!append)
        setVideoList(shuffled.slice(0, 10))
      else {
        if (videoList.length < 100)
          setVideoList([...videoList, ...shuffled.slice(0, 10)])
      }
    })
  }

  function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureRecognizer
          style={{ flex: 1 }}
          // onSwipeUp={() => setModalVisible(true)}
          onSwipeDown={() => setModalVisible(false)}
        >
          <Modal
            animationType="slide"
            transparent={false}
            presentationStyle={"fullScreen"}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <VideoModal
              video={video}
              setVideo={setVideo}
              setModalVisible={setModalVisible}
              loadVideosList={loadVideosList}
              getVideoList={videoList}
              setStatusBarVisible={setStatusBarVisible}
            />
          </Modal>
        </GestureRecognizer>
        <Header />
        {/* Header */}
        <Categories />
        <Videos
          setVideo={setVideo}
          setModalVisible={setModalVisible}
          loadVideosList={loadVideosList}
          getVideoList={videoList}
        />
        {/* Video List */}
        <Footer />
        {/* Footer */}
      </SafeAreaView>
      <StatusBar hidden={!statusBarVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    flex: 1
  },
});
