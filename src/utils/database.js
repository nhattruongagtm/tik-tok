import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import md5 from "md5";
import USER_KEY from "../constants/key";
import db, { storage } from "../firebase/firebase";

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
        avatar:
          "https://static.vecteezy.com/system/resources/previews/002/640/730/original/default-avatar-placeholder-profile-icon-male-vector.jpg",
        following: [],
        followers: [],
        likes: 0,
        bio: "",
        likedVideos: [],
      };
      // console.log(user);
      const signUpRef = await addDoc(collection(db, "users"), user);

      if (signUpRef.id) {
        localStorage.setItem(USER_KEY, signUpRef.id);
      }
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
      // alert("Đăng nhập thành công!");
      return true;
    } else if (item.username === username && item.password !== md5(password)) {
      alert("Sai mật khẩu! Vui lòng thử lại!");
      return false;
    } else {
      alert("Tài khoản không tồn tại!");
      return false;
    }
  });
  return false;
}
export async function getAllVideos() {
  const ref = await getDocs(collection(db, "videos"));

  let id = 0;
  ref.forEach(() => {
    id++;
  });

  return id;
}

export async function postVideo(post) {
  let id = 0;
  await getAllVideos().then((ID) => {
    id = ID + 1;
  });

  const url = `${post.username}/video${id}${Date.now()}.mp4`;

  const storeRef = ref(storage, url);

  uploadBytes(storeRef, post.url)
    .then((snapshot) => {
      // console.log(snapshot);

      getDownloadURL(ref(storeRef)).then((res) => {
        // console.log(res);

        const newPost = {
          avatar: post.avatar,
          caption: post.caption,
          cmt: 0,
          nameSong: post.nameSong,
          like: 0,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          share: 0,
          url: res,
          urlSong: post.urlSong,
          user: post.username,
          status: 1,
          userID: post.userID,
        };

        postHelper(newPost).then((res) => {
          // console.log(res);
          if (res) {
            createBlankComment(res).then(() => {
              // alert("Đăng video thành công!");
            });
          }
        });
      });
    })
    .catch((e) => {
      console.log("error", e);
    });
}

export async function postHelper(newPost) {
  try {
    const postRef = await addDoc(collection(db, "videos"), newPost);

    return postRef.id;
  } catch (e) {
    console.log(e);
    alert("Đã xảy ra lỗi, vui lòng thử lại!");
  }
}

export async function likeVideo(user, id) {
  const likeRef = doc(db, "videos", id);
  const userRef = doc(db, "users", user);

  await updateDoc(likeRef, {
    like: increment(1),
  });

  await updateDoc(userRef, {
    likedVideos: arrayUnion(id),
  });
}
export async function unLikeVideo(user, id) {
  const userRef = doc(db, "users", user);
  const likeRef = doc(db, "videos", id);

  await updateDoc(likeRef, {
    like: increment(-1),
  });

  await updateDoc(userRef, {
    likedVideos: arrayRemove(id),
  });
}
export async function likeVideosNotUser(id) {
  const likeRef = doc(db, "videos", id);

  await updateDoc(likeRef, {
    like: increment(1),
  });
}
export async function unLikeVideosNotUser(id) {
  const likeRef = doc(db, "videos", id);

  await updateDoc(likeRef, {
    like: increment(-1),
  });
}

export async function getUserByID(id) {
  if (!id) {
    return null;
  }
  const userRef = await getDoc(doc(db, "users", id));
  const ids = userRef.id;
  let user = userRef.data();
  user.id = ids;
  return user;
}

export async function getVideosByID(id) {
  const videoRef = await getDoc(doc(db, "videos", id));
  const post = videoRef.data();
  const ids = videoRef.id;
  let newPost;

  // console.log("id",id)
  // console.log("ids",ids)
  if (post) {
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
      user: post.user,
      userID: post.userID,
      status: 1,
    };
    return newPost;
  }
  return newPost;
}

