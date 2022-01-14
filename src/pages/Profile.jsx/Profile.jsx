import { collection, doc, getDoc, onSnapshot } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import Accounts from "../../components/Accounts";
import EditProfileForm from "../../components/EditProfileForm";
import NavigationBottom from "../../components/NavigationBottom";
import USER_KEY from "../../constants/key";
import db from "../../firebase/firebase";
import {
  getLikedVideosByUser,
  getPostedVideosByUser,
  getTotalLikes,
  getUserByID,
} from "../../utils/database";
import ProfileVideoItem from "./ProfileVideoItem";
import { getUser } from "../../features/session/sessionSlice";

export default function Profile() {
  // *************************** trang profile của các account khác ***************************************

  const user = useSelector((state) => state.session.user);

  const [u, setU] = useState(user);

  const [isDisplayEditForm, setIsDisplayEditForm] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const profileString = require("query-string");
  const location = useLocation();
  const profileID = profileString.parse(location.search).id;

  const [tab, setTab] = useState(0);
  const tabValue = ["posted", "liked", "hidden"];
  const [displayLogin, setDisplayLogin] = useState(false);

  const history = useHistory();
  const [totalLike, setTotalLike] = useState(0);

  const [likedVideos, setLikedVideos] = useState([]);
  const [postedVideos, setPostedVideos] = useState([]);
  const [postedHiddenVideos, setPostedHiddenVideos] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    let isCancelled = false;

    if (user) {
      const hostUser = doc(collection(db, "users"), user.id);

      onSnapshot(hostUser, (doc) => {
        if (!isCancelled) {
          setU({
            ...doc.data(),
            id: doc.id,
          });
        }
      });
    }

    return () => (isCancelled = true);
  }, []);

  // console.log(user);

  useEffect(() => {
    if (user !== null) {
      getLikedVideosByUser(user.id).then((res) => {
        setLikedVideos(res);

        // console.log("llllll", res);
      });
    }
    if (user !== null) {
      getPostedVideosByUser(user.id, 1).then((res) => {
        setPostedVideos(res);
        // console.log(res)
      });
    }
    if (user !== null) {
      getPostedVideosByUser(user.id, 0).then((res) => {
        setPostedHiddenVideos(res);
        // console.log(res)
      });
    }
    if (user !== null) {
      getTotalLikes(user.id).then((res) => {
        setTotalLike(res);
        console.log(res)
      });
    }
    return () => {
      setLikedVideos([]);
      setTotalLike(0);
      setPostedVideos([]);
      setPostedHiddenVideos([]);
    };
  }, []);

  const handleChangeTab = (pos) => {
    // console.log(pos);
    setTab(pos);
  };

  const handleProfileMenu = () => {
    localStorage.getItem(USER_KEY) && localStorage.setItem(USER_KEY, null);
    dispatch(getUser(null));


    // save account to list login account
    handleSaveLogin(user);
    
    setIsLogout(true);

    // history.push("/profile");
  };

  const handleSaveLogin = (user) =>{
    const usersLoggedIn = localStorage.getItem("saveLogin") ? JSON.parse(localStorage.getItem("saveLogin")) : [];

    const index = usersLoggedIn.findIndex(u => u.id === user.id);

    if(index==-1){
      usersLoggedIn.unshift({
        ...user,
        logOutTime: Date.now()
      });
      localStorage.setItem("saveLogin",JSON.stringify(usersLoggedIn.reverse()))
    }
    else{
      const cloneUser = usersLoggedIn[index];
      cloneUser.logOutTime = Date.now();
      usersLoggedIn.splice(index,1);
      usersLoggedIn.unshift(cloneUser);
      localStorage.setItem("saveLogin",JSON.stringify(usersLoggedIn.reverse()));
     
    }
  }

  async function handleUpdateProfile(value) {
    // console.log("value",value)
    if (value === true) {
      // console.log("ok")
      const userRef = await getDoc(doc(db, "users", user.id));

      const u = userRef.data();

      // setUser(u);
    }
  }
  const handleDisplayEdit = () => {
    setIsDisplayEditForm(true);
  };
  const handleHiddenForm = (value) => {
    setIsDisplayEditForm(value);
  };

  // console.log("object")

  // useEffect(()=>{

  //   getUserByID(user.id).then((res)=>{
  //     if(res){
  //       // if(res !== user){
  //         dispatch(getUser(res))
  //       // }
  //     }
  //   })

  //   return ()=>{
  //     setU(null);
  //   }

  // },[u]);

  // console.log("liked",likedVideos)
  // console.log("hidden",postedHiddenVideos)
  // console.log("post",postedVideos)

  return (
    <>
      <div className="profile">
        {!displayLogin && user && (
          <>
            <div className="profile__header">
              <i className="fas fa-user-plus"></i>
              {user !== null ? (
                <div className="profile__change--user">
                  {u ? u.name : user.name}
                  <span>
                    <i className="fas fa-sort-down"></i>
                  </span>
                </div>
              ) : (
                <div className="profile__change--user">Hồ sơ</div>
              )}
              <label htmlFor="profile__menu">
                <i className="fas fa-bars"></i>
              </label>
              <input id="profile__menu" type="checkbox" hidden />
              <div className="profile__header--menu">
                <label
                  htmlFor="profile__menu"
                  className="profile__header--menu--item"
                >
                  <div>Cài đặt </div>
                  <i className="fas fa-cog"></i>
                </label>
                <label
                  htmlFor="profile__menu"
                  className="profile__header--menu--item"
                >
                  <div>Ngôn ngữ </div>
                  <i className="fas fa-globe"></i>
                </label>
                <label
                  htmlFor="profile__menu"
                  className="profile__header--menu--item"
                >
                  <div onClick={handleProfileMenu}>Đăng xuất </div>
                  <i className="fas fa-sign-out-alt"></i>
                </label>
              </div>

              <label
                htmlFor="profile__menu"
                className="profile__header--layer"
              ></label>
            </div>
            <div className="profile__edit--main">
              <input id="edit__profilen" type="checkbox" hidden />
              {isDisplayEditForm && (
                <label
                  htmlFor="edit__profile"
                  className="profile__layer"
                  onClick={() => setIsDisplayEditForm(false)}
                ></label>
              )}

              {isDisplayEditForm && (
                <EditProfileForm
                  user={u ? u :user}
                  updateProfile={handleUpdateProfile}
                  displayEditForm={handleHiddenForm}
                />
              )}
            </div>
          </>
        )}
        {user ? (
          <div className="profile__root">
            <div className="profile__scroll">
              <div className="profile__main">
                <div className="profile__main--img">
                  <img src={u? u.avatar : user.avatar} alt="" />
                </div>
                <div className="profile__main--nickname">{u? u.nickName:user.nickName}</div>

                <div className="profile__main--info">
                  <div className="profile__main--info--following">
                    <span>{user !== null && user.following.length}</span>
                    <span>Đang follow</span>
                  </div>
                  <div className="profile__main--info--follower">
                    <span>{user !== null && user.followers.length}</span>
                    <span>Follower</span>
                  </div>
                  <div className="profile__main--info--like">
                    <span>{user !== null && totalLike}</span>
                    <span>Thích</span>
                  </div>
                </div>

                <div
                  className="profile__main--edit"
                  onClick={handleDisplayEdit}
                >
                  <label
                    htmlFor="edit__profile"
                    className="profile__main--edit--first"
                  >
                    Sửa hồ sơ
                  </label>
                  <div className="profile__main--edit--last">
                    <i className="fas fa-tag"></i>
                  </div>
                </div>

                <div className="profile__main--instruction">
                  Nhấn để thêm tiểu sử
                </div>
              </div>

              <div className="profile__videos">
                <div className="profile__videos--tabs">
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

                  <>
                    <div
                      className={
                        tab === 1
                          ? "profile__videos--tabs--liked active__videos"
                          : "profile__videos--tabs--liked"
                      }
                      onClick={() => handleChangeTab(1)}
                    >
                      <i className="fas fa-user-check"></i>
                    </div>
                    <div
                      className={
                        tab === 2
                          ? "profile__videos--tabs--private active__videos"
                          : "profile__videos--tabs--private"
                      }
                      onClick={() => handleChangeTab(2)}
                    >
                      <i className="fas fa-user-lock"></i>
                    </div>
                  </>
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
                {tab === 1 && (
                  <div className="profile__videos--me--scroll">
                    <div className="profile__videos--me">
                      {likedVideos.length > 0 &&
                        likedVideos.map((item, index) => {
                          return (
                            <ProfileVideoItem
                              video={item}
                              key={index}
                              type={tabValue[1]}
                              pos={index}
                            />
                          );
                        })}
                    </div>
                  </div>
                )}
                {tab === 2 && (
                  <div className="profile__videos--me--scroll">
                    <div className="profile__videos--me">
                      {postedHiddenVideos.length > 0 &&
                        postedHiddenVideos.map((item, index) => {
                          return (
                            <ProfileVideoItem
                              video={item}
                              key={index}
                              type={tabValue[2]}
                              pos={index}
                            />
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="signup">
              <i className="far fa-user"></i>
              <span>Đăng ký tài khoản</span>
              <label
                htmlFor="signup"
                className="signup__btn"
                onClick={() => setDisplayLogin(true)}
              >
                {" "}
                Đăng ký
              </label>
              <input type="checkbox" id="signup" hidden />
              <div className="login">
                <Accounts />
              </div>
            </div>
          </>
        )}
      </div>
      <NavigationBottom />
    </>
  );
}
