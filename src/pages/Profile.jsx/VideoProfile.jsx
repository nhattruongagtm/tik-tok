import { collection, getDocs } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Loading from "../../components/Loading";
import NavigationBottom from "../../components/NavigationBottom";
import VideoPlay from "../../components/VideoPlay";
import db from "../../firebase/firebase";
import {
  getLikedVideosByUser,
  getPostedVideosByUser,
} from "../../utils/database";

export default function VideoProfile() {
  const [videos, setVideos] = useState([]);
  const user = localStorage.getItem("userTiktok")
    ? JSON.parse(localStorage.getItem("userTiktok"))
    : null;
  const location = useLocation();
  const qs = require("query-string");
  const type = qs.parse(location.search).type;
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
  }

  useEffect(() => {
    async function getAllVideos() {
      let v = [];
      switch (type) {
        case "posted":
          v = await getPostedVideosByUser(user.nickName, 1);

          setVideos(v);
          break;
        case "liked":
          v = await getLikedVideosByUser(user.id, 1);

          setVideos(v);
          break;
        case "hidden":
          v = await getPostedVideosByUser(user.nickName, 0);

          setVideos(v);
          break;
      }
      setLoading(false);
    }
    if (user !== null) {
      getAllVideos().catch((e) => {
        console.error(e);
      });
    }
  }, []);
  console.log(position);

  return (
    <>
      {loadding && <Loading />}
      <VideoPlay videos={videos} position={position} settings={settings} />
      <NavigationBottom />
    </>
  );
}
