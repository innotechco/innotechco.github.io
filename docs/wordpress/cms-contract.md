# WordPress CMS Contract

This project treats WordPress as a headless CMS. React keeps the current UI and reads
editable content from a JSON API.

Three separate things come from WordPress, each with its own switch:

| Content | Source | Switch |
| --- | --- | --- |
| Home hero card | `innotech/v1/home-hero` (plugin) | `VITE_CMS_ENABLED` |
| Rest of the Home page | a WordPress page holding JSON, or a custom endpoint | `VITE_CMS_HOME_ENABLED` |
| Articles and archives | `wp/v2/posts` | `VITE_CMS_BLOG_ENABLED` |

`VITE_CMS_ENABLED=false` turns all three off and the site runs entirely on the bundled
JSON in `src/content/`.

## Environment

Copy `.env.example` to `.env.local`:

```env
VITE_CMS_ENABLED=false
VITE_CMS_BASE_URL=https://blog.innotech.global
VITE_CMS_HOME_ENABLED=true
VITE_CMS_HOME_PATH=/wp-json/innotech/v1/content/home
VITE_CMS_HOME_SLUG_PREFIX=innotech-home-content
VITE_CMS_BLOG_ENABLED=true
VITE_CMS_BLOG_PER_PAGE=50

# Optional generic content API. When unset, fetchJsonFromApi() short-circuits
# and the site falls back to the bundled JSON in src/content/.
VITE_CONTENT_API_BASE_URL=
```

| Variable | Effect |
| --- | --- |
| `VITE_CMS_ENABLED` | Master switch. Must be exactly `true` for any WordPress fetch to happen. |
| `VITE_CMS_BASE_URL` | WordPress origin. Every request is built relative to it. |
| `VITE_CMS_HOME_ENABLED` | Must be exactly `true` for the Home *page* content fetch. Does not affect the hero card or the blog. |
| `VITE_CMS_HOME_SLUG_PREFIX` | When set, Home content is read from a WordPress **page** whose slug is `<prefix>-<locale>`. |
| `VITE_CMS_HOME_PATH` | Used **only when `VITE_CMS_HOME_SLUG_PREFIX` is empty.** The slug prefix wins whenever both are set. |
| `VITE_CMS_BLOG_ENABLED` | Blog is on unless this is exactly `false`. |
| `VITE_CMS_BLOG_PER_PAGE` | `per_page` for `wp/v2/posts`. Defaults to 50. |
| `VITE_CONTENT_API_BASE_URL` | Unrelated optional generic content API. Leave empty. |

Note that the two Home variables are not interchangeable: `buildHomePageUrl()` in
`src/integrations/wordpress/client/wordpressClient.js` checks the slug prefix first and
only falls through to `VITE_CMS_HOME_PATH` when the prefix is an empty string. With the
shipped `.env.example` values, `VITE_CMS_HOME_PATH` is never requested.

## How the front end handles loading

Sections backed by WordPress do **not** paint the bundled copy first. Each fetch has
three states:

- `loading` — WordPress has not answered. The section renders `ContentSkeleton`.
- `ready` — use the WordPress data. An empty list means WordPress genuinely has none.
- `error` — WordPress could not be reached. *Now* the bundled copy is used.

So the bundled JSON under `src/content/` is a failure fallback, not a first paint. When
the CMS is switched off the state starts at `ready`, so no skeleton flashes for a frame.

See `src/app/providers/home-content/HomeContentProvider.jsx` and
`src/shared/hooks/useBlogPosts.js`.

## Home Hero Endpoint

Provided by the `innotech-article-fields` plugin (1.2.0+) and edited under
**WordPress → INNOTECH Home**.

```text
GET /wp-json/innotech/v1/home-hero?lang=en
GET /wp-json/innotech/v1/home-hero?lang=ar
GET /wp-json/innotech/v1/home-hero?lang=tr
```

```json
{
  "title": "INNOVATION AI ASSISTANT",
  "description": "AI-Powered Expertise in Technology, Market & Product Development",
  "linkLabel": "Read more"
}
```

Text only — the card has no image of its own, and the *Read more* target is wired in the
front end, not editable in WordPress. **Blank fields are omitted from the response**, so
an editor can fill one locale and leave the others alone; React merges whatever comes
back over the current hero and keeps the existing wording for missing keys. An unknown
`lang` falls back to `en`.

Only `VITE_CMS_ENABLED` gates this one — `VITE_CMS_HOME_ENABLED` does not apply.

## Home Page Endpoint

This one is **not** provided by the plugin; it is whatever you point React at.

With `VITE_CMS_HOME_SLUG_PREFIX=innotech-home-content` (the default), React requests:

```text
GET /wp-json/wp/v2/pages?slug=innotech-home-content-en
GET /wp-json/wp/v2/pages?slug=innotech-home-content-ar
GET /wp-json/wp/v2/pages?slug=innotech-home-content-tr
```

