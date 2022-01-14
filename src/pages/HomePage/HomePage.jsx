import React, { useEffect, useState } from "react";
import NavigationBottom from "../../components/NavigationBottom";
import Video from "../../components/Video";
import Slider from "react-slick";
import { collection, getDocs, query, where } from "@firebase/firestore";
import db from "../../firebase/firebase";
import Loading from "../../components/Loading";
import VideoPlay from "../../components/VideoPlay";
import { getUserByID } from "../../utils/database";


function HomePage() {
  const [position, setPosition] = useState(0);

  // const video = {
  //   id: "doc.id",
  //   caption: "item.caption",
  //   url: "item.url",
  //   user: "item.user",
  //   avatar: "item.avatar",
  //   like: 0,
  //   cmt: 0,
  //   share: 0,
  //   nameSong: "item.nameSong",
  //   urlSong: "item.urlSong",
  //   createdAt: 0,
  //   updatedAt: 0,
  // }

  const [videos, setVideos] = useState([]);
  const [loadding, setLoading] = useState(true);
  var settings = {
    infinite: false,
    speed: 500,
    initialSlide: position,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    afterChange: (olds) => {
      setPosition(olds);
    },
  };

  useEffect(() => {
    async function getAllVideos() {
      const videoRef = collection(db,"videos");
      const q = query(videoRef,where('status','==',1))
      const querySnapshot = await getDocs(q);
      let listVideos = [];

      querySnapshot.forEach((doc) => {
        const item = doc.data();
        
        const videoItem = {
          id: doc.id,
          caption: item.caption,
          url: item.url,
          user: item.user,
          avatar: item.avatar,
          like: item.like,
          cmt: item.cmt,
          share: item.share,
          nameSong: item.nameSong,
          urlSong: item.urlSong,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          userID: item.userID,
        };
        listVideos.push(videoItem);

        // const userID = item.userID;


        // console.log(item);

        listVideos.forEach((item)=>{
          getUserByID(item.userID).then((res) => {
            // console.log("object", res);
            if (res) {
              item.avatar = res.avatar;
              item.nickName = res.nickName;
            }  
          });
        })
        
        
      });
      for (let i = 0; i < listVideos.length; i++) {
        const random = Math.floor(Math.random() * listVideos.length);
        let temp = listVideos[random];
        listVideos[random] = listVideos[i];
        listVideos[i] = temp;
      }

      setVideos(listVideos);
      setLoading(false);
    }
    getAllVideos().catch((e) => {
      console.error(e);
    });
  }, []);

  return (
    <>
      {loadding && <Loading />}
      <VideoPlay videos={videos} position={position} settings={settings} />
      <NavigationBottom />
    </>
  );
}

export default HomePage;
