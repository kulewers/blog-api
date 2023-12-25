import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

export default function PostPage() {
    const { postId } = useParams();
    const [post, setPost] = useState();

    useEffect(() => {
        const getPost = async () => {
            const res = await axios.get(
                `http://localhost:3000/posts/${postId}`
            );
            const post = res.data;
            setPost(post);
        };
        getPost();
    }, []);

    return (
        <>
            {post && (
                <div>
                    <h1>{post.title}</h1>
                    <p>{post.body}</p>
                    <br />
                    <p>{post.publishDate}</p>
                </div>
            )}
        </>
    );
}
