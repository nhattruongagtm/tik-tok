import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import Loading from "../../components/Loading";
import NavigationBottom from "../../components/NavigationBottom";
import VideoPlay from "../../components/VideoPlay";
import {
  getLikedVideosByUser,
  getPostedVideosByUser
} from "../../utils/database";

export default function VideoProfile() {
  const [videos, setVideos] = useState([]);
  const user = useSelector((state) => state.session.user);
  const location = useLocation();
  const qs = require("query-string");
  const type = qs.parse(location.search).type;
  const userID = qs.parse(location.search).id;
  const [position, setPosition] = useState(qs.parse(location.search).pos);
  const [loadding, setLoading] = useState(true);


  const settings = {
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
      let v = [];
      switch (type) {
        case "posted":
          console.log("a")
          v = await getPostedVideosByUser(userID, 1);


          setVideos(v);
          break;
        case "liked":
          console.log("b")
          v = await getLikedVideosByUser(userID);

          setVideos(v);
          break;
        case "hidden":
          console.log("c")
          v = await getPostedVideosByUser(userID, 0);

          setVideos(v);
          break;
      }
      setLoading(false);
    }

    getAllVideos().catch((e) => {
      console.error(e);
   
  })
  
   
    
  }, [userID]);

 

  return (
    <>
      {loadding && <Loading />}
      <VideoPlay videos={videos} position={position} settings={settings} />
      <NavigationBottom />
    </>
  );
}
