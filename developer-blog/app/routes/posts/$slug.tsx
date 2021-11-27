import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { getPost, Post } from "~/post";
import invariant from "tiny-invariant";

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return getPost(params.slug);
};

export default function PostSlug() {
  let post = useLoaderData<Post>();
  invariant(post.html);
  return (
    <>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </>
  );
}
