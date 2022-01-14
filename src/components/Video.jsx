import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import USER_KEY from "../constants/key";
import ProfileUser from "../pages/Profile.jsx/ProfileUser";
import {
  getMessageByVideos,
  getProfileByNickName,
  getUserByID,
  likeVideo,
  likeVideosNotUser,
  unLikeVideo,
  unLikeVideosNotUser,
} from "../utils/database";
import CommentPanel from "./CommentPanel";
export default function Video(props) {
  const [isDisplayProfile, setIsDisplayProfile] = useState(false);
  const [comments, setComments] = useState();
  const history = useHistory();
  const u = useSelector((state) => state.session.user);
  let [user, setUser] = useState(u);
  const [userVideo, setUserVideo] = useState();

  useEffect(() => {
    if (user !== null) {
      getUserByID(user.id)
        .then((res) => {
          setUser({
            ...user,
            likedVideos: res.likedVideos,
            id: user.id,
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }

    getUserByID(props.video.userID).then((res) => {
      if (res) {
        // console.log("userVideo",res)
        setUserVideo(res);
      }
    });
  }, []);

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
  const handleDisplayProfile = (value) => {
    setIsDisplayProfile(value);
    
  };
  const handleDisplayInfo = (value) => {
    setIsDisplayProfile(true);
  };
  const { video } = props;

  // console.log("VVVVVVVVVVVVVVVVVV",video);

  // ************ comment *************
  const [isDisplayComment, setIsDisplayComment] = useState(false);

  const handleDisplayComment = () => {
    setIsDisplayComment(!isDisplayComment);
  };
  const handleGetDisplayComment = (value) => {
    setIsDisplayComment(value);
  };

  // console.log(isDisplayComment)

  useEffect(() => {
    // console.log("cmt");
    let isCancelled = false;
    getMessageByVideos(video.id).then((res) => {
      if (!isCancelled) {
        setComments(res);
      }
    });

    return () => {
      // console.log("unmounted video")
      isCancelled = true;
    };
  }, []);

  const handleUpdateNewComment = (value) => {
    if (value === true) {
      getMessageByVideos(video.id).then((res) => {
        setComments(res);
      });
    }
  };

  let convertLike = `${likes}`;
  if (likes >= 1000000) {
    convertLike = `${(likes / 1000000).toFixed(1)}M`;
  } else if (likes >= 1000) {
    convertLike = `${(likes / 1000).toFixed(1)}K`;
  }

  // console.log("loading...")

  return (
    <div className="video__main">
      <div className="video__item video__display">
        <video
          onDoubleClick={handleLike}
          className="video"
          // src={video.url}
          onClick={onPressPlaying}
          ref={videoRef}
          autoPlay={props.pos}
          loop
          playsInline
          // muted
        >
          <source type="video/webm" src={video.url}></source>
        </video>
        <div className="item__sidebar">
          <div className="item__sidebar__avatar">
            <div
              className="item__sidebar__avatar--img"
              onClick={handleDisplayInfo}
            >
              <img src={userVideo && userVideo.avatar} alt="" />
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
            <div className="item__sidebar--social--number">{convertLike}</div>
          </div>
          <label
            className="item__sidebar__likes item__sidebar--social"
            htmlFor="cmts"
            onClick={handleDisplayComment}
          >
            <i className="fas fa-comment-dots"></i>
            <div className="item__sidebar--social--number">
              {comments && comments.length}
            </div>
          </label>
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
            <div className="item__content--name">
              @{userVideo && userVideo.nickName}
            </div>
            <div className="item__content--caption">{video.caption}</div>
          </div>
          <div className="item__footer--music">
            <div className="item__footer--music--icon">
              <i className="fas fa-music"></i>
            </div>
            <div className="item__footer--music--name">
              <div className="item__footer--music--name-c">
                {video.nameSong}
              </div>
            </div>
          </div>
        </div>
        {!playing && (
          <div className="video__pause" onClick={handlePlayButton}>
            <i className="fas fa-play"></i>
          </div>
        )}
      </div>
      <div
        className={
          isDisplayProfile === false
            ? "profile__user"
            : "profile__user profile__display"
        }
      >
        <ProfileUser isDisplayProfiles={handleDisplayProfile} video={video} />
      </div>
      {/* <div className={isDisplayComment ? 'comment__panel--display':''}> */}
      {isDisplayComment && (
        <CommentPanel
          user={user}
          video={video}
          isDisplayComment={handleGetDisplayComment}
          commentCount={comments.length}
          // updateComment={handleUpdateNewComment}
        />
      )}
      {/* </div> */}
    </div>
  );
}
