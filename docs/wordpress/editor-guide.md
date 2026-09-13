# INNOTECH — WordPress Editor Guide

Everything an editor needs to publish an article on innotech.global.

All blog content lives in **WordPress Posts** at `https://blog.innotech.global/wp-admin`.
The website places every article inside a fixed layout block: text and images share one
column with a straight left edge and a straight right edge. The rules below keep your
content inside that block. Follow them and the article will always look clean — no image
sticking out, no squeezed text, no broken spacing.

The one screen that is *not* a Post is the big card at the top of the home page — that
lives under **INNOTECH Home** in the admin menu. See section 9.

---

## 1. Image sizes — read this first

Everything is **16:9 landscape**. Always.

| Where | Size to upload | Minimum | Format | File size |
| --- | --- | --- | --- | --- |
| **Featured Image** (top of the article + all cards) | **1920 × 1080** | 1600 × 900 | WebP | under 500 KB |
| **Images inside the article body** | **1600 × 900** | 1200 × 675 | WebP | under 400 KB |
| **Charts and infographics** | **1600 × 900** | 1200 × 675 | WebP | under 400 KB |

### Important notes about images

- **Keep the subject in the centre.** The Featured Image is also used on the archive
  cards, the homepage and the Related News cards, where it is cropped to roughly 4:3.
  If the subject sits in a corner, it gets cut off there.
- **Do not upload images wider than 2000 px.** It only slows the site down; the extra
  pixels are never displayed.
- **Text inside an infographic must be large.** The image is displayed at 780 px wide
  on screen. In a 1600 px wide file, use a font size of **at least 28 px**, otherwise
  the labels are unreadable on the website.
- **Other shapes still work.** If you upload a square or portrait image the page will
  not break — a portrait image keeps its own shape and a square one gets empty space
  on both sides. It simply looks best at 16:9.
- **Use WebP.** If you only have JPG or PNG, convert it before uploading (Photoshop,
  Canva, or squoosh.app all export WebP).

---

## 2. Creating or editing an article

1. Open `https://blog.innotech.global/wp-admin` and go to **Posts**.
2. Edit an existing post, or choose **Add New**.
3. **Title** — the article title. This is the only H1 on the page. Do not repeat it
   inside the body.
4. **Content** — the article body. See the block rules in section 3.
5. **Excerpt** — a short, unique summary. This is what appears on the cards in the
   archive and on the homepage.
6. **Featured Image** — 1920 × 1080, see the table above.
7. **Categories** — controls where the article appears on the site. See section 4.
8. **INNOTECH Article Settings → Read Time** — the exact text shown in the hero and on
   destination cards, for example `5 minutes read`. It is displayed as typed; the
   website never calculates it for you.
9. **INNOTECH Article Settings → Related News** — pick up to three other articles and
   order them with the arrow buttons. See section 6.
10. Click **Publish** or **Update**.

---

## 3. The block rules

### 3.1 Never put text or a table inside a Gallery block

This is the single most common cause of a broken article page.

When you paste content, WordPress sometimes drops paragraphs, headings and tables
**inside** the Gallery block. The gallery then places them side by side, and the text
gets squeezed into half a column.

**How to check:** open the **List view** (the icon at the top left of the editor, next
to the plus button). If paragraphs or a table appear indented *underneath* a Gallery
block, they are trapped inside it.

**How to fix:** select the trapped block, cut it (Ctrl+X), click below the gallery,
and paste it (Ctrl+V).

**How to avoid it:**

- One image = one **Image** block.
- Text = a separate **Paragraph** block.
- Use the **Gallery** block only when you genuinely want two or more images next to
  each other.

### 3.2 Do not use Wide width or Full width on images

Select an image and check the toolbar. The alignment must be **None**.

Do not use:

- `Wide width`
- `Full width`
- `Align left` / `Align right`

The website controls the width itself. Any alignment setting is ignored, and while the
page no longer breaks, the result is not what you saw in the editor.

### 3.3 Do not resize images by dragging

If you have dragged the corner of an image to resize it, open the image settings on
the right and click **Reset**. Let the website set the size.

### 3.4 Use Heading 2 and Heading 3 — never Heading 1

The article title is already the H1 of the page.

- **Heading 2** — main sections
- **Heading 3** — subsections
- **Heading 4** — only if you really need a third level

