import { doc, onSnapshot } from "@firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import db from "../firebase/firebase";
import {
  commentVideos,
  getMessageByVideos,
  getMessageByVideos2,
} from "../utils/database";
import Comment from "./Comment";

export const Skeleton = () => {
  return (
    <div className="profile__cmt--main--msg cmt__loading">
      <div className="profile__cmt--main--msg--avatar cmt__avatar__loading">
        <div></div>
      </div>
      <div className="profile__cmt--main--msg--content cmt__content__loading">
        <div className="msg--content--user"></div>

        <div className="msg--content--msg"></div>
        <div className="msg--content--date">
          <div className="msg--content--date--day"></div>
          <div className="msg--content--date--rep"></div>
        </div>
      </div>
      <div className="profile__cmt--main--msg--like cmt__like__loading">
        <i className=""></i>
        <p></p>
      </div>
    </div>
  );
};

export default function CommentPanel(props) {
  const { user, video, commentCount } = props;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState();
  const [cmtCount, setCmtCount] = useState(commentCount);
  const [commentsSkeleton, setCommentSkeleton] = useState(0);
  const cmtRef = useRef();
  const [isReply, setIsReply] = useState(false);
  useEffect(() => {
    let isCancel = false;
    const getComments = async () => {
      try {
        const cmtRef = await doc(db, "comments", video.id);
        onSnapshot(cmtRef, (doc) => {
          if (doc) {
            const cmts = doc.data().rep;
            setCommentSkeleton(cmts.length);
            setTimeout(() => {
              setComments(cmts);
            }, 300);
          }
        });
      } catch (e) {
        alert("Đã xảy ra lỗi, vui lòng thử lại!");
      }
    };
    if(!isCancel){
      getComments();
    }
    return () => isCancel = true;
  }, []);

  const handleChangeComment = (e) => {
    const msg = e.target.value;
    setComment(msg);
  };

  async function handleComment() {
    if (comment.trim() !== "") {
      // comments not reply
      if (!isReply) {
        if (user != null) {
          const obj = {
            id: `${user.id}-${Date.now()}`,
            user: user.id,
            name: user.name,
            videoID: video.id,
            msg: comment,
            like: 0,
            avatar: user.avatar,
            isAuth: user.nickName === video.user ? true : false,
          };
          try {
            await commentVideos(obj);
            setCmtCount(cmtCount + 1);
          } catch (e) {
            alert("Đã xảy ra lỗi, vui lòng thử lại!");
          }
          // props.updateComment(true);
        } else {
          alert("Vui lòng đăng nhập!");
        }
      }
      // is reply comments
      else{
        console.log("reply")
      }
      setComment("");
    }
  }
  const handleDisplayComment = () => {
    props.isDisplayComment(false);
  };
  const handleGetReply = (cmt) => {
    console.log(cmt);
    setComment(cmt.name + " ");
    cmtRef.current.focus();
    setIsReply(true);
  };

  return (
    <>
      {/* <input type="checkbox" hidden id="cmts" /> */}
      <div className="profile__cmt" id="profile__cmt">
        <div className="profile__cmt--header">
          <div></div>
          <div>Bình luận ({cmtCount})</div>
          <label htmlFor="cmts" onClick={handleDisplayComment}>
            <i className="fas fa-times"></i>
          </label>
        </div>
        <div className="profile__cmt--main">
          <div className="profile__cmt--main--end">
            <div className="profile__cmt--main--msg--parent">
              {comments
                ? comments.map((item, index) => {
                    return (
                      <Comment
                        key={index}
                        cmt={item}
                        onGetReply={handleGetReply}
                      />
                    );
                  })
                : Array.from(new Array(commentsSkeleton)).map((item, index) => {
                    return <Skeleton key={index} />;
                  })}
            </div>
          </div>
        </div>

        <div className="profile__cmt--footer">
          <div className="profile__cmt--footer--icon">
            <i className="fas fa-smile-wink"></i>
          </div>

          <div className="profile__cmt--footer--input">
            <input
              type="text"
              placeholder="Thêm bình luận..."
              value={comment}
              onChange={handleChangeComment}
              ref={cmtRef}
            />
          </div>
          <div className="profile__cmt--footer--send" onClick={handleComment}>
            <i className="fas fa-paper-plane"></i>
          </div>
        </div>
      </div>
    </>
  );
}
