import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import CommentSection from "./CommentSection";

export default function PostPage() {
  const { postId } = useParams();
  const url = `http://localhost:3000/posts/${postId}`;
  const { data: post, postFetchError } = useFetch(url, { authorize: true });
  const { data: comments } = useFetch(url + "/comments", { authorize: true });

  const navigate = useNavigate();

  useEffect(() => {
    if (postFetchError) {
      navigate("/author/not-found", { replace: true });
    }
  }, [postFetchError]);

  return (
    <div>
      {post && (
        <div>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
          <p>
            {post.publishDate &&
              "Published: " + new Date(post.publishDate).toLocaleDateString()}
          </p>
        </div>
      )}
      <CommentSection comments={comments} />
    </div>
  );
}
