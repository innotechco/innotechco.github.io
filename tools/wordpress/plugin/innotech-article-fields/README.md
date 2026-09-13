# INNOTECH Article Fields

Version 1.2.0

Install and activate this folder as a WordPress plugin. It adds the editable fields
innotech.global needs and exposes them through the REST API.

## Article settings

Applies to every WordPress Post. Adds an **INNOTECH Article Settings** box containing:

- `Read Time` (`innotech_read_time`): exact editor-entered text, shown as typed.
- `Related News` (`innotech_related_posts`): an ordered list of up to three Post IDs.

Both values are exposed under `meta` in `GET /wp-json/wp/v2/posts` and
`GET /wp-json/wp/v2/posts/<id>`.

Related card title, excerpt, featured image, date, read time, slug, and link are not
copied into the source article. React resolves every selected ID against its destination
WordPress Post.

## Home card

Adds an **INNOTECH Home** screen to the admin menu for the large card at the top of the
home page. It holds three text fields — card title, card description, link text — one
set per locale (`en`, `ar`, `tr`), stored in the `innotech_home_hero` option.

The card is text only; it has no image of its own, and the *Read more* target is wired
in the front-end code rather than edited here. Requires the `edit_pages` capability.

Exposed at:

```text
GET /wp-json/innotech/v1/home-hero?lang=en
```

Blank fields are left out of the response, so the website keeps its current wording
until a field is actually filled in. An unknown `lang` falls back to `en`.

On first load in wp-admin the fields are seeded with the English wording already on the
site; Arabic and Turkish start empty.

## Migrations

Version 1.1.0 performs a one-time migration for existing published Posts. It fills only
missing values with an editable WordPress Featured Image, `2 minutes read`, and three
ordered destination Posts. Existing editor values are never overwritten.

## Updating on the live host

Deleting a plugin folder through wp-admin does not work on this host. Ship an update
under a **new folder name** rather than overwriting the existing one.
