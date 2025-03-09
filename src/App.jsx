import React, { useContext } from "react";
import SignLog from "./components/Authentication/SignLog";
import { BrowserRouter } from "react-router-dom";
import Profile from "./pages/Profile/Profile";
import { context } from "./context/UserContext";

export default function App() {
  const { loggedIn } = useContext(context);
  if (!loggedIn) {
    return (
      <div>
        <BrowserRouter>
          <SignLog />
        </BrowserRouter>
      </div>
    );
  }
  return (
    <div>
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    </div>
  );
}
