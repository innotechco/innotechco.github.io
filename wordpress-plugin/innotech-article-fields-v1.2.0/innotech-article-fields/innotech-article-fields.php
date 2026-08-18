<?php
/**
 * Plugin Name: INNOTECH Article Fields
 * Description: Adds exact read-time and ordered Related News fields to every WordPress post, adds an INNOTECH Home screen for the home page card, and exposes both through REST.
 * Version: 1.2.0
 * Author: INNOTECH
 */

if (!defined('ABSPATH')) {
    exit;
}

require_once plugin_dir_path(__FILE__) . 'home-hero.php';

const INNOTECH_READ_TIME_META = 'innotech_read_time';
const INNOTECH_RELATED_POSTS_META = 'innotech_related_posts';
const INNOTECH_ARTICLE_FIELDS_VERSION = '1.2.0';
const INNOTECH_ARTICLE_FIELDS_VERSION_OPTION = 'innotech_article_fields_version';

function innotech_sanitize_related_posts($value) {
    $ids = is_array($value) ? $value : array();
    $ids = array_values(array_unique(array_filter(array_map('absint', $ids))));
    return array_slice($ids, 0, 3);
}

function innotech_register_article_meta() {
    register_post_meta('post', INNOTECH_READ_TIME_META, array(
        'type' => 'string',
        'single' => true,
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
        'auth_callback' => function () {
            return current_user_can('edit_posts');
        },
        'show_in_rest' => true,
    ));

    register_post_meta('post', INNOTECH_RELATED_POSTS_META, array(
        'type' => 'array',
        'single' => true,
        'default' => array(),
        'sanitize_callback' => 'innotech_sanitize_related_posts',
        'auth_callback' => function () {
            return current_user_can('edit_posts');
        },
        'show_in_rest' => array(
            'schema' => array(
                'type' => 'array',
                'items' => array('type' => 'integer'),
                'maxItems' => 3,
                'uniqueItems' => true,
            ),
        ),
    ));
}
add_action('init', 'innotech_register_article_meta');

function innotech_add_article_meta_box() {
    add_meta_box(
        'innotech-article-fields',
        __('INNOTECH Article Settings', 'innotech'),
        'innotech_render_article_meta_box',
        'post',
        'side',
        'high'
    );
}
add_action('add_meta_boxes_post', 'innotech_add_article_meta_box');

function innotech_render_article_meta_box($post) {
    wp_nonce_field('innotech_save_article_fields', 'innotech_article_fields_nonce');

    $read_time = (string) get_post_meta($post->ID, INNOTECH_READ_TIME_META, true);
    $related_ids = innotech_sanitize_related_posts(
        get_post_meta($post->ID, INNOTECH_RELATED_POSTS_META, true)
    );
    $posts = get_posts(array(
        'post_type' => 'post',
        'post_status' => array('publish', 'draft', 'pending', 'future'),
        'posts_per_page' => -1,
        'post__not_in' => array($post->ID),
        'orderby' => 'title',
        'order' => 'ASC',
    ));
    ?>
    <p>
        <label for="innotech-read-time"><strong><?php esc_html_e('Read Time', 'innotech'); ?></strong></label>
        <input
            id="innotech-read-time"
            name="innotech_read_time"
            type="text"
            class="widefat"
            value="<?php echo esc_attr($read_time); ?>"
            placeholder="2 minutes read"
        />
        <small><?php esc_html_e('Displayed exactly as entered. This field is intentionally not calculated.', 'innotech'); ?></small>
    </p>
    <hr />
    <p><strong><?php esc_html_e('Related News', 'innotech'); ?></strong></p>
    <p><?php esc_html_e('Choose up to 3 posts. Use the arrows to control card order.', 'innotech'); ?></p>
    <select id="innotech-related-picker" class="widefat">
        <option value=""><?php esc_html_e('Select an article...', 'innotech'); ?></option>
        <?php foreach ($posts as $candidate) : ?>
            <option value="<?php echo esc_attr($candidate->ID); ?>">
                <?php echo esc_html(get_the_title($candidate)); ?>
            </option>
        <?php endforeach; ?>
    </select>
    <p><button type="button" class="button" id="innotech-related-add"><?php esc_html_e('Add article', 'innotech'); ?></button></p>
    <ol id="innotech-related-list" style="margin-left:0">
        <?php foreach ($related_ids as $related_id) :
            $related_post = get_post($related_id);
            if (!$related_post) continue;
            ?>
            <li data-id="<?php echo esc_attr($related_id); ?>" style="display:flex;gap:4px;align-items:center;margin:6px 0">
                <input type="hidden" name="innotech_related_posts[]" value="<?php echo esc_attr($related_id); ?>" />
                <span style="flex:1"><?php echo esc_html(get_the_title($related_post)); ?></span>
                <button type="button" class="button innotech-related-up" aria-label="<?php esc_attr_e('Move up', 'innotech'); ?>">&uarr;</button>
                <button type="button" class="button innotech-related-down" aria-label="<?php esc_attr_e('Move down', 'innotech'); ?>">&darr;</button>
                <button type="button" class="button innotech-related-remove" aria-label="<?php esc_attr_e('Remove', 'innotech'); ?>">&times;</button>
            </li>
        <?php endforeach; ?>
    </ol>
    <script>
    (() => {
        const list = document.getElementById('innotech-related-list');
        const picker = document.getElementById('innotech-related-picker');
        const add = document.getElementById('innotech-related-add');
        if (!list || !picker || !add) return;

        const escapeHtml = (value) => {
            const node = document.createElement('span');
            node.textContent = value;
            return node.innerHTML;
        };
        const row = (id, title) => {
            const item = document.createElement('li');
            item.dataset.id = id;
            item.style.cssText = 'display:flex;gap:4px;align-items:center;margin:6px 0';
            item.innerHTML = `<input type="hidden" name="innotech_related_posts[]" value="${id}">` +
                `<span style="flex:1">${escapeHtml(title)}</span>` +
                '<button type="button" class="button innotech-related-up" aria-label="Move up">&uarr;</button>' +
                '<button type="button" class="button innotech-related-down" aria-label="Move down">&darr;</button>' +
                '<button type="button" class="button innotech-related-remove" aria-label="Remove">&times;</button>';
            return item;
        };

        add.addEventListener('click', () => {
            const option = picker.selectedOptions[0];
            if (!option?.value || list.children.length >= 3) return;
            if ([...list.children].some((item) => item.dataset.id === option.value)) return;
            list.appendChild(row(option.value, option.textContent.trim()));
            picker.value = '';
        });

        list.addEventListener('click', (event) => {
            const item = event.target.closest('li');
            if (!item) return;
            if (event.target.closest('.innotech-related-remove')) item.remove();
            if (event.target.closest('.innotech-related-up') && item.previousElementSibling) {
                list.insertBefore(item, item.previousElementSibling);
            }
            if (event.target.closest('.innotech-related-down') && item.nextElementSibling) {
                list.insertBefore(item.nextElementSibling, item);
            }
        });
    })();
    </script>
    <?php
}

