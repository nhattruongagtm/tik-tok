import React from "react";

export default function ProfileVideoItem() {
  return (
    <div className="profile__videos--item">
      <video
        className="profile__videos--item--video"
        src="https://v9.byteicdn.com/7f5ea587652a2c6c57b80ae1e32a9194/616ad9bc/video/tos/useast2a/tos-useast2a-pve-0037c001-aiso/04cab5318c4748c5836e587c91060fcb/?a=1180&br=800&bt=400&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=6&er=&ft=98ZmQeAl4kag3&l=2021101607550101025105818214D48759&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=M3B1PDw6Zjg5ODMzZjgzM0ApODU6Zjs2ZDw3N2k4Z2Q1PGczMmdjcjRnYmdgLS1kL2NzczRiNjYvLmNgMi0vLy4yNDU6Yw%3D%3D&vl=&vr="
        muted
        autoPlay
      ></video>
      <div className="profile__videos--item--views">
        <i className="fas fa-play"></i>
        <span>2.1M</span>
      </div>
      <div className="profile__videos--item--layer"></div>
    </div>
  );
}
