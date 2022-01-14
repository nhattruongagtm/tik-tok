import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router";
import "./assets/css/style.css";  
import Intro from "./components/Intro";
import USER_KEY from "./constants/key";
import { getUser } from "./features/session/sessionSlice";
import HomePage from "./pages/HomePage/HomePage";
import Profile from "./pages/Profile.jsx/Profile";
import VideoProfile from "./pages/Profile.jsx/VideoProfile";
import RecordVideo from "./pages/Record/RecordVideo";
import { getUserByID } from "./utils/database";

function App() {
  const dispatch = useDispatch();
  const [intro, setIntro] = useState(true);
  const userID = localStorage.getItem(USER_KEY)
    ? localStorage.getItem(USER_KEY)
    : null;
  setTimeout(() => {
    setIntro(false);
  }, 3000);
  

  useEffect(()=>{

    if(userID!==null){
      getUserByID(userID).then((res)=>{
        if(res){
          dispatch(getUser(res));
        }
      }).catch((e)=>{
        console.log(e)
      })
    }
    
  },[]);

  return (
    <div className="app">
      <div className="app__screen">
        <Route>
          <Switch>
            {intro ? <Intro path="/" exact /> : <HomePage path="/" exact />}
          </Switch>
          <Switch>
            <Profile path="/profile" />
          </Switch>
          <Switch>
            <RecordVideo path="/record" />
          </Switch>
          <Switch>
            <VideoProfile path="/video-profile" />
          </Switch>
        </Route>
      </div>
    </div>
  );
}

export default App;
