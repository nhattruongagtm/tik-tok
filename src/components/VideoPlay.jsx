import React from 'react'
import Slider from 'react-slick';
import Video from './Video';

export default function VideoPlay(props) {
    const {settings,position,videos} = props;
    return (
        <Slider className="videos" {...settings}>
        {videos.length > 0 &&
          videos.map((item, index) => {
            return (
              <Video
                video={item}
                index={index}
                key={index}
                pos={position === index ? true : false}
              />
            );
          })}
      </Slider>
    )
}
