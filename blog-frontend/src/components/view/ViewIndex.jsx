import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

const url = "http://localhost:3000/posts";

export default function Index() {
  const { data: posts, error } = useFetch(url);

  return (
    <div>
      <h1>Welcome to my blog!</h1>
      {error && <h3>{error}</h3>}
      {posts && (
        <div>
          <h3>Current posts:</h3>
          <ul>
            {posts.map((post) => {
              return (
                <li key={post._id}>
                  <Link to={`posts/${post._id}`}>{post.title}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
