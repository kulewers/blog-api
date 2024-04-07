import { Link } from "react-router-dom";

export default function AuthorIndex() {
  return (
    <div>
      <h1>Hello, Author</h1>
      <ul>
        <li>
          <Link to={`/author/posts`}>View posts</Link>
        </li>
        <li>
          <Link to={`/author/create`}>Create post</Link>
        </li>
      </ul>
    </div>
  );
}
