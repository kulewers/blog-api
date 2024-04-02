import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

export default function Posts() {
  const url = "http://localhost:3000/posts";
  const { data: posts, error } = useFetch(url, { authorize: true });

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
