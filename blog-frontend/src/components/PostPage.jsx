import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

export default function PostPage() {
  const { postId } = useParams();
  const [url, setUrl] = useState(`http://localhost:3000/posts/${postId}`);
  const [post, loading, error] = useFetch(url);
  const [comments, commentLoading, commentError] = useFetch(url + "/comments");

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      navigate("/not-found", { replace: true });
    }
  }, [error]);

  return (
    <div>
      {post && (
        <div>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
          <p>{new Date(post.publishDate).toLocaleDateString()}</p>
        </div>
      )}
      {comments && (
        <div>
          <h3>Comments</h3>
          {comments.map((comment) => (
            <div>
              <p>{comment.body}</p>
              <p>{new Date(comment.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
