import { useState, useEffect } from "react";
import { LoginContext } from "./context/LoginContext";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Navigation from "./components/Navigation";
import ViewIndex from "./components/view/ViewIndex";
import PostPage from "./components/PostPage";
import NotFound from "./components/NotFound";
import AuthorIndex from "./components/author/AuthorIndex";
import Login from "./components/author/Login";
import Cookies from "js-cookie";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("Authentication");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route index element={<Navigate replace to="/view" />} />
            <Route path="/view">
              <Route index element={<ViewIndex />} />
              <Route path="posts">
                <Route index element={<Navigate replace to="/view" />} />
                <Route path=":postId" element={<PostPage />} />
              </Route>
              <Route path="not-found" element={<NotFound />} />
            </Route>
            <Route path="/author">
              <Route index element={<AuthorIndex />} />
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LoginContext.Provider>
    </>
  );
}

export default App;
