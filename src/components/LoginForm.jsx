import React, { useState } from "react";
import { useHistory } from "react-router";
import { getAllAccount, login } from "../utils/database";
import md5 from "md5";

export default function LoginForm(props) {
  const history = useHistory();
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  async function handleLogin(e) {
    e.preventDefault();
    const username = input.username.toString().trim();
    const password = input.password.toString().trim();
    if (username === "") {
      alert("Vui lòng nhập email!");
    } else if (!username.endsWith("@gmail.com")) {
      alert("Vui lòng nhập đúng email!");
    } else if (password === "") {
      alert("Vui lòng nhập mật khẩu!");
    } else if (password.length < 8) {
      alert("Mật khẩu phải tối thiểu 8 kí tự!");
    } else {
      const users = await getAllAccount().catch((e) => {
        console.log(e);
      });
  
      const index = users.findIndex((item) => {
        return item.username === username;
      });
      if (index === -1) {
        alert("Tài khoản không tồn tại!");
      } else if (users[index].password === md5(password)) {
        localStorage.setItem("userTiktok", JSON.stringify(users[index]));
        history.push("/");
      } else {
        alert("Sai mật khẩu, vui lòng thử lại!");
      }
      // setTimeout(() => {
      //   history.push("/");
      // }, 500);
    }
  }
  const handleChangeInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };
  const handleResetInput = () => {
    setInput({
      username: "",
      password: "",
    });
  };
  return (
    <div className="login__api--form">
      <div className="login__api--form--item">
        <span>Email:</span>
        <input
          type="email"
          onChange={handleChangeInput}
          name="username"
          value={input.username}
        />
      </div>
      <div className="login__api--form--item">
        <span>Mật khẩu:</span>
        <input
          type="password"
          onChange={handleChangeInput}
          name="password"
          value={input.password}
        />
      </div>
      <div className="login__api--form--btn">
        <label
          htmlFor="login__popup"
          className="login__btn"
          onClick={handleResetInput}
        >
          <>Hủy</>
        </label>
        <div className="login__btn" onClick={handleLogin}>
          Đăng nhập
        </div>
      </div>
    </div>
  );
}
