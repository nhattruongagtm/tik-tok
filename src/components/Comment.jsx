import React, { useEffect, useState } from "react";
import { getUserByID } from "../utils/database";
import { getTime } from "../utils/time";
import {Skeleton} from './CommentPanel'
import CommentReply from './CommentReply'  
export default function Comment(props) {
  let { cmt, onGetReply } = props;

  const [newDay, setNewDay] = useState("");

  const [user, setUser] = useState(null);
  const [like,setLike] = useState(cmt.like);
  const [isToggleLike,setIsToggleLike] = useState(false);

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

  const handleReply = () =>{
    onGetReply(cmt)
  }
  const handleLikeCmt = () =>{  
    let number = like;
    let isLike = isToggleLike;
    !isLike ? number+=1 : number-=1;
    setIsToggleLike(!isToggleLike)
    setLike(number);
  }

  return (
    <>
      {user ? (
        <div className="profile__cmt--main--msg">
          <div className="profile__cmt--main--msg--avatar">
            <img src={user.avatar} alt="" />
          </div>
          <div className="profile__cmt--main--msg--content">
            <div className="msg--content--user">
              {user.name}{" "}
              {cmt.isAuth && <i className="fas fa-circle"></i>}{" "}
              <span>{cmt.isAuth && "Tác giả"}</span>
            </div>

            <div className="msg--content--msg">{cmt.content}</div>
            <div className="msg--content--date">
              <div className="msg--content--date--day">{newDay}</div>
              <div className="msg--content--date--rep" onClick={handleReply}>Trả lời</div>
            </div>
          </div>
          <div className="profile__cmt--main--msg--like" onClick={handleLikeCmt}>
          <i className={!isToggleLike ? 'far fa-heart' : 'fas fa-heart msg__like'}></i>
            <div>{like}</div>
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
      {/* {Array.from(new Array(1)).map(()=>{
        return <CommentReply/>
    })} */}
    </>
  );
}
