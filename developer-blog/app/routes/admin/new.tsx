import { Form, redirect, useActionData, useTransition } from "remix";
import type { ActionFunction } from "remix";
import { createPost } from "~/post";
import AdminForm from "~/components/form";
import invariant from "tiny-invariant";

export let action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));
  let formData = await request.formData();
  let title = formData.get("title");
  let slug = formData.get("slug");
  let markdown = formData.get("markdown");

  let errors: {
    title?: boolean;
    slug?: boolean;
    markdown?: boolean;
  } = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");
  await createPost({ title, slug, markdown });
  return redirect("/admin");
};

export default function NewPost() {
  let errors = useActionData();
  return <AdminForm errors={errors} />;
}
