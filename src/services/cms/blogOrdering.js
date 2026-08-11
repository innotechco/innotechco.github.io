const WHAT_WE_THINK_CATEGORY = "what-we-think";

export function getWhatWeThinkPosts(posts = []) {
  return posts.filter((post) => post.categories?.includes(WHAT_WE_THINK_CATEGORY));
}

export function orderPostsForArchives(posts = []) {
  const whatWeThinkPosts = getWhatWeThinkPosts(posts);
  const otherPosts = posts.filter(
    (post) => !post.categories?.includes(WHAT_WE_THINK_CATEGORY),
  );

  return [...whatWeThinkPosts, ...otherPosts];
}
