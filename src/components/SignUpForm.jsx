import React, { useState } from "react";
import { useHistory } from "react-router";
import { signUp } from "../utils/database";

export default function SignUpForm(props) {
  const history = useHistory();
  const [input, setInput] = useState({
    username: "",
    password: "",
    repassword: "",
    name: "",
  });
  const handleSignUp = (e) => {
    e.preventDefault();
    const username = input.username.toString().trim();
    const password = input.password.toString().trim();
    const repassword = input.repassword.toString().trim();
    const name = input.name.toString().trim();
    if (username === "") {
      alert("Vui lòng nhập email!");
    } else if (!username.endsWith("@gmail.com")) {
      alert("Vui lòng nhập đúng email!");
    } else if (password === "") {
      alert("Vui lòng nhập mật khẩu!");
    } else if (password.length < 8) {
      alert("Mật khẩu phải tối thiểu 8 kí tự!");
    } else if (repassword === "") {
      alert("Vui lòng xác nhận mật khẩu!");
    } else if (password !== repassword) {
      alert("Mật khẩu không khớp!");
    } else if (name === "") {
      alert("Vui lòng nhập tên hiển thị nhé!");
    } else {
      signUp(username, password, name).then((id) => {
        id && alert("Đăng ký tài khoản thành công!");
        setInput({
          username: "",
          password: "",
          repassword: "",
          name: "",
        });
        setTimeout(() => {
          history.push("/");
        }, 500);
      });

    }
  };
  const handleChangeInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="signup__api--form">
      <div className="sigup__api--form--item">
        <span>Email:</span>
        <input
          type="email"
          onChange={handleChangeInput}
          name="username"
          value={input.username}
        />
      </div>
      <div className="sigup__api--form--item">
        <span>Mật khẩu:</span>
        <input
          type="password"
          onChange={handleChangeInput}
          name="password"
          value={input.password}
        />
      </div>
      <div className="sigup__api--form--item">
        <span>Xác nhận mật khẩu:</span>
        <input
          type="password"
          onChange={handleChangeInput}
          name="repassword"
          value={input.repassword}
        />
      </div>
      <div className="sigup__api--form--item">
        <span>Tên hiển thị:</span>
        <input
          type="text"
          onChange={handleChangeInput}
          name="name"
          value={input.name}
        />
      </div>
      <div className="sigup__api--form--btn">
        <label
          htmlFor="signup__popup"
          className="signup__btn"
          onClick={() => props.toogleStatusBar(true)}
        >
          <>Hủy</>
        </label>
        <div className="signup__btn" onClick={handleSignUp}>
          Đăng ký
        </div>
      </div>
    </div>
  );
}