export async function getLikedVideosByUser(id) {
  const videos = [];
  try {
    const videoRef = await getDoc(doc(db, "users", id));

    // get ids liked videos of user
    const videosID = videoRef.data().likedVideos;

    for (let i = 0; i < videosID.length; i++) {
      (await getVideosByID(videosID[i])) &&
        videos.push(await getVideosByID(videosID[i]));
    }
    // console.log("likes", videos);
    return videos;
  } catch (e) {
    console.log(e);
  }
  return videos;
}
export async function getPostedVideosByUser(ids, stt) {
  const videoRef = await getDocs(collection(db, "videos"));
  const videos = [];

  videoRef.forEach((doc) => {
    const post = doc.data();
    if (post.userID === ids && post.status === stt) {
      const newPost = {
        id: doc.id,
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
        user: post.user,
        userID: post.userID,
      };
      videos.push(newPost);
    }
  });
  // console.log("pppo", videos);
  return videos;
}

export async function getTotalLikes(id) {
  const videos = await getPostedVideosByUser(id, 0 || 1);

  let totalLikes = 0;

  videos.forEach((item) => {
    totalLikes += item.like;
  });
  return totalLikes;
}

export async function getProfileByNickName(nickName) {
  const userRef = await getDocs(collection(db, "users"));
  let user = undefined;
  userRef.forEach((doc) => {
    const item = doc.data();
    if (item.nickName === nickName) {
      user = item;
      user.id = doc.id;
      // console.log("item", item);
      return user;
    } else {
      console.log("nooooo");
    }
  });
  return user;
}

export async function follow(uid, pid) {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    following: arrayUnion(pid),
  });
  const partnerRef = doc(db, "users", pid);

  await updateDoc(partnerRef, {
    followers: arrayUnion(uid),
  });
}
export async function unfollow(uid, pid) {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    following: arrayRemove(pid),
  });
  const partnerRef = doc(db, "users", pid);

  await updateDoc(partnerRef, {
    followers: arrayRemove(uid),
  });
}

// *********************************** commnents **********************************

export async function commentVideos(c) {
  const comment = {
    user: c.user,
    content: c.msg,
    date: Date.now(),
    like: c.like,
    id: c.id,
    videoID: c.videoID,
    name: c.name,
    avatar: c.avatar,
    isAuth: c.isAuth,
    rep: [],
  };
  // try {
  //   await setDoc(doc(db, "comments", videoID), comment,{merge:true});

  // } catch (e) {
  //   console.log(e);
  // }

  try {
    const commentRef = await doc(db, "comments", c.videoID);

    updateDoc(commentRef, {
      rep: arrayUnion(comment),
    });
    await createBlankReply(comment.id);
  } catch (error) {
    console.log(error);
  }
}
export async function createBlankComment(id) {
  // console.log(id);
  const rep = {
    rep: [],
  };

  try {
    await setDoc(doc(db, "comments", id), rep);
  } catch (error) {
    console.log(error);
  }
}
export async function createBlankReply(id) {
  // console.log(id);
  const rep = {
    rep: [],
  };

  try {
    await setDoc(doc(db, "reply", id), rep);
  } catch (error) {
    console.log(error);
  }
}

export async function getMessageByVideos(videoID) {
  const commentRef = await getDoc(doc(db, "comments", videoID));
  const comments = commentRef.data().rep && commentRef.data().rep;

  return comments;
}


export async function checkUserID(id) {
  const userRef = await getDocs(collection(db, "users"));

  let rs = false;
  userRef.forEach((doc) => {
    const data = doc.data();

    if (data.nickName === id) {
      rs = true;
    }
  });

  return rs;
}

export async function editProfile(edit) {
  const userRef = await doc(db, "users", edit.id);
  if (edit.updated === 0) {
    updateDoc(userRef, {
      name: edit.name,
      nickName: edit.nickName,
    });
  } else {
    updateDoc(userRef, {
      name: edit.name,
      nickName: edit.nickName,
      avatar: edit.avatar,
    });
  }
  alert("Thay đổi thông tin thành công!");
}
