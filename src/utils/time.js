export const getTime = (time) => {
  const date = new Date(time).toLocaleDateString();
  let newDate = '';

  const second = Math.floor(
    (Number.parseInt(Date.now()) - Number.parseInt(time)) / 1000
  );

  if(second<60){
    newDate = `${second} giây trước`;
    return newDate;
  }
  else if(second >=60){
    const minute = Math.floor(second/60);
    
    if(minute < 60){
      newDate = `${minute} phút trước`;
      return newDate;
    }
    else if (minute >= 60){
      const hour = Math.floor(minute/60);
      
      if(hour < 24){
        newDate = `${hour} giờ trước`;
        return newDate;
      }
      else if(hour >= 24){
        const day = Math.floor(hour/24);
        
        if(day < 3){
          newDate = `${day} ngày trước`;
          return newDate;
        }
        else{
          const convertDate = date.substr(0,date.lastIndexOf('/')).replace("/","-");
          newDate = convertDate;
          return newDate;
        }
      }
    }
  }






};
