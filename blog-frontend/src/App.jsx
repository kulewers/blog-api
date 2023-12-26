import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./components/Index";
import PostPage from "./components/PostPage";
import Navigation from "./components/Navigation";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route index element={<Index />} />
        <Route path="/posts">
          <Route index element={<Navigate to="/" />}></Route>
          <Route path=":postId" element={<PostPage />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
