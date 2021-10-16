import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import { useHistory } from "react-router";
import VideoRecorder from "react-video-recorder";
import ChooseAudioItem from "../../components/ChooseAudioItem";
import { postVideo } from "../../utils/database";

export default function RecordVideo() {
  const history = useHistory();
  const [playAudio, setPlayAudio] = useState(-1);
  const [displayAudio, setDisplayAudio] = useState(false);
  const [start, setStart] = useState(false);
  const [complete, setComplete] = useState(false);
  let [countdown, setCountdown] = useState(3);
  const [openVideo, setOpenVideo] = useState(false);
  const [displayOpen, setDisplayOpen] = useState(true);
  const [urlVideoInput, setUrlVideoInput] = useState(null);
  const [user,setUser] = useState(null);
  const [song, setSong] = useState({
    name: "Thêm âm thanh",
    url: null,
    pos: -1,
  });

  useEffect(()=>{
    const user = localStorage.getItem("userTiktok") ? JSON.parse(localStorage.getItem("userTiktok")) : null;
    setUser(user);

    setPost({
      ...post,
      username: user.nickName,
      avatar: user.avatar,
    })
  },[]);
  const [post, setPost] = useState({
    url: null,
    caption: "",
    username: "",
    avatar: "",
    urlSong: song.url,
    nameSong: song.name,
  });
  const [displayPost, setDisplayPost] = useState(false);

  const handleSendIndex = (index) => {
    setPlayAudio(index);
  };
  const handleDisplayAudio = () => {
    setDisplayAudio(!displayAudio);
  };
  const handlehiddenAudio = () => {
    setDisplayAudio(false);
  };
  const handleSetAudio = (data) => {
    setSong({
      name: data.name,
      url: data.url,
      pos: data.pos,
    });
    setPost({
      ...post,
      urlSong: data.url,
      nameSong: data.name,
    });
    setDisplayAudio(false);
  };

  const handleCountdown = () => {
    let c = countdown - 1;

    const a = setInterval(() => {
      setCountdown(c--);
    }, 1000);

    setTimeout(() => {
      clearInterval(a);
      setTimeout(() => {
        setCountdown(3);
      }, 1000);
    }, 3000);
  };

  const handleCaption = (e) => {
    const value = e.target.value;
    setPost({
      ...post,
      caption: value,
    });
  };

  const audios = [
    {
      name: "Ái Nộ (Remix)",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      singger: "",
      time: 14,
      urlImage: "https://i.ytimg.com/vi/1pquvJRgIMY/sddefault.jpg",
    },
    {
      name: "OK OK",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      singger: "",
      time: 14,
      urlImage: "https://i.ytimg.com/vi/1pquvJRgIMY/sddefault.jpg",
    },
    {
      name: "Thay tôi yêu..",
      url: "",
      singger: "",
      time: 14,
      urlImage: "https://i.ytimg.com/vi/1pquvJRgIMY/sddefault.jpg",
    },
    {
      name: "Cô đơn dành...",
      url: "",
      singger: "",
      time: 14,
      urlImage: "https://i.ytimg.com/vi/1pquvJRgIMY/sddefault.jpg",
    },
  ];

  const handlePostVideo = () => {
    postVideo(post).then((value) => {
      if (value) {
        alert("Đăng video thành công!");
        history.push("/");
      } else {
        alert("Đăng video thất bại!");
      }
    });
  };

  const handleOpenVideo = () => {
    setOpenVideo(true);
  };

  const handleChooseVideoInput = () => {
    setPost({
      ...post,
      url: urlVideoInput,
    });
    setDisplayPost(true);
  };

  return (
    <div className="record__main">
      {openVideo === true && (
        <VideoRecorder
          className="record__open"
          constraints={{
            audio: true,
            video: true,
          }}
          isOnInitially={true}
          useVideoInput={true}
          onRecordingComplete={(videoBlob) => {
            console.log(videoBlob)
            // Do something with the video...
            try {
              // const bloba = {
              //   size: 21825694,
              //   type: "",
              // };
              // let blobUrla = URL.createObjectURL(new B);
              // console.log("AAA: ", videoBlob);

              let blob = new Blob([videoBlob]);
              let blobUrl = URL.createObjectURL(blob);
              // console.log("url_open: ", blob);
              setComplete(true);

              var reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = function () {
                var base64data = reader.result;
                console.log("base64", base64data);

                setUrlVideoInput(base64data);
              };
            } catch (e) {
              console.error(e);
            }
          }}
          renderActions={() => {
            return (
              <>
                <div
                  className="choose__video--open"
                  onClick={handleChooseVideoInput}
                >
                  Chọn
                </div>
                <div
                  className="back__video--open"
                  onClick={() => setOpenVideo(false)}
                >
                  <i class="fas fa-arrow-left"></i>Quay về
                </div>
              </>
            );
          }}
        />
      )}
      <VideoRecorder
        className="record"
        constraints={{
          audio: true,
          video: {
            width: { exact: 320, ideal: 320 },
            height: { exact: 640, ideal: 640 },
            aspectRatio: { exact: 0.7500000001, ideal: 0.7500000001 },
            resizeMode: "crop-and-scale",
          },
        }}
        onStartRecording={() => {
          setDisplayOpen(false);
        }}
        countdownTime={3000}
        isOnInitially={true}
        isFlipped={false}
        timeLimit={15000}
        // useVideoInput={true}

        onRecordingComplete={(videoBlob) => {
          // Do something with the video...
          try {
            let blob = new Blob([videoBlob]);
            let blobUrl = URL.createObjectURL(blob);
            console.log("AAA: ", videoBlob);
            setComplete(true);
            // setPost({
            //   ...post,
            //   url: blobUrl,
            // });

            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
              var base64data = reader.result;

              console.log("base64", base64data);

              setPost({
                ...post,
                url: base64data,
              });
            };
          } catch (e) {
            console.error(e);
          }
        }}
        renderActions={({
          onStartRecording,
          onStopRecording,
          onStopReplaying,
          isReplayingVideo,
          isRunningCountdown,
        }) => {
          return (
            <>
              <div className="nav__record">
                {isReplayingVideo === false && (
                  <div
                    className="start__video"
                    onClick={() => {
                      onStartRecording();
                      handleCountdown();
                    }}
                  >
                    <div className="start__video--btn"></div>
                  </div>
                )}
                {isRunningCountdown === false && (
                  <div
                    className="cancel__video"
                    onClick={() => {
                      onStopReplaying();
                      setPost({ ...post, url: null });
                    }}
                  >
                    <i className="fas fa-window-close"></i>
                  </div>
                )}
                {isRunningCountdown === false && (
                  <div
                    className="choose__video"
                    onClick={() => {
                      onStopRecording();
                    }}
                  >
                    <i className="fas fa-check-circle"></i>
                  </div>
                )}
              </div>
              {isRunningCountdown === true && countdown > 0 && (
                <div className="countdown">{countdown}</div>
              )}

              <div className="back__video" onClick={() => history.push("/")}>
                <i className="fas fa-sign-out-alt"></i>
              </div>
              {post.url !== null && (
                <div
                  className="yes__video"
                  onClick={() => setDisplayPost(true)}
                >
                  Đồng ý
                </div>
              )}
              {displayOpen === true && (
                <div className="open__video" onClick={handleOpenVideo}>
                  <i className="fas fa-photo-video"></i>
                </div>
              )}
            </>
          );
        }}
      />
      <div className="add__audio" onClick={handleDisplayAudio}>
        <i className="fas fa-headphones-alt"></i>
        <span>{song.name}</span>
      </div>
      <div
        className={
          !displayAudio ? "hidden__record__audio" : "display__record__audio"
        }
      >
        <div className="record__audio__header">
          <div className="record__audio__header--item">
            <i className="fas fa-times" onClick={handlehiddenAudio}></i>
          </div>
          <div className="record__audio__header--item">
            <span>Âm thanh</span>
            <span>
              <i className="fas fa-sort-down"></i>
            </span>
          </div>
          <div className="record__audio__header--item"></div>
        </div>
        <div className="record__audio__search">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm" />
        </div>
        <div className="record__audio__carousel"></div>
        <div className="record__audio__tabs">
          <div className="record__audio__tabs--item tab__active">Khám phá</div>
          <div className="record__audio__tabs--item">Yêu thích</div>
        </div>
        <div className="record__audio__songs">
          <div className="record__audio__songs--header">
            <span>Dành cho bạn</span>
            <span>Xem tất cả</span>
          </div>
          <div className="record__audio__songs--scroll">
            <div className="audio__songs--scroll--main">
              {audios.map((item, index) => {
                return (
                  <ChooseAudioItem
                    key={index}
                    audio={item}
                    index={index}
                    sendIndex={handleSendIndex}
                    pos={playAudio}
                    setAudio={handleSetAudio}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {song.url !== null && <audio src={song.url} autoPlay loop />}
      {displayPost && (
        <div className="post">
          <div className="post__title">Đăng Video</div>
          <div className="post__label">Nhập tiêu đề:</div>
          <input value={post.caption} onChange={handleCaption} />
          <video className="post__video" autoPlay loop>
            <source type="video/webm" src={post.url}></source>
          </video>
          <div className="post__btn">
            <div
              className="post__btn--back"
              onClick={() => setDisplayPost(false)}
            >
              Quay về
            </div>
            <div className="post__btn--post" onClick={handlePostVideo}>
              Đăng
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