and parses `content.rendered` of the first result as JSON — so each of those pages must
contain the matching Home JSON as its body and nothing else.

With the slug prefix empty, React instead requests `VITE_CMS_HOME_PATH` with a `lang`
query parameter and expects the same JSON directly.

Response shape:

```json
{
  "hero": {
    "title": "AI Agent",
    "description": "We leverage the advances in disruptive technologies to enhance business.",
    "linkLabel": "Read more",
    "backgroundImage": "https://blog.innotech.global/wp-content/uploads/home-hero.webp"
  },
  "ecosystemCards": [
    {
      "title": "INCEPTION",
      "subtitle": "BY INNOTECH",
      "items": [
        {
          "label": "Innovation management system",
          "description": "Design and implementation of innovation management systems..."
        }
      ]
    }
  ],
  "latestNews": {
    "sectionTitle": "Our latest news",
    "headline": "INNOTECH launches regional collaboration with Cleannconnect.ai",
    "date": "June 1, 2026",
    "readTime": "2 minutes read",
    "summary": "The partnership...",
    "image": "https://blog.innotech.global/wp-content/uploads/latest-news.webp",
    "imageAlt": "Latest news"
  },
  "liveInsights": {
    "title": "LIVE INSIGHTS",
    "ctaLabel": "Read all insights",
    "cards": [
      {
        "id": "home-health-drug-discovery",
        "title": "AI-Driven Drug Discovery",
        "date": "June 1, 2026",
        "readTime": "2 minutes read",
        "description": "Inventions combining AI and biotechnology...",
        "image": "https://blog.innotech.global/wp-content/uploads/drug-discovery.webp",
        "imageAlt": "AI-Driven Drug Discovery"
      }
    ]
  },
  "globalFootprint": {
    "title": "EXPLORE OUR GLOBAL FOOTPRINT",
    "description": "Explore our global footprint...",
    "image": "https://blog.innotech.global/wp-content/uploads/map.webp",
    "imageAlt": "Middle East Map"
  }
}
```

`hero` here is merged with the home-hero endpoint above, which wins for the three fields
it returns. `latestNews` and `liveInsights.cards` are then rebuilt from live blog posts
when any are available.

## Article Contract

Install and activate `tools/wordpress/plugin/innotech-article-fields`. Every WordPress
Post then exposes:

| Visible article value | WordPress source | REST value |
| --- | --- | --- |
| Hero image | Featured Image | `_embedded["wp:featuredmedia"][0].source_url` |
| Category | Categories | `_embedded["wp:term"]` |
| Title | Title | `title.rendered` |
| Date | Publish date | `date` |
| Read Time | INNOTECH Article Settings > Read Time | `meta.innotech_read_time` |
| Lead/card description | Excerpt | `excerpt.rendered` |
| Body, headings, images, captions, links | Gutenberg Content | `content.rendered` |
| Related News order | INNOTECH Article Settings > Related News | `meta.innotech_related_posts` |

Posts are fetched from `GET /wp-json/wp/v2/posts?_embed=1&orderby=date&order=desc&lang=<locale>`.

`innotech_related_posts` contains only ordered destination Post IDs. React resolves
title, excerpt, featured image, date, read time, and slug from each destination Post.
Related card content is never duplicated on the source Post.

For CMS articles, React does not silently substitute local images, calculated read
times, source-article metadata, category recommendations, or links parsed from Body
content.

The client drops the `hello` and `hello-world` starter posts, and never offers
`uncategorized` or `what-we-think` as archive filters — those are structural buckets,
not topics. Category display names live in `CATEGORY_LABELS` in
`src/integrations/wordpress/client/wordpressBlog.js`; adding a new category slug in
WordPress means adding its label there too.

## Acceptance Test

1. Enable the CMS in `.env.local` (`VITE_CMS_ENABLED=true`).
2. Change the card title under **WordPress → INNOTECH Home** and reload the site.
   Confirm the new title appears without changing React source code.
3. Clear that field, reload, and confirm the previous wording is kept rather than the
   section going blank.
4. Change `latestNews.image` or `hero.backgroundImage` in the Home content page.
5. Reload and confirm the new image appears.
6. Throttle the network and confirm the WordPress-backed sections show a skeleton while
   loading — not the bundled copy.
7. Break the endpoint temporarily (wrong `VITE_CMS_BASE_URL`).
8. Confirm the page still renders using the bundled fallback content.

## WordPress Setup Checklist

- Install and activate the `innotech-article-fields` plugin for articles and the home
  card.
- Create one editable content model for the rest of the Home page, either as
  `innotech-home-content-<locale>` pages or as a custom endpoint.
- Support `en`, `ar`, and `tr` values.
- Return media as absolute URLs.
- Keep stable IDs for repeated cards, especially `liveInsights.cards`.
- Add CORS headers so the deployed React domain can call the WordPress API.
