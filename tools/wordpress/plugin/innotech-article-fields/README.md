# INNOTECH Article Fields

Install and activate this folder as a WordPress plugin. It applies to every WordPress Post.

It adds an **INNOTECH Article Settings** box containing:

- `Read Time` (`innotech_read_time`): exact editor-entered text.
- `Related News` (`innotech_related_posts`): an ordered list of up to three Post IDs.

Both values are exposed under `meta` in `GET /wp-json/wp/v2/posts` and `GET /wp-json/wp/v2/posts/<id>`.

Related card title, excerpt, featured image, date, read time, slug, and link are not copied into the source article. React resolves every selected ID against its destination WordPress Post.

Version 1.1.0 also performs a one-time migration for existing published Posts. It fills only missing values with an editable WordPress Featured Image, `2 minutes read`, and three ordered destination Posts. Existing editor values are never overwritten.
