import React from "react";
import { getTime } from "../utils/time";

export default function CommentReply({reply}) {
  return (
    <div className="profile__cmt--main--msg--rep--parent">
      <div className="profile__cmt--main--msg profile__cmt--main--rep">
        <div className="profile__cmt--main--msg--avatar msg--avatar--rep">
          <img
            src={reply.avatar}
            alt=""
          />
        </div>
        <div className="profile__cmt--main--msg--content msg--info--rep">
          <div className="msg--content--user">{reply.name}</div>
          <div className="msg--content--msg">
            {reply.content}
          </div>
          <div className="msg--content--date">
            <div className="msg--content--date--day">{getTime(reply.date)}</div>
            <div className="msg--content--date--rep">Trả lời</div>
          </div>
        </div>
        <div className="profile__cmt--main--msg--like msg--like--rep">
          <i className="far fa-heart"></i>
          <div>{reply.like}</div>
        </div>
      </div>
    </div>
  );
}
