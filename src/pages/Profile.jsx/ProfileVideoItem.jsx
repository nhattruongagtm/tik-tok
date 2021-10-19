import React from "react";
import { useHistory } from "react-router";

export default function ProfileVideoItem(props) {
  const { video, type, pos} = props;
  const history = useHistory();
  const handleDetailVideo = () => {
    history.push(`/video-profile?type=${type}&pos=${pos}`);
  };
  return (
    <div className="profile__videos--item" onClick={handleDetailVideo}>
      <video className="profile__videos--item--video" muted autoPlay loop>
        <source src={video.url} type="video/mp4"></source>
      </video>
      <div className="profile__videos--item--views">
        <i className="fas fa-play"></i>
        <span>{video.like}</span>
      </div>
      <div className="profile__videos--item--layer"></div>
    </div>
  );
}
