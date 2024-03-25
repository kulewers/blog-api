import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

export default function AuthorIndex() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(LoginContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/author/login");
    }
  }, [isLoggedIn]);

  return (
    <div>
      <h1>Hello, Author</h1>
      <Link to={`/author/posts`}>View Posts</Link>
    </div>
  );
}
