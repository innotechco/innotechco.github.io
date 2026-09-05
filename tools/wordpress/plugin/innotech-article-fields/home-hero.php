<?php
/**
 * Home hero card.
 *
 * The card at the top of the home page ("INNOVATION AI ASSISTANT") holds only
 * text - it has no image of its own. The Read more link under it opens a normal
 * WordPress post, which is edited under Posts like every other article; where
 * that link points is wired in the front-end code and is not editable here.
 */

if (!defined('ABSPATH')) {
    exit;
}

const INNOTECH_HOME_HERO_OPTION = 'innotech_home_hero';

function innotech_home_locales() {
    return array(
        'en' => 'English',
        'ar' => 'Arabic',
        'tr' => 'Turkish',
    );
}

function innotech_home_hero_defaults() {
    return array('title' => '', 'description' => '', 'linkLabel' => '');
}

function innotech_get_home_hero($locale = 'en') {
    $locales = innotech_home_locales();
    $locale = isset($locales[$locale]) ? $locale : 'en';

    $stored = get_option(INNOTECH_HOME_HERO_OPTION, array());
    $entry = isset($stored[$locale]) && is_array($stored[$locale]) ? $stored[$locale] : array();

    return wp_parse_args($entry, innotech_home_hero_defaults());
}

function innotech_register_home_hero_page() {
    add_menu_page(
        'INNOTECH Home Page',
        'INNOTECH Home',
        'edit_pages',
        'innotech-home',
        'innotech_render_home_hero_page',
        'dashicons-superhero-alt',
        26
    );
}
add_action('admin_menu', 'innotech_register_home_hero_page');

function innotech_save_home_hero() {
    if (!isset($_POST['innotech_home_hero_nonce'])) {
        return false;
    }

    $nonce = sanitize_text_field(wp_unslash($_POST['innotech_home_hero_nonce']));
    if (!wp_verify_nonce($nonce, 'innotech_save_home_hero')) {
        return false;
    }
    if (!current_user_can('edit_pages')) {
        return false;
    }

    $submitted = isset($_POST['innotech_home_hero']) && is_array($_POST['innotech_home_hero'])
        ? wp_unslash($_POST['innotech_home_hero'])
        : array();

    $clean = array();
    foreach (array_keys(innotech_home_locales()) as $locale) {
        $entry = isset($submitted[$locale]) && is_array($submitted[$locale]) ? $submitted[$locale] : array();
        $clean[$locale] = array(
            'title' => sanitize_text_field(isset($entry['title']) ? $entry['title'] : ''),
            'description' => sanitize_textarea_field(isset($entry['description']) ? $entry['description'] : ''),
            'linkLabel' => sanitize_text_field(isset($entry['linkLabel']) ? $entry['linkLabel'] : ''),
        );
    }

    update_option(INNOTECH_HOME_HERO_OPTION, $clean, false);
    return true;
}

function innotech_render_home_hero_page() {
    if (!current_user_can('edit_pages')) {
        return;
    }

    $saved = innotech_save_home_hero();
    ?>
    <div class="wrap">
        <h1>INNOTECH Home Page</h1>
        <?php if ($saved) : ?>
            <div class="notice notice-success is-dismissible">
                <p>Home card saved. Reload the website to see the change.</p>
            </div>
        <?php endif; ?>

        <p style="max-width:640px">
            This is the large card at the top of the home page. It is text only, so it has
            no image of its own. The <em>Read more</em> link under it opens a normal article,
            which you edit under <strong>Posts</strong> exactly like every other article.
        </p>

        <form method="post">
            <?php wp_nonce_field('innotech_save_home_hero', 'innotech_home_hero_nonce'); ?>
            <?php foreach (innotech_home_locales() as $locale => $language) :
                $hero = innotech_get_home_hero($locale); ?>
                <h2><?php echo esc_html($language); ?></h2>
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row">
                            <label for="innotech-hero-title-<?php echo esc_attr($locale); ?>">Card title</label>
                        </th>
                        <td>
                            <input type="text" class="regular-text"
                                id="innotech-hero-title-<?php echo esc_attr($locale); ?>"
                                name="innotech_home_hero[<?php echo esc_attr($locale); ?>][title]"
                                value="<?php echo esc_attr($hero['title']); ?>" />
                            <p class="description">Example: INNOVATION AI ASSISTANT</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="innotech-hero-description-<?php echo esc_attr($locale); ?>">Card description</label>
                        </th>
                        <td>
                            <textarea class="large-text" rows="3"
                                id="innotech-hero-description-<?php echo esc_attr($locale); ?>"
                                name="innotech_home_hero[<?php echo esc_attr($locale); ?>][description]"><?php
                                echo esc_textarea($hero['description']);
                            ?></textarea>
                            <p class="description">Example: AI-Powered Expertise in Technology, Market &amp; Product Development</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="innotech-hero-link-<?php echo esc_attr($locale); ?>">Link text</label>
                        </th>
                        <td>
                            <input type="text" class="regular-text"
                                id="innotech-hero-link-<?php echo esc_attr($locale); ?>"
                                name="innotech_home_hero[<?php echo esc_attr($locale); ?>][linkLabel]"
                                value="<?php echo esc_attr($hero['linkLabel']); ?>" />
                            <p class="description">Wording only, for example: Read more</p>
                        </td>
                    </tr>
                </table>
                <hr />
            <?php endforeach; ?>
            <?php submit_button('Save home card'); ?>
        </form>
    </div>
    <?php
}

function innotech_rest_home_hero($request) {
    $locale = sanitize_key((string) $request->get_param('lang'));
    $hero = innotech_get_home_hero($locale ? $locale : 'en');

    /* Empty fields are left out so the website keeps its current wording until
       a field is actually filled in. */
    $response = array();
    foreach ($hero as $key => $value) {
        if (trim((string) $value) !== '') {
            $response[$key] = $value;
        }
    }

    return rest_ensure_response($response);
}

function innotech_register_home_hero_route() {
    register_rest_route('innotech/v1', '/home-hero', array(
        'methods' => 'GET',
        'callback' => 'innotech_rest_home_hero',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'innotech_register_home_hero_route');

/** Pre-fills the fields with the wording already on the site, the first time. */
function innotech_seed_home_hero() {
    if (get_option(INNOTECH_HOME_HERO_OPTION) !== false) {
        return;
    }

    update_option(INNOTECH_HOME_HERO_OPTION, array(
        'en' => array(
            'title' => 'INNOVATION AI ASSISTANT',
            'description' => 'AI-Powered Expertise in Technology, Market & Product Development',
            'linkLabel' => 'Read more',
        ),
        'ar' => innotech_home_hero_defaults(),
        'tr' => innotech_home_hero_defaults(),
    ), false);
}
add_action('admin_init', 'innotech_seed_home_hero');
