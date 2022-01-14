import React from "react";

export default function CommentReply() {
  return (
    <div className="profile__cmt--main--msg--rep--parent">
      <div className="profile__cmt--main--msg profile__cmt--main--rep">
        <div className="profile__cmt--main--msg--avatar msg--avatar--rep">
          <img
            src="https://scr.vn/wp-content/uploads/2020/07/h%C3%ACnh-n%E1%BB%81n-cute-5.jpg"
            alt=""
          />
        </div>
        <div className="profile__cmt--main--msg--content msg--info--rep">
          <div className="msg--content--user">Nhật Trường</div>
          <div className="msg--content--msg">
            @nhattruongagtm nhìn giống m quá..
          </div>
          <div className="msg--content--date">
            <div className="msg--content--date--day">10-07</div>
            <div className="msg--content--date--rep">Trả lời</div>
          </div>
        </div>
        <div className="profile__cmt--main--msg--like msg--like--rep">
          <i className="far fa-heart"></i>
          <div>2</div>
        </div>
      </div>
    </div>
  );
}
