import { addDoc, collection, getDocs, doc, getDoc, updateDoc, increment, arrayUnion, arrayRemove } from "@firebase/firestore";
import md5 from "md5";
import db from "../firebase/firebase";

// hiển thị danh sách tất cả users
export async function getAllAccount() {
  let users = [];
  const querySnapshot = await getDocs(collection(db, "users"));

  querySnapshot.forEach((doc) => {
    const userSnap = doc.data();

    const user = {
      id: doc.id,
      username: userSnap.username,
      password: userSnap.password,
      avatar: userSnap.avatar,
      nickName: userSnap.nickName,
      name: userSnap.name,
      following: userSnap.following,
      followers: userSnap.followers,
      likes: userSnap.likes,
      bio: userSnap.bio,
      likedVideos: userSnap.likedVideos,
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

export async function likeVideo(user,id) {
  const likeRef = doc(db, "videos", id);
  const userRef = doc(db, "users", user);

  await updateDoc(likeRef,{
    like: increment(1),
  })

  await updateDoc(userRef,{
    likedVideos: arrayUnion(id),
  })

  // JSON.stringify(localStorage.getItem('userTiktok'),user);

}
export async function unLikeVideo(user,id) {
  const userRef = doc(db, "users", user);
  const likeRef = doc(db, "videos", id);

  await updateDoc(likeRef,{
    like: increment(-1),
  })

  await updateDoc(userRef,{
    likedVideos: arrayRemove(id),
  })
}
export async function likeVideosNotUser(id) {
  const likeRef = doc(db, "videos", id);

  await updateDoc(likeRef,{
    like: increment(1),
  })

  // JSON.stringify(localStorage.getItem('userTiktok'),user);

}
export async function unLikeVideosNotUser(id) {
  const likeRef = doc(db, "videos", id);

  await updateDoc(likeRef,{
    like: increment(-1),
  })
}

export async function getUserByID(id){
  const userRef = await getDoc(doc(db,"users",id));
  const data = userRef.data();
  return data;
}

export async function getVideosByID(id){
  const videoRef = await getDoc(doc(db,"videos",id));
  const post = videoRef.data();
  const ids = videoRef.id;
  const newPost = {
    id: ids,
    avatar: post.avatar,
    caption: post.caption,
    cmt: post.cmt,
    nameSong: post.nameSong,
    like: post.like,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    share: post.share,
    url: post.url,
    urlSong: post.urlSong,
    user: post.username,
  };
  return newPost;
}

export async function getLikedVideosByUser(id){
  const videoRef = await getDoc(doc(db,"users",id));

  // get ids liked videos of user
  const videosID = videoRef.data().likedVideos;

  const videos = [];
  for(let i = 0; i < videosID.length;i++){
      videos.push(await getVideosByID(videosID[i]));
  }
  return videos;
}
export async function getPostedVideosByUser(user,stt){
  const videoRef = await getDocs(collection(db,"videos"));
  const videos = [];

  videoRef.forEach((doc)=>{
    const post = doc.data();
    const id = doc.id;
    if(post.user === user && post.status === stt){
      const newPost = {
        id: id,
        avatar: post.avatar,
        caption: post.caption,
        cmt: post.cmt,
        nameSong: post.nameSong,
        like: post.like,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        share: post.share,
        url: post.url,
        urlSong: post.urlSong,
        user: post.username,
      };
      videos.push(newPost);
    }
  }) 
 return videos;
}


