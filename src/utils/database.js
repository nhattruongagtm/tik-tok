import { addDoc, collection, getDocs } from "@firebase/firestore";
import db from "../firebase/firebase";
import md5 from "md5";
import { useHistory } from "react-router";

// hiển thị danh sách tất cả users
export async function getAllAccount() {
  let users = [];
  const querySnapshot = await getDocs(collection(db, "users"));

  querySnapshot.forEach((doc) => {
    const userSnap = doc.data();

    const user = {
      username: userSnap.username,
      password: userSnap.password,
      avatar: userSnap.avatar,
      nickName: userSnap.nickName,
      name: userSnap.name,
      following: userSnap.following,
      followers: userSnap.followers,
      likes: userSnap.likes,
      bio: userSnap.bio,
    };

    users.push(user);
  });

  return users;
}
// kiểm tra username có tồn tại trước khi đăng ký
export async function checkSignUp(username) {
  const users = await getAllAccount();

  const index = users.findIndex((item) => {
    return item.username === username;
  });
  return index === -1 ? false : true;
}
// tiến hành đăng ký tài khoản mới
export async function signUp(username, password, name) {
  if ((await checkSignUp(username)) === true) {
    alert("Tên tài khoản đã tồn tại!");
  } else {
    try {
      const user = {
        username: username,
        password: md5(password),
        name: name,
        nickName: name,
        avatar: "",
      };
      const signUpRef = await addDoc(collection(db, "users"), user);
      return signUpRef.id;
    } catch (error) {
      console.error(error);
    }
  }
}
// tiến hành đăng nhập tài khoản
export async function login(username, password) {
  const users = await getAllAccount();
  users.map((item) => {
    if (item.username === username && item.password === md5(password)) {
      alert("Đăng nhập thành công!");
    } else if (item.username === username && item.password !== md5(password)) {
      alert("Sai mật khẩu! Vui lòng thử lại!");
    } else {
      alert("Tài khoản không tồn tại!");
    }
  });
}

export async function postVideo(post) {
  const newPost = {
    avatar: post.avatar,
    caption: post.caption,
    cmt: 0,
    nameSong: post.nameSong,
    like: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    share: 0,
    url: post.url,
    urlSong: post.urlSong,
    user: post.username,
  };
  try {
    console.log(newPost);
    const postRef = await addDoc(collection(db, "videos"), newPost);

    return postRef.id;
  } catch (e) {
    console.log(e);
    alert("Đã xảy ra lỗi, vui lòng thử lại!");
  }
}
