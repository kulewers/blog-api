import { useState, useEffect } from "react";
import { LoginContext } from "./context/LoginContext";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import ViewIndex from "./components/view/ViewIndex";
import ViewNavigation from "./components/view/ViewNavigation";

import AuthorIndex from "./components/author/AuthorIndex";
import AuthorNavigation from "./components/author/AuthorNavigation";
import Login from "./components/author/Login";
import Posts from "./components/author/Posts";

import PostPage from "./components/PostPage";
import NotFound from "./components/NotFound";

import Cookies from "js-cookie";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("Authorization");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Navigate replace to="/view" />} />
            <Route path="/view" element={<ViewNavigation />}>
              <Route index element={<ViewIndex />} />
              <Route path="posts">
                <Route index element={<Navigate replace to="/view" />} />
                <Route path=":postId" element={<PostPage />} />
              </Route>
              <Route path="not-found" element={<NotFound />} />
            </Route>
            <Route path="/author" element={<AuthorNavigation />}>
              <Route index element={<AuthorIndex />} />
              <Route path="posts">
                <Route index element={<Posts />} />
                <Route path=":postId" element={<PostPage />} />
              </Route>
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LoginContext.Provider>
    </>
  );
}

export default App;
