import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./components/Index";
import PostPage from "./components/PostPage";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/posts/:postId",
      element: <PostPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <>
      <Router />
    </>
  );
}

export default App;
