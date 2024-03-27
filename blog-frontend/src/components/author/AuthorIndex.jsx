import { Link } from "react-router-dom";

export default function AuthorIndex() {
  return (
    <div>
      <h1>Hello, Author</h1>
      <Link to={`/author/posts`}>View Posts</Link>
    </div>
  );
}
