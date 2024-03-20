import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export default function PostPage() {
  const { postId } = useParams();
  const url = `http://localhost:3000/posts/${postId}`;
  const { data: post, error } = useFetch(url);
  const { data: comments } = useFetch(url + "/comments");

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
          <h3>Comments:</h3>
          {comments.length == 0 ? (
            <p>There are no comments on this post</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id}>
                <p>{comment.body}</p>
                <p>{new Date(comment.timestamp).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
