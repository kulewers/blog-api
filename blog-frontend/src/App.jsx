import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./components/Index";
import PostPage from "./components/PostPage";
import Navigation from "./components/Navigation";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route index element={<Index />} />
        <Route path="/posts">
          <Route index element={<Navigate replace to="/" />}></Route>
          <Route path=":postId" element={<PostPage />}></Route>
        </Route>
        <Route path="/not-found" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
