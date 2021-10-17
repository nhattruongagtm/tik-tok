import React, { useEffect, useState } from "react";
import NavigationBottom from "../../components/NavigationBottom";
import Video from "../../components/Video";
import Slider from "react-slick";
import { collection, getDocs } from "@firebase/firestore";
import db from "../../firebase/firebase";
import Loading from "../../components/Loading";

function HomePage() {
  const [position, setPosition] = useState(0);
  const [videos, setVideos] = useState([]);
  const [loadding,setLoading] = useState(true);
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
      const querySnapshot = await getDocs(collection(db, "videos"));
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
        };
        listVideos.push(videoItem);
      });

      setVideos(listVideos);
      setLoading(false);
    }
    getAllVideos().catch((e) => {
      console.error(e);
    });
  }, []);


  return (
    <>
      {
        loadding && <Loading/>
      }
      <Slider className="videos" {...settings}>
        {videos.length > 0 &&
          videos.map((item, index) => {
            return (
              <Video
                video={item}
                index={index}
                key={index}
                pos={position === index ? true : false}
              />
            );
          })}
      </Slider>
      <NavigationBottom />
    </>
  );
}

export default HomePage;
