import { Routes, Route, Navigate } from "react-router-dom";
import ViewIndex from "./components/view/ViewIndex";
import AuthorIndex from "./components/author/AuthorIndex";
import PostPage from "./components/PostPage";
import Navigation from "./components/Navigation";
import NotFound from "./components/NotFound";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter basename="/view">
        <Navigation />
        <Routes>
          <Route index element={<ViewIndex />} />
          <Route path="posts">
            <Route index element={<Navigate replace to="/view" />}></Route>
            <Route path=":postId" element={<PostPage />}></Route>
          </Route>
          <Route path="not-found" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <BrowserRouter basename="/author">
        <Routes>
          <Route index element={<AuthorIndex />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
