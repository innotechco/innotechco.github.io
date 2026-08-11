import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = process.env.WP_URL || "https://blog.innotech.global";
const username = process.env.WP_USER;
const password = process.env.WP_PASSWORD;

if (!username || !password) {
  throw new Error("Set WP_USER and WP_PASSWORD before importing.");
}

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function valueString(value) {
  return `<value><string>${escapeXml(value)}</string></value>`;
}

function memberString(name, value) {
  return `<member><name>${name}</name>${valueString(value)}</member>`;
}

function memberArray(name, values = []) {
  return [
    `<member><name>${name}</name><value><array><data>`,
    ...values.map((value) => valueString(value)),
    "</data></array></value></member>",
  ].join("");
}

function memberStruct(name, entries = []) {
  return `<member><name>${name}</name><value><struct>${entries.join("")}</struct></value></member>`;
}

async function xmlRpc(methodName, params) {
  const body = `<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>${methodName}</methodName><params>${params.map((param) => `<param>${param}</param>`).join("")}</params></methodCall>`;
  const response = await fetch(`${siteUrl}/xmlrpc.php`, {
    method: "POST",
    headers: {"Content-Type": "text/xml; charset=UTF-8"},
    body,
  });
  const text = await response.text();
  if (text.includes("<fault>")) throw new Error(text.replace(/\s+/g, " ").slice(0, 500));
  return text;
}

async function findPostId(slug) {
  const url = new URL("/wp-json/wp/v2/posts", `${siteUrl}/`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("context", "view");
  const response = await fetch(url);
  if (!response.ok) return null;
  const posts = await response.json();
  return posts[0]?.id ?? null;
}

function postStruct(post) {
  return `<value><struct>${[
    memberString("post_type", "post"),
    memberString("post_status", "publish"),
    memberString("post_title", post.title),
    memberString("post_name", post.slug),
    memberString("post_excerpt", post.excerpt),
    memberString("post_content", post.content),
    memberString("post_date", post.date),
    memberStruct("terms_names", [
      memberArray("category", post.categories),
    ]),
  ].join("")}</struct></value>`;
}

const posts = JSON.parse(fs.readFileSync(path.join(root, "wordpress-import", "innotech-blog-import-manifest.json"), "utf8"));
const results = [];

for (const post of posts) {
  const existingId = await findPostId(post.slug);
  if (existingId) {
    results.push({slug: post.slug, action: "skipped-existing", id: existingId});
  } else {
    const response = await xmlRpc("wp.newPost", [
      valueString("1"),
      valueString(username),
      valueString(password),
      postStruct(post),
    ]);
    const id = response.match(/<(?:string|int)>(\d+)<\/(?:string|int)>/)?.[1] ?? "";
    results.push({slug: post.slug, action: "created", id});
  }
  console.log(results.at(-1));
}

console.table(results);
