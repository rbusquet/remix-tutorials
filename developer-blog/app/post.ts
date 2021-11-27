import path from "path";
import fs from "fs/promises";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  html?: string;
  markdown?: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

let postsPath = path.join(__dirname, "..", "posts");

export async function getPosts() {
  let dir = await fs.readdir(postsPath);
  return Promise.all(
    dir.map(async (filename) => {
      let file = await fs.readFile(path.join(postsPath, filename));
      let { attributes } = parseFrontMatter(file.toString());
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );
      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title,
      };
    })
  );
}

export async function getPost(slug: string) {
  const filename = path.join(postsPath, `${slug}.md`);
  let file = await fs.readFile(filename);

  let { attributes, body } = parseFrontMatter(file.toString());
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filename} is missing attributes!`
  );
  let html = marked(body);
  return { slug, title: attributes.title, html, markdown: body };
}

export type NewPost = {
  title: string;
  slug: string;
  markdown: string;
};

export async function createPost(post: NewPost) {
  let md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
  await fs.writeFile(path.join(postsPath, `${post.slug}.md`), md);
  return getPost(post.slug);
}

export async function updatePost(oldSlug: string, post: NewPost) {
  const existingPost = await getPost(oldSlug);

  let md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
  await fs.writeFile(path.join(postsPath, `${existingPost.slug}.md`), md);
  await fs.rename(
    path.join(postsPath, `${existingPost.slug}.md`),
    path.join(postsPath, `${post.slug}.md`)
  );
  return getPost(post.slug);
}
