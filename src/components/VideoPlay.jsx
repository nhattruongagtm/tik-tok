import React from "react";
import LazyLoad from "react-lazyload";
import Slider from "react-slick";
import Profile from "../pages/Profile.jsx/Profile";
import Video from "./Video";

export default function VideoPlay(props) {
  const { settings, position, videos } = props;

  // console.log("videos",videos)


  const Load = () => {
    return (
      <h1>Loading...</h1>
    )
  }

  return (
    <Slider className="videos" {...settings}>
      {videos.length > 0 &&
        videos.map((item, index) => {
          return (
            <LazyLoad key={index} placeholder={<Load/>} height={100} offset={[-100,100]}>
              <Video
                video={item}
                index={index}
                // key={index}
                pos={position === index ? true : false}
              />
            </LazyLoad>
          );
        })}
    </Slider>
  );
}
