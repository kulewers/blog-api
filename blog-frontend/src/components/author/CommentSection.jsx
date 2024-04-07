import Comment from "./Comment";

export default function CommentSection({ comments }) {
  return (
    <>
      {comments && (
        <>
          <h3>Comments:</h3>
          {comments.length == 0 ? (
            <p>There are no comments on this post</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {comments.map((comment) => (
                <Comment data={comment} key={comment._id} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
