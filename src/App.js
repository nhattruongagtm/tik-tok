import { useState } from "react";
import { Redirect, Route, Switch } from "react-router";
import "./assets/css/style.css";
import Loading from "./components/Loading";
import Intro from "./components/Intro";
import HomePage from "./pages/HomePage/HomePage";
import Profile from "./pages/Profile.jsx/Profile";
import RecordVideo from "./pages/Record/RecordVideo";
import VideoProfile from "./pages/Profile.jsx/VideoProfile";

function App() {
  const [intro, setIntro] = useState(true);
  const user = localStorage.getItem("userTiktok")
    ? JSON.parse(localStorage.getItem("userTiktok"))
    : null;
  setTimeout(() => {
    setIntro(false);
  }, 3000);

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
