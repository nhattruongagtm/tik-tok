import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { storage } from "../firebase/firebase";
import {
  checkUserID,
  editProfile
} from "../utils/database";


export default function EditProfileForm({ user, updateProfile,displayEditForm,onUpdateUser }) {
  const [edit, setEdit] = useState({
    id: user.id,
    name: user.name,
    nickName: user.nickName,
    avatar: user.avatar,
    updated: 0,
  });
  const [blob,setBlob] = useState();
  const [isLayer,setIsLayer] = useState(false);
  const dispatch = useDispatch();

  console.log("u",user)

  // const [u, setU] = useState();

  const handleChangeAvatar = (e) =>{
    const file = e.target.files[0];

    const blob = URL.createObjectURL(file);

    const b = new Blob([file],{type: 'image/png'});

    setBlob(b);

    setEdit({
      ...edit,
      avatar: blob,
      updated: 1,
    })
  }

  // xoa blob khoi bo nhow
  useEffect(()=>{

    return ()=>{
      edit.avatar && URL.revokeObjectURL(edit.avatar);
    }
  },[edit.avatar])




  const handleChangeName = (e) => {
    setEdit({
      ...edit,
      name: e.target.value,
    });
  };
  const handleChangeID = (e) => {
    setEdit({
      ...edit,
      nickName: e.target.value,
    });
  };
  const handleEditProfile = (e) => {
    e.preventDefault();

    if (
      edit.name.toString().trim() === "" ||
      edit.nickName.toString().trim() === ""
    ) {
      alert("Vui lòng nhập đủ thông tin trước khi thay đổi!");
    } else if (user.nickName !== edit.nickName) {
      checkUserID(edit.nickName).then((res) => {
        if (res === true) {
          alert("ID đã tồn tại!, vui lòng nhập ID khác!");
        } else {
          editProfile(edit);
          updateProfile(true);
          displayEditForm(false);

  

        }
      });
    } else {
      setIsLayer(true);
      // uploadAvatar
      const store = ref(storage,`images/${user.id}/${user.id}-${Date.now()}`);

      uploadBytes(store,blob).then(()=>{

        getDownloadURL(ref(store)).then((url)=>{
          let newEdit = edit;

          newEdit.avatar = url;

          console.log(newEdit)
          
          editProfile(newEdit).then(()=>{

            updateProfile(true);
            
            displayEditForm(false);
            setIsLayer(false);
          }).catch((e)=>{
            console.log(e)
          });

        })
      })
    }
  };

  const handleHiddenEdit = (value) =>{
    displayEditForm(value);
  }
  return (
    <form className="profile__edit" onSubmit={handleEditProfile}>
      <div className="profile__edit--header">
        <div></div>
        <div>Sửa hồ sơ</div>
        <label htmlFor="edit__profile" onClick={()=>handleHiddenEdit(false)}>
          <div>
            <i className="fas fa-times"></i>
          </div>
        </label>
      </div>
      <div className="profile__edit--avatar">
        <img src={edit.avatar} alt="" />
        <input type="file" id="file" hidden onChange={handleChangeAvatar}/>
        <label htmlFor="file">Thay đổi ảnh</label>
      </div>
      <div className="profile__edit--avatar"></div>
      <div className="profile__edit--name">
        <div>Tên:</div>
        <div className="profile__edit--name--main">
          <div>
            <input type="text" value={edit.name} onChange={handleChangeName} />
          </div>
          <div>
            <i className="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>
      <div className="profile__edit--name profile__edit--id">
        <div>Tiktok ID:</div>
        <div className="profile__edit--name--main">
          <div>
            <input
              type="text"
              value={edit.nickName}
              onChange={handleChangeID}
            />
          </div>
          <div>
            <i className="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>
      <div className="profile__edit--btn">
        <label htmlFor="edit__profile" onClick={()=>handleHiddenEdit(false)}>
          <div>Hủy</div>
        </label>
        <button className="profile__edit--btn--y" type="submit">
          Đồng ý
        </button>
      </div>
      {isLayer && (
        <div className="profile__edit--layer">

      </div>
      )}
    </form>
  );
}
