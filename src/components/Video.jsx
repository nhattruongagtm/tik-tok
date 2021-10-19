import React, { useEffect, useRef, useState } from "react";
import {
  likeVideo,
  unLikeVideo,
  likeVideosNotUser,
  unLikeVideosNotUser,
  getUserByID,
} from "../utils/database";

export default function Video(props) {
  let [user, setUser] = useState(() => {
    if (localStorage.getItem("userTiktok")) {
      return JSON.parse(localStorage.getItem("userTiktok"));
    } else {
      return null;
    }
  });

  useEffect(() => {
    if (user !== null) {
      getUserByID(user.id)
        .then((res) => {

          setUser({
            ...user,
            likedVideos: res.likedVideos,
            id: user.id,
          });

          localStorage.setItem("userTiktok", JSON.stringify(user));

        })
        .catch((e) => {
          console.error(e);
        });

        
    }
  }, [user]);


  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [like, setLike] = useState(() => {
    if (user !== null) {
      const index = user.likedVideos.findIndex((item) => {
        return item === props.video.id;
      });

      if (index === -1) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  });
  const [likes, setLikes] = useState(props.video.like);

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
    const l = !like;
    if (user !== null) {
      l === true ? likeVideos() : unLikeVideos();
    } else {
      l === true ? likeVideoNotUser() : unLikeVideoNotUser();
    }

    setLike(!like);

    l === true ? setLikes(likes + 1) : setLikes(likes - 1);
  };

  const likeVideos = () => {
    if (user !== null) {
      likeVideo(user.id, video.id).catch((e) => {
        console.log(e);
      });
    }
  };

  const unLikeVideos = () => {
    if (user !== null) {
      unLikeVideo(user.id, video.id).catch((e) => {
        console.log(e);
      });
    }
  };
  const likeVideoNotUser = () => {
    if (user === null) {
      likeVideosNotUser(video.id).catch((e) => {
        console.log(e);
      });
    }
  };
  const unLikeVideoNotUser = () => {
    if (user === null) {
      unLikeVideosNotUser(video.id).catch((e) => {
        console.log(e);
      });
    }
  };
  // useEffect(() => {
  //   like === true ? likeVideos() : unLikeVideos()
  // },[like]);

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
        <source type="video/webm" src={video.url}></source>
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
            {/* {like ? Number.parseInt(video.like) + 1 : video.like} */}
            {likes}
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
