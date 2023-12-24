import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./components/Index";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Index />,
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
