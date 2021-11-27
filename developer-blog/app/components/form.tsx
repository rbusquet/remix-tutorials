import { Form, useTransition } from "remix";
import type { NewPost } from "~/post";

interface Props {
  errors?: { [field: string]: string };
  data?: NewPost;
  update?: boolean;
}

export default function PostForm({ errors, data, update = false }: Props) {
  let transition = useTransition();
  const [submit, submitting] = update
    ? ["Update post", "Updating..."]
    : ["Create post", "Creating..."];
  return (
    <Form method="post" key={data?.slug}>
      <p>
        <label>
          Post Title:
          {errors?.title && <em>Title is required</em>}
          <input type="text" name="title" required defaultValue={data?.title} />
        </label>
      </p>
      <p>
        <label>
          Post Slug:
          {errors?.slug && <em>Slug is required</em>}{" "}
          <input type="text" name="slug" required defaultValue={data?.slug} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label>
        {errors?.markdown && <em>Markdown is required</em>}
        <br />
        <textarea
          rows={20}
          name="markdown"
          defaultValue={data?.markdown}
          required
        />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? submitting : submit}
        </button>
      </p>
    </Form>
  );
}
