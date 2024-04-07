import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

export default function Posts() {
  const url = "http://localhost:3000/posts";
  const { data: posts, error } = useFetch(url, { authorize: true });

  return (
    <div>
      <h1>Current Posts:</h1>
      {error && <h3>{error}</h3>}
      {posts && (
        <>
          <h3>Published:</h3>
          <ul>
            {posts
              .filter((post) => post.publishStatus === "published")
              .map((post) => {
                return (
                  <li key={post._id}>
                    <Link to={`/author/posts/${post._id}`}>{post.title}</Link>
                  </li>
                );
              })}
          </ul>
          <h3>Drafts:</h3>
          <ul>
            {posts
              .filter((post) => post.publishStatus === "draft")
              .map((post) => {
                return (
                  <li key={post._id}>
                    <Link to={`/author/posts/${post._id}`}>{post.title}</Link>
                  </li>
                );
              })}
          </ul>
        </>
      )}
    </div>
  );
}
