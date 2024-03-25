import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const url = "http://localhost:3000/posts";

export default function Posts() {
  const { data: posts, error } = useFetch(url);

  return (
    <div>
      {error && <h3>{error}</h3>}
      {posts && (
        <ul>
          {posts.map((post) => {
            return (
              <li key={post._id}>
                <Link to={`/author/posts/${post._id}`}>{post.title}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
