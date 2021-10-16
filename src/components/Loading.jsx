import React from "react";

export default function Loading() {
  return (
    <div className="loading">
      <lottie-player
        className="loading--main"
        src="https://assets7.lottiefiles.com/packages/lf20_pohgbacr.json"
        background="transparent"
        speed="1.5"
        loop
        autoplay
      ></lottie-player>
    </div>
  );
}
