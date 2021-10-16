import React, { useEffect, useRef, useState } from "react";

export default function Video(props) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [like, setLike] = useState(false);

  useEffect(() => {
    if (props.pos === true) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.load();
    }
  }, [props.pos]);

  const onPressPlaying = () => {
    if (props.pos === true) {
      setPlaying(true);
    }
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handlePlayButton = () => {
    videoRef.current.play();
    setPlaying(true);
  };
  const handleLike = () => {
    setLike(!like);
  };

  const converToBase64 = (blob) => {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      var base64data = reader.result;
      // console.log("base64", base64data);

      return base64data;
    };
  };

  

  const { video } = props;

  return (
    <div className="video__item">
      <video
        onDoubleClick={handleLike}
        className="video"
        // src={video.url}
        onClick={onPressPlaying}
        ref={videoRef}
        autoPlay={props.pos}
        loop
      >
        <source type="video/webm" src={video.url} ></source>
      </video>
      <div className="item__sidebar">
        <div className="item__sidebar__avatar">
          <div className="item__sidebar__avatar--img">
            <img src={video.avatar} alt="" />
          </div>
          <div className="item__sidebar__avatar--status">
            <i className="fas fa-plus-circle"></i>
          </div>
          <div className="item__sidebar__avatar--status--child"></div>
        </div>
        <div className="item__sidebar__likes item__sidebar--social">
          {like ? (
            <i className="fas fa-heart like__video" onClick={handleLike}></i>
          ) : (
            <i className="fas fa-heart" onClick={handleLike}></i>
          )}
          <div className="item__sidebar--social--number">
            {like ? Number.parseInt(video.like) + 1 : video.like}
          </div>
        </div>
        <div className="item__sidebar__likes item__sidebar--social">
          <i className="fas fa-comment-dots"></i>
          <div className="item__sidebar--social--number">{video.cmt}</div>
        </div>
        <div className="item__sidebar__likes item__sidebar--social">
          <i className="fas fa-share"></i>
          <div className="item__sidebar--social--number">{video.share}</div>
        </div>
        <div className="item__sidebar__spinner">
          <i className="fas fa-compact-disc"></i>
        </div>
      </div>
      <div className="item__footer">
        <div className="item__content">
          <div className="item__content--name">@{video.user}</div>
          <div className="item__content--caption">{video.caption}</div>
        </div>
        <div className="item__footer--music">
          <div className="item__footer--music--icon">
            <i className="fas fa-music"></i>
          </div>
          <div className="item__footer--music--name">
            <div className="item__footer--music--name-c">{video.nameSong}</div>
          </div>
        </div>
      </div>
      {!playing && (
        <div className="video__pause" onClick={handlePlayButton}>
          <i className="fas fa-play"></i>
        </div>
      )}
    </div>
  );
}
