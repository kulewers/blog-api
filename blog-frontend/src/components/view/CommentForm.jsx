import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function CommentForm({ url }) {
  const [submitErrors, setSubmitErrors] = useState([]);

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const commentSubmit = async (data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const res = await response.json();

      const errors = res.errors.map((obj) => obj.msg);

      setSubmitErrors([...errors]);

      throw new Error("Comment failed");
    }
    navigate(0);
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(commentSubmit)}
        style={{ display: "flex", flexDirection: "column", width: "250px" }}
      >
        <p>Make a comment:</p>
        <label htmlFor="email">
          Your email (only visible to post creator):{" "}
        </label>
        <input
          type="email"
          id="email"
          name="creatorEmail"
          required
          {...register("creatorEmail")}
        />
        <label htmlFor="body">Body:</label>
        <textarea
          id="body"
          name="body"
          rows={6}
          required
          {...register("body")}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      <div>
        {submitErrors?.map((error, index) => (
          <p style={{ color: "red" }} key={index}>
            {error}
          </p>
        ))}
      </div>
    </>
  );
}
