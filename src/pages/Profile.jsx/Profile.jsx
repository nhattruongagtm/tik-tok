import { addDoc, collection, getDocs } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Accounts from "../../components/Accounts";
import NavigationBottom from "../../components/NavigationBottom";
import db from "../../firebase/firebase";
import { getLikedVideosByUser, getPostedVideosByUser } from "../../utils/database";
import ProfileVideoItem from "./ProfileVideoItem";

export default function Profile() {
  const [tab, setTab] = useState(0);
  const tabValue = ['posted','liked','hidden'];
  const [displayLogin, setDisplayLogin] = useState(false);
  const [user,setUser] = useState(()=>{
    if(localStorage.getItem("userTiktok")){
      return JSON.parse(localStorage.getItem("userTiktok"))
    }
    else{
      return null;
    }
  });
  const history = useHistory();
  const [isLogout,setIsLogout] = useState();
  const [likedVideos,setLikedVideos] = useState([]);
  const [postedVideos,setPostedVideos] = useState([]);
  const [postedHiddenVideos,setPostedHiddenVideos] = useState([]);

  useEffect(()=>{
    if(user !== null){
      getLikedVideosByUser(user.id).then(res=>{
        setLikedVideos(res);
        // console.log(res)
      })
    }
    if(user !== null){
      getPostedVideosByUser(user.nickName,1).then(res=>{
        setPostedVideos(res);
        // console.log(res)
      })
    }
    if(user !== null){
      getPostedVideosByUser(user.nickName,0).then(res=>{
        setPostedHiddenVideos(res);
        // console.log(res)
      })
    }

  },[]);


  useEffect(() => {

    const u = localStorage.getItem("userTiktok")
    ? JSON.parse(localStorage.getItem("userTiktok"))
    : null;

    setUser(u);
  }, [isLogout]);

  const handleChangeTab = (pos) => {
    console.log(pos);
    setTab(pos);
  };

  async function handleTestFirestore() {
    const data = {
      caption: "anh sẽ mãi chờ em....",
      url: "https://v9.byteicdn.com/0ecdc1bad1029d94a881ed4c445b9e70/616382be/video/tos/useast2a/tos-useast2a-pve-0037-aiso/f4d6b8c80965486dac967f916fe6a961/?a=1180&br=928&bt=464&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=3&ds=3&er=&ft=98ZmQeAl4kag3&l=202110101817520102450241580037C7CC&lr=tiktok&mime_type=video_mp4&net=0&pl=0&qs=0&rc=MzhmeTo6ZnVoNzMzZjgzM0ApODM2ZTc0PDxmNzs4Zjo8PGdmcHNncjRfcTFgLS1kL2Nzc2IuYzUyX2E1YWE1Y18xYDU6Yw%3D%3D&vl=&vr=",
      user: "@nhattruongagtmzxc",
      avatar:
        "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/200230552/original/dc6f1db9cefff7f1abda4b54970d6e413bac75f5/draw-a-social-media-avatar-website-profile-pic-custom-user-pic.jpg",
      like: 25,
      cmt: 10,
      share: 2,
      nameSong: "Chiều nay không có mưa bay...",
      urlSong: "chieunay.mp3",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      const docRef = addDoc(collection(db, "videos"), data);
      console.log("Document writen with id: " + (await docRef).id);
    } catch (error) {
      console.error(error);
    }
  }
  async function handleGetFireStore() {
    const querySnapshot = await getDocs(collection(db, "videos"));
    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
    }); 
  }

  const handleProfileMenu = () => {
    localStorage.getItem("userTiktok") && localStorage.setItem("userTiktok",null);
    history.push('/profile')
    setIsLogout(true);
  };

  console.log("l",likedVideos) 

  return (
    <>
      <div className="profile">
        {!displayLogin && user && (
          <div className="profile__header">
            <i className="fas fa-user-plus"></i>
            {user !== null ? (
              <div className="profile__change--user">
                {user.name}
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
              <label htmlFor="profile__menu" className="profile__header--menu--item" >
                <div>Cài đặt </div>
                <i className="fas fa-cog"></i>
              </label>
              <label htmlFor="profile__menu" className="profile__header--menu--item">
                <div>Ngôn ngữ </div>
                <i className="fas fa-globe"></i>
              </label>
              <label htmlFor="profile__menu" className="profile__header--menu--item">
                <div onClick={handleProfileMenu}>Đăng xuất </div>
                <i className="fas fa-sign-out-alt"></i>
              </label>
            </div>
            <label
              htmlFor="profile__menu"
              className="profile__header--layer"
            ></label>
          </div>
        )}
        {user !== null ? (
          <div className="profile__scroll">
            <div className="profile__main">
              <div className="profile__main--img">
                <img
                  src={user.avatar}
                  alt=""
                />
              </div>
              <div
                className="profile__main--nickname"
                onClick={handleTestFirestore}
              >
                {user.nickName}
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
                  <span>{user.likes}</span>
                  <span>Thích</span>
                </div>
              </div>
              <div className="profile__main--edit">
                <div
                  className="profile__main--edit--first"
                  onClick={handleGetFireStore}
                >
                  Sửa hồ sơ
                </div>
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
                  <i class="fas fa-user-edit"></i>
                </div>
                <div
                  className={
                    tab === 1
                      ? "profile__videos--tabs--liked active__videos"
                      : "profile__videos--tabs--liked"
                  }
                  onClick={() => handleChangeTab(1)}
                >
                  <i class="fas fa-user-check"></i>
                </div>
                <div
                  className={
                    tab === 2
                      ? "profile__videos--tabs--private active__videos"
                      : "profile__videos--tabs--private"
                  }
                  onClick={() => handleChangeTab(2)}
                >
                  <i class="fas fa-user-lock"></i>
                </div>
              </div>

              {tab === 0 && (
                <div className="profile__videos--me--scroll">
                  <div className="profile__videos--me">
                    {postedVideos.length > 0 && postedVideos.map((item,index)=>{
                      return <ProfileVideoItem video={item} key={index} type={tabValue[0]} pos={index}/>
                    })}
                   
                  </div>
                </div>
              )}
              {tab === 1 && (
                <div className="profile__videos--me--scroll">
                  <div className="profile__videos--me"> 
                  {likedVideos.length > 0 && likedVideos.map((item,index)=>{
                    return <ProfileVideoItem video={item} key={index} type={tabValue[1]} pos={index}/>
                  })}
                    
                  </div>
                </div>
              )}
              {tab === 2 && (
                <div className="profile__videos--me--scroll">
                  <div className="profile__videos--me">
                  {postedHiddenVideos.length > 0 && postedHiddenVideos.map((item,index)=>{
                      return <ProfileVideoItem video={item} key={index} type={tabValue[2]} pos={index}/>
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="signup">
              <i class="far fa-user"></i>
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
