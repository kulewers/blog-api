import Comment from "./Comment";

export default function CommentSection({ comments }) {
  return (
    <>
      {comments && (
        <div>
          <h3>Comments:</h3>
          {comments.length == 0 ? (
            <p>There are no comments on this post</p>
          ) : (
            comments.map((comment) => (
              <Comment data={comment} key={comment._id} />
            ))
          )}
        </div>
      )}
    </>
  );
}