function innotech_save_article_fields($post_id) {
    if (!isset($_POST['innotech_article_fields_nonce']) ||
        !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['innotech_article_fields_nonce'])), 'innotech_save_article_fields')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    $read_time = isset($_POST['innotech_read_time'])
        ? sanitize_text_field(wp_unslash($_POST['innotech_read_time']))
        : '';
    update_post_meta($post_id, INNOTECH_READ_TIME_META, $read_time);

    $related = isset($_POST['innotech_related_posts'])
        ? innotech_sanitize_related_posts(wp_unslash($_POST['innotech_related_posts']))
        : array();
    $related = array_values(array_filter($related, function ($related_id) use ($post_id) {
        return $related_id !== (int) $post_id && get_post_type($related_id) === 'post';
    }));
    update_post_meta($post_id, INNOTECH_RELATED_POSTS_META, $related);
}
add_action('save_post_post', 'innotech_save_article_fields');

function innotech_create_default_article_image() {
    $existing_id = absint(get_option('innotech_default_article_image_id'));
    if ($existing_id && get_post_type($existing_id) === 'attachment') {
        return $existing_id;
    }

    $source = plugin_dir_path(__FILE__) . 'assets/default-article-hero.webp';
    if (!file_exists($source)) return 0;

    $upload = wp_upload_bits('innotech-default-article-hero.webp', null, file_get_contents($source));
    if (!empty($upload['error'])) return 0;

    $attachment_id = wp_insert_attachment(array(
        'post_mime_type' => 'image/webp',
        'post_title' => 'INNOTECH Default Article Hero',
        'post_content' => '',
        'post_status' => 'inherit',
    ), $upload['file']);
    if (is_wp_error($attachment_id)) return 0;

    require_once ABSPATH . 'wp-admin/includes/image.php';
    $metadata = wp_generate_attachment_metadata($attachment_id, $upload['file']);
    wp_update_attachment_metadata($attachment_id, $metadata);
    update_post_meta($attachment_id, '_wp_attachment_image_alt', 'INNOTECH article hero');
    update_option('innotech_default_article_image_id', $attachment_id, false);
    return $attachment_id;
}

/**
 * Seeds only missing values on the current published article set. Every seeded
 * value is ordinary WordPress data and remains independently editable.
 */
function innotech_seed_existing_articles() {
    if (get_option(INNOTECH_ARTICLE_FIELDS_VERSION_OPTION) === INNOTECH_ARTICLE_FIELDS_VERSION) {
        return;
    }
    if (!current_user_can('manage_options')) return;

    $post_ids = get_posts(array(
        'post_type' => 'post',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => 'date',
        'order' => 'DESC',
        'fields' => 'ids',
    ));
    if (!$post_ids) return;

    $default_image_id = innotech_create_default_article_image();
    $post_count = count($post_ids);

    foreach ($post_ids as $index => $post_id) {
        if ($default_image_id && !has_post_thumbnail($post_id)) {
            set_post_thumbnail($post_id, $default_image_id);
        }

        if ((string) get_post_meta($post_id, INNOTECH_READ_TIME_META, true) === '') {
            update_post_meta($post_id, INNOTECH_READ_TIME_META, '2 minutes read');
        }

        $related = innotech_sanitize_related_posts(
            get_post_meta($post_id, INNOTECH_RELATED_POSTS_META, true)
        );
        if (!$related && $post_count > 1) {
            $seeded_related = array();
            for ($offset = 1; $offset < $post_count && count($seeded_related) < 3; $offset++) {
                $candidate = $post_ids[($index + $offset) % $post_count];
                if ($candidate !== $post_id) $seeded_related[] = $candidate;
            }
            update_post_meta($post_id, INNOTECH_RELATED_POSTS_META, $seeded_related);
        }
    }

    update_option(INNOTECH_ARTICLE_FIELDS_VERSION_OPTION, INNOTECH_ARTICLE_FIELDS_VERSION, false);
}
add_action('admin_init', 'innotech_seed_existing_articles');
