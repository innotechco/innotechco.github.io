# WordPress SEO Editor Guide

Use WordPress Posts for all INNOTECH blog content.

## Add Or Edit An Article

1. Open `https://blog.innotech.global/wp-admin`.
2. Go to `Posts`.
3. Edit an existing post or choose `Add New`.
4. Fill these fields:
   - `Title`: article title.
   - `Content`: full article body. You can add headings, paragraphs, lists, links, images, captions, and embeds.
   - `Excerpt`: short summary used on archive cards.
   - `Featured Image`: image used on cards and article hero.
   - `Categories`: controls where the article appears.
5. Click `Publish` or `Update`.

## Category Rules

Use these category slugs:

```text
what-we-think
insight
inception
infinity
automotive
energy-materials
health
high-tech
metals-mining
ai-agents
market-research
digital-transformation
sustainability
foresight
```

Display behavior:

```text
What We Think page: posts with category what-we-think
Archives page: all real blog posts except default/test posts
Article page: opens by the WordPress slug
```

## Images Inside The Text

The React article page renders WordPress body content directly, so an editor can insert images between paragraphs from the WordPress editor:

```text
Add Block > Image
```

Use captions when useful for SEO and accessibility context.

## SEO Checklist

- Keep the slug short and readable.
- Write a unique excerpt.
- Add a featured image.
- Use headings in order: H2 for main sections, H3 for subsections.
- Add internal links where relevant.
- Add image alt text in the WordPress media settings.
- Avoid publishing test posts.
