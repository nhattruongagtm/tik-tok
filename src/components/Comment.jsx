import React, { useEffect, useState } from "react";
import { getUserByID } from "../utils/database";
import { getTime } from "../utils/time";
import { Skeleton } from "./CommentPanel";
import CommentReply from "./CommentReply";
import { doc, onSnapshot } from "@firebase/firestore";
import db from "../firebase/firebase";
export default function Comment(props) {
  let { cmt, onGetReply } = props;

  const [newDay, setNewDay] = useState("");

  const [user, setUser] = useState(null);
  const [like, setLike] = useState(cmt.like);
  const [isToggleLike, setIsToggleLike] = useState(false);
  const [replyList, setReplyList] = useState([]);
  const [seeMore,setSeeMore] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    getUserByID(cmt.user).then((res) => {
      if (!isCancelled) {
        setUser(res);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    setNewDay(getTime(cmt.date));
  }, []);

  useEffect(() => {
    const replyRef = doc(db, "reply", cmt.id);

    onSnapshot(replyRef, (doc) => {
      if (doc) {
        const replys = doc.data().rep;
        setReplyList(replys);
      }
    });
  }, []);

  const handleReply = () => {
    onGetReply(cmt);
  };
  const handleLikeCmt = () => {
    let number = like;
    let isLike = isToggleLike;
    !isLike ? (number += 1) : (number -= 1);
    setIsToggleLike(!isToggleLike);
    setLike(number);
  };

  console.log(replyList);

  return (
    <>
      {user ? (
        <>
        <div className="profile__cmt--main--msg">
          <div className="profile__cmt--main--msg--avatar">
            <img src={user.avatar} alt="" />
          </div>
          <div className="profile__cmt--main--msg--content">
            <div className="msg--content--user">
              {user.name} {cmt.isAuth && <i className="fas fa-circle"></i>}{" "}
              <span>{cmt.isAuth && "Tác giả"}</span>
            </div>

            <div className="msg--content--msg">{cmt.content}</div>
            <div className="msg--content--date">
              <div className="msg--content--date--day">{newDay}</div>
              <div className="msg--content--date--rep" onClick={handleReply}>
                Trả lời
              </div>
            </div>
            {
              (replyList && replyList.length > 0) && (
                <span className="reply__see__more" onClick={()=>setSeeMore(!seeMore)}>{seeMore ? 'Ẩn trả lời' : 'Xem thêm'}<i class={seeMore ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></span>
              )
            }
          </div>
          <div
            className="profile__cmt--main--msg--like"
            onClick={handleLikeCmt}
          >
            <i
              className={
                !isToggleLike ? "far fa-heart" : "fas fa-heart msg__like"
              }
            ></i>
            <div>{like}</div>
          </div>
        </div>
          
        </>
      ) : (
        <Skeleton />
      )}
      {(replyList && seeMore) &&
        replyList.map((reply) => <CommentReply reply={reply} key={reply.id} />)}
    </>
  );
}
