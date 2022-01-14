import React, { useEffect, useState } from "react";
import AccountLoginItem from "./AccountLoginItem";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

export default function Accounts() {
  const [statusAuth, setStatusAuth] = useState(0);
  const [statusBar, setStatusBar] = useState(true);
  const accountsLoggedIn = localStorage.getItem("saveLogin") ? JSON.parse(localStorage.getItem("saveLogin")) : [];


  const handleChangeStatusAuth = (value) => {
    switch (Number.parseInt(value)) {
      case 0:
        setStatusAuth(0);
        break;
      case 1:
        setStatusAuth(1);
        break;
      case 2:
        setStatusAuth(2);
        break;
    }
  };

  const handleToogleStatusBar = () => {
    setStatusBar(true);
  };

  return (
    <>
      <div className="login__header">
        <label htmlFor="signup">
          <i className="fas fa-times"></i>
        </label>
        <i className="far fa-question-circle"></i>
      </div>
      <div className="login__accounts">
        <div className="login__accounts--title">Chọn tài khoản</div>
        <div className="login__accounts--list--parent">
          <div className="login__accounts--list">
            <label
              htmlFor="login__api"
              className="login__accounts--list--item default"
              onClick={() => handleChangeStatusAuth(1)}
            >
              <i className="fas fa-plus"></i>
              <div>Thêm tài khoản hiện có</div>
            </label>
            {
              accountsLoggedIn && accountsLoggedIn.map((item,index)=>{
                return (
                  <AccountLoginItem key={index} user={item}/>
                )
              })
              
            }
          </div>
        </div>
        {statusBar === true && (
          <div className="login__accounts--footer">
            <span>
              {statusAuth === 1 || statusAuth === 0
                ? "Bạn chưa có tài khoản?"
                : "Bạn đã có tài khoản?"}
            </span>
            <label
              htmlFor={statusAuth === 1 ? "login__api" : "signup__api"}
              onClick={() =>
                handleChangeStatusAuth(
                  `${statusAuth === 1 || statusAuth === 0 ? 2 : 1}`
                )
              }
            >
              <span>
                {statusAuth === 1 || statusAuth === 0 ? "Đăng ký" : "Đăng nhập"}
              </span>
            </label>
          </div>
        )}
      </div>
      <input
        type="checkbox"
        id="login__api"
        hidden
        onChange={()=>true}
        checked={statusAuth === 1 ? true : false}
      />
      <div className="login__api">
        <div className="login__header">
          <label htmlFor="login__api" onClick={() => handleChangeStatusAuth(0)}>
            <i class="fas fa-times"></i>
          </label>

          <i class="far fa-question-circle"></i>
        </div>
        <div className="login__api--title">Đăng nhập vào Tik tok</div>
        <div className="login__api--cap">
          Quản lý tài khoản, kiểm tra thông báo, bình luận trên các video, v.v.
        </div>
        <div className="login__api--list">
          <div className="login__api--list--item">
            <div className="login__api--list--item--icon">
              <i class="far fa-user"></i>
            </div>
            <label htmlFor="login__popup">
              <div className="login__api--list--item--name">
                Số điện thoại / Email / Tiktok ID
              </div>
            </label>
            <div className="login__api--list--item--blank"></div>
          </div>
          <div className="login__api--list--item">
            <div className="login__api--list--item--icon">
              <i class="far fa-user"></i>
            </div>
            <div className="login__api--list--item--name">
              Tiếp tục với Facebook
            </div>
            <div className="login__api--list--item--blank"></div>
          </div>
          <div className="login__api--list--item">
            <div className="login__api--list--item--icon">
              <i class="far fa-user"></i>
            </div>
            <div className="login__api--list--item--name">
              Tiếp tục với Google
            </div>
            <div className="login__api--list--item--blank"></div>
          </div>
          <div className="login__api--list--item">
            <div className="login__api--list--item--icon">
              <i class="far fa-user"></i>
            </div>
            <div className="login__api--list--item--name">
              Tiếp tục với Instagram
            </div>
            <div className="login__api--list--item--blank"></div>
          </div>
          <div className="login__api--list--item">
            <div className="login__api--list--item--icon">
              <i class="far fa-user"></i>
            </div>
            <div className="login__api--list--item--name">
              Tiếp tục với Twitter
            </div>
            <div className="login__api--list--item--blank"></div>
          </div>
          <div className="login__api--list--item">
            <div className="login__api--list--item--icon">
              <i class="far fa-user"></i>
            </div>
            <div className="login__api--list--item--name">
              Tiếp tục với Line
            </div>
            <div className="login__api--list--item--blank"></div>
          </div>
        </div>
      </div>
      <input type="checkbox" id="login__popup" hidden onChange={()=> true} />
      <LoginForm />
      <label
        htmlFor="login__popup"
        className="login__layer"
        // onClick={() => setStatusBar(true)}
      ></label>
      <input
        type="checkbox"
        id="signup__api"
        hidden
        onChange={()=>true}
        checked={statusAuth === 2 ? true : false}
      />
      <div className="signup__api">
        <div className="login__header">
          <label
            htmlFor="signup__api"
            onClick={() => handleChangeStatusAuth(0)}
          >
            <i class="fas fa-times"></i>
          </label>

          <i class="far fa-question-circle"></i>
        </div>
        <div className="login__api--title">Đăng ký tài khoản Tik tok</div>
        <div className="login__api--cap">
          Quản lý tài khoản, kiểm tra thông báo, bình luận trên các video, v.v.
        </div>
        <div className="login__api--list">
          <label htmlFor="signup__popup">
            <div className="login__api--list--item">
              <div className="login__api--list--item--icon">
                <i class="far fa-user"></i>
              </div>
              <div
                className="login__api--list--item--name"
                onClick={() => setStatusBar(false)}
              >
                Số điện thoại / Email / Tiktok ID
              </div>

              <div className="login__api--list--item--blank"></div>
            </div>
          </label>
          <div className="login__api--list--item">
            <div className="login__api--list--item--icon">
              <i class="far fa-user"></i>
            </div>
            <div className="login__api--list--item--name">
              Tiếp tục với Facebook
            </div>
            <div className="login__api--list--item--blank"></div>
          </div>
          <div className="login__api--list--item">
            <div className="login__api--list--item--icon">
              <i class="far fa-user"></i>
            </div>
            <div className="login__api--list--item--name">
              Tiếp tục với Google
            </div>
            <div className="login__api--list--item--blank"></div>
          </div>
          <div className="login__api--list--item">
            <div className="login__api--list--item--icon">
              <i class="far fa-user"></i>
            </div>
            <div className="login__api--list--item--name">
              Tiếp tục với Instagram
            </div>
            <div className="login__api--list--item--blank"></div>
          </div>
        </div>
      </div>
      <input type="checkbox" id="signup__popup" hidden onChange={()=>true} />
      <SignUpForm toogleStatusBar={handleToogleStatusBar}/>
      <label
        htmlFor="signup__popup"
        className="signup__layer"
        onClick={() => setStatusBar(true)}
      ></label>
    </>
  );
}
