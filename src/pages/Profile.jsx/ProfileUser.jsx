import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import USER_KEY from "../../constants/key";
import {
  follow,
  getPostedVideosByUser,
  getProfileByNickName,
  getTotalLikes,
  getUserByID,
  unfollow,
} from "../../utils/database";
import ProfileVideoItem from "./ProfileVideoItem";

export default function ProfileUser(props) {
  // *************************** trang profile của các account khác ***************************************
  const u = useSelector((state)=>state.session.user);
  const defaultUser = {
    username: "",
    password: "",
    nickName: "",
    likes: 0,
    following: [],
    followers: [],
    name: "",
    likedVideos: [],
    bio: "",
    id: "",
    avatar: "",
  };
  const [session, setSession] = useState(defaultUser);
  const [user, setUser] = useState(u);
  const { video } = props;

  const [tab, setTab] = useState(0);
  const [isFollow, setIsFollow] = useState(false);
  const isDisplayFollow = useRef(false);
  const count = useRef(0);
  const tabValue = ["posted", "liked", "hidden"];

  const history = useHistory();
  const [totalLike, setTotalLike] = useState(0);
  const [likedVideos, setLikedVideos] = useState([]);
  const [postedVideos, setPostedVideos] = useState([]);
  const [postedHiddenVideos, setPostedHiddenVideos] = useState([]);

  // console.log(user);

  useEffect(() => {
    getUserByID(video.userID).then((res) => {
      if(res){
        setUser(res);
      }
    });

    if (u !== null) {
      getUserByID(u.id).then((res) => {
        if(res){
          setSession(res);
        }
      });
    }
  }, []);

  // console.log(user)
  // console.log(session)

  useEffect(() => {
    if (user) {
      getPostedVideosByUser(user.id, 1).then((res) => {
        setPostedVideos(res);
      });

      getTotalLikes(user.id).then((res) => {
        setTotalLike(res);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      if (
        session.following.findIndex((item) => {
          return item === user.id;
        }) !== -1
      ) {
        setIsFollow(true);
      }
    }
  }, [session]);

  const handleChangeTab = (pos) => {
    console.log(pos);
    setTab(pos);
  };

  const handleDisplayProfile = (value) => {
    props.isDisplayProfiles(value);
  };

  const handleFollow = () => {
    if (u === null) {
      alert("Vui lòng đăng nhập!");
    } else {
      isFollow === true ? unFollowUser() : followUser();
    }
  };

  async function followUser() {
    await follow(u.id, user.id);
    setIsFollow(!isFollow);
  }
  async function unFollowUser() {
    await unfollow(u.id, user.id);
    setIsFollow(!isFollow);
  }

  

  return (
    <>
      <div className="profile profile__u">
        {/* {!displayLogin && user && ( */}
        <div className="profile__header">
          <i
            className="fas fa-arrow-left"
            onClick={() => handleDisplayProfile(false)}
          ></i>
          {/* {user !== null ? ( */}
          <div className="profile__change--user">
            {user && user.name}
            <span>
              <i className="fas fa-sort-down"></i>
            </span>
          </div>
          <div htmlFor="profile__menu"></div>
          <input id="profile__menu" type="checkbox" hidden />
          <label
            htmlFor="profile__menu"
            className="profile__header--layer"
          ></label>
        </div>
        {/* )} */}
        {user && (
          <div className="profile__scroll">
            <div className="profile__main">
              <div className="profile__main--img">
                <img src={user.avatar} alt="" />
              </div>
              <div className="profile__main--nickname">{user.nickName}</div>

              <div className="profile__main--edit ">
                <div
                  className={`profile__main--edit--first ${
                    isFollow === false ? "btn--follow" : "btn--unfollow"
                  }`}
                  onClick={handleFollow}
                >
                  {isFollow === false ? "Theo dõi" : "Đã theo dõi"}
                </div>
              </div>

              <div className="profile__main--info">
                <div className="profile__main--info--following">
                  <span>{user.following.length}</span>
                  <span>Đang follow</span>
                </div>
                <div className="profile__main--info--follower">
                  <span>{user.followers.length}</span>
                  <span>Follower</span>
                </div>
                <div className="profile__main--info--like">
                  <span>{totalLike}</span>
                  <span>Thích</span>
                </div>
              </div>
              <div className="profile__main--instruction">{user.bio}</div>
            </div>

            <div className="profile__videos">
              <div className="profile__videos--tabs profile__videos--tabs-u">
                <div
                  className={
                    tab === 0
                      ? "profile__videos--tabs--me active__videos"
                      : "profile__videos--tabs--me"
                  }
                  onClick={() => handleChangeTab(0)}
                >
                  <i className="fas fa-user-edit"></i>
                </div>
              </div>

              {tab === 0 && (
                <div className="profile__videos--me--scroll">
                  <div className="profile__videos--me">
                    {postedVideos.length > 0 &&
                      postedVideos.map((item, index) => {
                        return (
                          <ProfileVideoItem
                            video={item}
                            key={index}
                            type={tabValue[0]}
                            pos={index}
                          />
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
