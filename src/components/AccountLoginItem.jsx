import React from 'react'
import { getTime } from '../utils/time'
import {getUser} from '../features/session/sessionSlice';
import md5 from 'md5';
import { useDispatch } from 'react-redux';
import USER_KEY from '../constants/key';
import { getAllAccount } from '../utils/database';
import { useHistory } from 'react-router';

export default function AccountLoginItem({user}) {

    const time = getTime(user.logOutTime);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogin = async () =>{
      const users = await getAllAccount().catch((e) => {
        console.log(e);
      });
  
      const index = users.findIndex((item) => {
        return item.username === user.username;
      });
      if (index === -1) { 
        alert("Tài khoản không tồn tại!");
      } else if (users[index].password === user.password) {

        localStorage.setItem(USER_KEY, users[index].id);
        dispatch(getUser(users[index]));
        
        history.push("/");
      } else {
        alert("Sai mật khẩu, vui lòng thử lại!");
      }
    }
    return (
        <div className="login__accounts--list--item" onClick={handleLogin}>
              <div className="login__accounts--list--item--img">
                <img
                  src={user.avatar}
                  alt=""
                />
              </div>
              <div className="login__accounts--list--item--name">
                <div>{user.name}</div>
                <div>Hoạt động vào {time}</div>
              </div>
              <div className="login__accounts--list--item--setting">
                <i className="fas fa-ellipsis-h"></i>
              </div>
        </div>
    )
}
