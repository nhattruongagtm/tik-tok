import React, { useEffect, useRef, useState } from "react";

export default function ChooseAudioItem(props) {
    const audioRef = useRef(null);
    const [choose,setChoose] = useState(false);

    const {audio} = props;

    useEffect(()=>{
        if(props.index === props.pos){
            setChoose(true);
        }
        else{
            setChoose(false);
        }
    },[props.pos]);

    console.log(choose)

    const handleChooseAudio = () =>{
        
        props.sendIndex(props.index);
        
        if(props.index === props.pos){
            setChoose(true);
        }
        else{
            setChoose(false);
        }
        setChoose(!choose);

    }

    const handleSetAudio = () =>{
        props.setAudio({
            pos : props.pos,
            name: audio.name,
            url: audio.url,
        });
        setChoose(false);
    }

  return (
    <div className="audio__songs--scroll--item">
      <div className="audio__songs--item--img" onClick={handleChooseAudio}>
        <img src="https://i.ytimg.com/vi/1pquvJRgIMY/sddefault.jpg" alt="" />
      </div>
      <div className="audio__songs--item--info">
        <div className="songs--item--info--name">Ái Nộ (Remix)</div>
        <div className="songs--item--info--composer">Masew, Khôi Vũ</div>
        <div></div>
        <div className="songs--item--info--time">00:14</div>
      </div>
      <div className={choose ? "audio__songs--item--choose active__choose" : "audio__songs--item--choose hidden__choose"} onClick={handleSetAudio}>Chọn</div>
      {choose===true && <audio src={audio.url} ref={audioRef} autoPlay loop/>}
    </div>
  );
}
