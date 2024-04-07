import { useState } from "react";
import { LoginContext } from "./context/LoginContext";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import ViewIndex from "./components/view/ViewIndex";
import ViewNavigation from "./components/view/ViewNavigation";

import AuthorIndex from "./components/author/AuthorIndex";
import AuthorNavigation from "./components/author/AuthorNavigation";
import Login from "./components/author/Login";
import Posts from "./components/author/Posts";

import { default as AuthorPostPage } from "./components/author/PostPage";
import { default as ViewPostPage } from "./components/view/PostPage";
import { default as AuthorNotFound } from "./components/author/NotFound";
import { default as ViewNotFound } from "./components/view/NotFound";
import ProtectedRoute from "./components/author/ProtectedRoute";
import Create from "./components/author/Create";

function App() {
  const [userToken, setUserToken] = useState(null);

  return (
    <>
      <LoginContext.Provider value={{ userToken, setUserToken }}>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Navigate replace to="/view" />} />
            <Route path="/view" element={<ViewNavigation />}>
              <Route index element={<ViewIndex />} />
              <Route path="posts">
                <Route index element={<Navigate replace to="/view" />} />
                <Route path=":postId" element={<ViewPostPage />} />
              </Route>
              <Route path="not-found" element={<ViewNotFound />} />
            </Route>
            <Route path="/author" element={<AuthorNavigation />}>
              <Route element={<ProtectedRoute />}>
                <Route index element={<AuthorIndex />} />
                <Route path="posts">
                  <Route index element={<Posts />} />
                  <Route path=":postId" element={<AuthorPostPage />} />
                </Route>
                <Route path="create" element={<Create />} />
              </Route>
              <Route path="not-found" element={<AuthorNotFound />} />
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LoginContext.Provider>
    </>
  );
}

export default App;