The Table of Contents on the left side of the article page is built automatically from
these headings. Do not add a manually written Table of Contents block, and do not use
H1 inside the body — it confuses that structure.

### 3.5 Never repeat the same heading text

If two sections have exactly the same title, the Table of Contents shows the same entry
twice and readers cannot tell them apart. Give every heading a distinct title.

### 3.6 Do not press Enter to create space

Empty lines between blocks do nothing — the website removes them and applies its own
spacing. Adding them just makes the content harder to edit later.

### 3.7 Use the Caption field for image sources

Do not write the source inside the image file. Select the image and type in the
**Caption** field below it, for example:

```text
Source: High Density Polyethylene Patent Landscape Report, STMAnalytics, 2025
```

The website styles the caption automatically with a separator line under the image.
This is more readable than text baked into the picture, and better for SEO.

### 3.8 Always write Alt text

Select the image → **Alt text** field on the right → describe what the image shows in
one short sentence. Required for accessibility and for Google Images.

### 3.9 Tables

Use the **Table** block. If a table is very wide it scrolls sideways inside its own
box, so it never widens the page. Keep tables to 4 columns or fewer where you can —
wide tables are hard to read on a phone.

### 3.10 Images inside the text

The React article page renders WordPress body content directly, so you can insert
images between paragraphs straight from the editor:

```text
Add Block > Image
```

Use captions when useful for SEO and accessibility context.

---

## 4. Categories

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

Display behaviour:

```text
What We Think page: posts in the what-we-think category
Archives page:      every real blog post, excluding uncategorized and what-we-think
Article page:       opens by the WordPress slug
```

---

## 5. Recommended article structure

```text
Heading 2   — section title
Paragraph   — text
Image       — 1600 × 900, with caption and alt text
Paragraph   — text
Heading 3   — subsection title
Paragraph   — text
```

Two rules of thumb:

- Never place two images directly after each other.
- Never start a section with an image — put a paragraph first.

---

## 6. Related News

Do not create a `Related News` heading, and do not put Related News links or cards
inside the Body. Manage this section only from
**INNOTECH Article Settings → Related News**.

The cards always read their Title, Excerpt, Featured Image, Date, Read Time and link
from the **selected destination article**. To change what a card says, edit that
destination article — never copy card text into the source article.

---

## 7. Checklist before publishing

- [ ] Featured Image uploaded, 1920 × 1080, subject centred
- [ ] All body images 1600 × 900, WebP, under 400 KB
- [ ] Every image has Alt text
- [ ] Charts have a caption with the source
- [ ] No image uses Wide width or Full width — all set to None
- [ ] List view checked: nothing trapped inside a Gallery block
- [ ] Headings are H2 / H3, no H1 in the body
- [ ] No two headings with the same text
- [ ] Slug is short and readable
- [ ] Excerpt filled in and unique
- [ ] Read Time filled in
- [ ] Category selected
- [ ] Related News selected and ordered
- [ ] Internal links added where relevant
- [ ] Article previewed on a phone
- [ ] Not a test post

---

## 8. Quick reference

| Question | Answer |
| --- | --- |
| What size should images be? | 16:9 — 1920 × 1080 for the Featured Image, 1600 × 900 inside the article |
| What image format? | WebP |
| Which alignment for images? | None |
| Which heading levels? | H2 and H3 |
| Can I put text inside a Gallery? | No — never |
| How do I add a source under a chart? | The Caption field of the Image block |
| How do I add space between sections? | You do not — the website handles spacing |
| Who writes the Table of Contents? | The website, from your H2 and H3 blocks |
| How do I change a Related News card? | Edit the destination article, not this one |

---

## 9. The home page card

The large card at the top of the home page is **not** a Post. Edit it under
**INNOTECH Home** in the admin menu. It holds three text fields — card title, card
description and link text — one set per language (English, Arabic, Turkish).

The card has no image of its own. A field left blank keeps whatever the website
currently shows, so you can fill in one language and leave the others alone. The
*Read more* link under the card opens a normal article; where it points is set in the
website code, not here.

---

If an article still does not look right after following this guide, send the article
link to the development team rather than trying to fix it with extra blocks or
spacing — it is usually a one-line fix on the website side.
