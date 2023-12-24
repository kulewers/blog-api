import { useEffect, useState } from "react";
import axios from "axios";

export default function Index() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const res = await axios.get("http://localhost:3000/posts");
      const posts = res.data.posts;
      console.log(posts);
      setPosts(posts);
    };
    getPosts();
  }, []);

  return (
    <>
      {posts &&
        posts.map(function (post) {
          return <li key={post._id}>{post.title}</li>;
        })}
    </>
  );
}
