import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./auth/authProvider";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";

function App() {
  const [authed, setAuthed] = useState(false);
  const user = localStorage.getItem("userMoniToken");

  return (
    <main>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          exact
          path="/"
          element={<PrivateRoute auth={user ? true : false} />}
        >
          <Route exact path="/home" element={<Home />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
