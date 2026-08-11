# WordPress CMS Contract

This project treats WordPress as a headless CMS. React keeps the current UI and reads editable content from a JSON API.

## Environment

Copy `.env.example` to `.env.local` and enable the CMS when the WordPress endpoint is ready:

```env
VITE_CMS_ENABLED=true
VITE_CMS_BASE_URL=https://blog.innotech.global
VITE_CMS_HOME_PATH=/wp-json/innotech/v1/content/home
VITE_CMS_HOME_SLUG_PREFIX=innotech-home-content
```

When `VITE_CMS_ENABLED=false`, the site uses the local JSON files under `src/content`.

During the first rollout, `VITE_CMS_HOME_SLUG_PREFIX` can point React to editable WordPress pages named:

```text
innotech-home-content-en
innotech-home-content-ar
innotech-home-content-tr
```

Each page body should contain only the matching Home JSON.

## Home Endpoint

Request:

```text
GET /wp-json/innotech/v1/content/home?lang=en
GET /wp-json/innotech/v1/content/home?lang=ar
GET /wp-json/innotech/v1/content/home?lang=tr
```

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

## Acceptance Test

1. Enable the CMS in `.env.local`.
2. Change `hero.title` in WordPress.
3. Refresh the React site.
4. Confirm the new title appears without changing React source code.
5. Change `latestNews.image` or `hero.backgroundImage` in WordPress.
6. Refresh and confirm the new image appears.
7. Disable or break the endpoint temporarily.
8. Confirm the page still renders using local fallback content.

## Article Contract

Install and activate `wordpress-plugin/innotech-article-fields`. Every WordPress Post then exposes:

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

`innotech_related_posts` contains only ordered destination Post IDs. React resolves title, excerpt, featured image, date, read time, and slug from each destination Post. Related card content is never duplicated on the source Post.

For CMS articles, React does not silently substitute local images, calculated read times, source-article metadata, category recommendations, or links parsed from Body content.

## WordPress Setup Checklist

- Install Advanced Custom Fields or create equivalent custom REST fields.
- Create one editable content model for Home.
- Support `en`, `ar`, and `tr` values.
- Return media as absolute URLs.
- Keep stable IDs for repeated cards, especially `liveInsights.cards`.
- Add CORS headers so the deployed React domain can call the WordPress API.
