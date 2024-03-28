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
              <div
                key={comment._id}
                style={{
                  border: "1px solid #aaa",
                  padding: "12px",
                  marginTop: "8px",
                }}
              >
                <p>{comment.body}</p>
                <p>{"By: " + comment.creatorEmail}</p>
                <p>{new Date(comment.timestamp).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
