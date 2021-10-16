import React from "react";
import { NavLink } from "react-router-dom";

export default function NavigationBottom() {
  return (
    <div className="nav__bottom">
      <div className="nav__bottom--items">
        <div className="nav__bottom--item">
          <NavLink className="none-link" to="/">
            <i className="fas fa-home"></i>
            <div className="item--title">Trang chủ</div>
          </NavLink>
        </div>
        <div className="nav__bottom--item">
          <i className="fas fa-search"></i>
          <div className="item--title">Khám phá</div>
        </div>
        <div className="nav__bottom--item item--plus">
          <NavLink to="/record" className="none-link">
            <div className="item--plus--cyan"></div>
            <i className="fas fa-plus-square"></i>
            <div className="item--plus--red"></div>
          </NavLink>
        </div>
        <div className="nav__bottom--item">
          <i className="far fa-comment"></i>
          <div className="item--title">Hộp thư</div>
        </div>
        <div className="nav__bottom--item">
          <NavLink className="none-link" to="/profile">
            <i className="far fa-user"></i>
            <div className="item--title">Hồ sơ</div>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
