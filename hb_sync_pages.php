<?php

declare(strict_types=1);

$mysqli = mysqli_init();
if (! $mysqli) {
    fwrite(STDERR, "Failed to initialize MySQLi.\n");
    exit(1);
}

$socket = '/Users/benjamincaron/Library/Application Support/Local/run/scEvLs8pJ/mysql/mysqld.sock';
if (! $mysqli->real_connect(null, 'root', 'root', 'local', null, $socket)) {
    fwrite(STDERR, "Database connection failed: " . mysqli_connect_error() . "\n");
    exit(1);
}

$mysqli->set_charset('utf8mb4');

function esc(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function page_url(string $path): string
{
    return 'https://hazzan-bouchareu-avocats.local/' . ltrim($path, '/');
}

function common_styles(): string
{
    return <<<HTML
<style>
.hb-editorial-page {
  --hb-bg: #f2ede9;
  --hb-bg-soft: #f7f3ef;
  --hb-bg-deep: #e7ddd4;
  --hb-ink: #111111;
  --hb-muted: rgba(17, 17, 17, 0.72);
  --hb-faint: rgba(17, 17, 17, 0.14);
  --hb-white: #fbf8f4;
  --hb-radius: 0px;
  color: var(--hb-ink);
  background:
    radial-gradient(circle at top left, rgba(255,255,255,0.55), transparent 32%),
    linear-gradient(180deg, #efe7df 0%, #f6f1eb 18%, #f2ede9 55%, #ece3db 100%);
  font-family: "FSBenjaminProLight", sans-serif;
}
.hb-editorial-page * {
  box-sizing: border-box;
}
.hb-editorial-page a {
  color: inherit;
}
.hb-shell {
  width: min(1120px, calc(100vw - 48px));
  margin: 0 auto;
}
.hb-hero {
  position: relative;
  overflow: hidden;
  padding: 140px 0 84px;
  min-height: 85vh;
  display: flex;
  align-items: flex-end;
}
.hb-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.46), transparent 45%),
    radial-gradient(circle at 84% 18%, rgba(17,17,17,0.07), transparent 0 26%);
  pointer-events: none;
}
.hb-kicker,
.hb-meta,
.hb-chip {
  font-family: "Presicav", sans-serif;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.hb-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 28px;
  color: var(--hb-muted);
}
.hb-kicker::before {
  content: "";
  width: 34px;
  height: 1px;
  background: currentColor;
}
.hb-hero-grid,
.hb-split,
.hb-grid-2,
.hb-grid-3,
.hb-grid-4,
.hb-footer-cta {
  display: grid;
  gap: 28px;
}
.hb-hero-grid {
  grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr);
  align-items: end;
}
.hb-meta {
  color: var(--hb-muted);
}
.hb-meta strong {
  display: block;
  color: var(--hb-ink);
  margin-top: 10px;
  font-size: 13px;
  letter-spacing: 0.12em;
}
.hb-editorial-page h1,
.hb-editorial-page h2,
.hb-editorial-page h3,
.hb-editorial-page h4 {
  margin: 0;
  color: var(--hb-ink);
}
.hb-editorial-page h1 {
  font-family: "FSBenjamin-Regular", serif;
  font-size: clamp(2.9rem, 7vw, 6.5rem);
  line-height: 0.95;
  text-transform: uppercase;
  letter-spacing: -0.03em;
}
.hb-editorial-page h2 {
  font-family: "FSBenjaminProRegular", serif;
  font-size: clamp(2rem, 4vw, 3.55rem);
  line-height: 0.98;
  text-transform: uppercase;
}
.hb-editorial-page h3 {
  font-family: "Presicav", sans-serif;
  font-size: 0.84rem;
  line-height: 1.4;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.hb-editorial-page h4 {
  font-family: "FSBenjaminProRegular", serif;
  font-size: clamp(1.35rem, 2vw, 2rem);
  line-height: 1.08;
}
.hb-intro,
.hb-text,
.hb-list,
.hb-card p,
.hb-portrait-copy,
.hb-note {
  font-size: 1.03rem;
  line-height: 1.7;
  color: var(--hb-muted);
}
.hb-intro {
  max-width: 42rem;
  margin-top: 24px;
}
.hb-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 34px;
}
.hb-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 24px;
  border: 1px solid transparent;
  text-decoration: none;
  font-family: "Presicav", sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  transition: transform 180ms ease, background-color 180ms ease, border-color 180ms ease;
}
.hb-button:hover {
  transform: translateY(-1px);
}
.hb-button--primary {
  background: #111111;
  color: #f7f1eb;
}
.hb-button--secondary {
  border-color: rgba(17,17,17,0.18);
  background: rgba(255,255,255,0.45);
  backdrop-filter: blur(12px);
}
.hb-section {
  padding: 76px 0;
}
.hb-section--panel {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.52), rgba(255,255,255,0.12)),
    var(--hb-bg-soft);
}
.hb-section--deep {
  background:
    linear-gradient(135deg, rgba(17,17,17,0.03), transparent 44%),
    var(--hb-bg-deep);
}
.hb-split {
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  align-items: start;
}
.hb-grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.hb-grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.hb-grid-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.hb-card,
.hb-portrait,
.hb-link-card,
.hb-contact-card {
  position: relative;
  padding: 28px;
  border: 1px solid var(--hb-faint);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.18)),
    rgba(255,255,255,0.34);
}
.hb-card > * + *,
.hb-contact-card > * + *,
.hb-portrait-copy > * + * {
  margin-top: 14px;
}
.hb-card p,
.hb-contact-card p,
.hb-note {
  margin: 0;
}
.hb-list,
.hb-bullets {
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}
.hb-list li,
.hb-bullets li {
  position: relative;
  padding-left: 18px;
}
.hb-list li + li,
.hb-bullets li + li {
  margin-top: 12px;
}
.hb-list li::before,
.hb-bullets li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.82em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(17,17,17,0.52);
}
.hb-link-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  min-height: 260px;
  text-decoration: none;
}
.hb-link-card .hb-chip {
  color: var(--hb-muted);
}
.hb-link-card:hover {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.74), rgba(255,255,255,0.28)),
    rgba(255,255,255,0.42);
}
.hb-link-line {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: "Presicav", sans-serif;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.hb-link-line::after {
  content: "→";
}
.hb-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(17,17,17,0.16), rgba(17,17,17,0.04));
  margin: 26px 0;
}
.hb-feature-card {
  padding: 32px 24px 26px;
  min-height: 220px;
  border-left: 1px solid rgba(17,17,17,0.12);
  background: rgba(255,255,255,0.16);
}
.hb-feature-card:first-child {
  border-left: 0;
}
.hb-feature-card > * + * {
  margin-top: 14px;
}
.hb-feature-card p {
  margin: 0;
}
.hb-inverse {
  background:
    radial-gradient(circle at top right, rgba(255,255,255,0.08), transparent 0 22%),
    linear-gradient(180deg, #121212 0%, #191919 100%);
  color: #f6efe8;
}
.hb-inverse .hb-kicker,
.hb-inverse .hb-meta,
.hb-inverse .hb-note,
.hb-inverse p,
.hb-inverse li,
.hb-inverse h2,
.hb-inverse h3,
.hb-inverse h4 {
  color: inherit;
}
.hb-inverse .hb-button--primary {
  background: #f6efe8;
  color: #111111;
}
.hb-inverse .hb-button--secondary {
  border-color: rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  color: #f6efe8;
}
.hb-portrait-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
}
.hb-portrait img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  filter: saturate(0.92) contrast(1.02);
}
.hb-portrait-copy {
  padding-top: 20px;
}
.hb-contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 28px;
}
.hb-contact-links a {
  text-decoration: none;
  border-bottom: 1px solid rgba(17,17,17,0.18);
}
.hb-page-index {
  display: grid;
  gap: 18px;
}
.hb-page-index-group {
  padding: 22px 0 0;
  border-top: 1px solid rgba(17,17,17,0.12);
}
.hb-page-index-group:first-child {
  border-top: 0;
  padding-top: 0;
}
.hb-page-index ul {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: grid;
  gap: 10px;
}
.hb-page-index a {
  text-decoration: none;
}
@media (max-width: 980px) {
  .hb-hero {
    min-height: auto;
    padding-top: 104px;
  }
  .hb-hero-grid,
  .hb-split,
  .hb-contact-grid,
  .hb-grid-2,
  .hb-grid-3,
  .hb-grid-4,
  .hb-portrait-grid {
    grid-template-columns: 1fr;
  }
  .hb-feature-card {
    border-left: 0;
    border-top: 1px solid rgba(17,17,17,0.12);
  }
  .hb-feature-card:first-child {
    border-top: 0;
  }
  .hb-shell {
    width: min(1120px, calc(100vw - 32px));
  }
}
</style>
HTML;
}

function button_html(string $label, string $url, string $variant = 'primary'): string
{
    $class = $variant === 'secondary' ? 'hb-button hb-button--secondary' : 'hb-button hb-button--primary';
    return '<a class="' . $class . '" href="' . esc($url) . '">' . esc($label) . '</a>';
}

function list_html(array $items, string $class = 'hb-list'): string
{
    $html = '<ul class="' . $class . '">';
    foreach ($items as $item) {
        $html .= '<li>' . esc($item) . '</li>';
    }
    return $html . '</ul>';
}

function link_cards_html(array $cards): string
{
    $html = '<div class="hb-grid-2">';
    foreach ($cards as $card) {
        $html .= '<a class="hb-link-card" href="' . esc($card['url']) . '">';
        $html .= '<div>';
        $html .= '<div class="hb-chip">' . esc($card['chip']) . '</div>';
        $html .= '<h4>' . esc($card['title']) . '</h4>';
        $html .= '<p>' . esc($card['text']) . '</p>';
        $html .= '</div>';
        $html .= '<span class="hb-link-line">' . esc($card['cta']) . '</span>';
        $html .= '</a>';
    }
    return $html . '</div>';
}

function section_split(string $kicker, string $title, string $body, string $extra = ''): string
{
    return <<<HTML
<section class="hb-section">
  <div class="hb-shell hb-split">
    <div>
      <p class="hb-kicker">{$kicker}</p>
      <h2>{$title}</h2>
    </div>
    <div class="hb-text">
      <p>{$body}</p>
      {$extra}
    </div>
  </div>
</section>
HTML;
}

function footer_band(string $buttons, string $title, string $text): string
{
    return <<<HTML
<section class="hb-section hb-inverse">
  <div class="hb-shell hb-split">
    <div>
      <p class="hb-kicker">Continuer</p>
      <h2>{$title}</h2>
    </div>
    <div>
      <p class="hb-text">{$text}</p>
      <div class="hb-actions">
        {$buttons}
      </div>
    </div>
  </div>
</section>
HTML;
}

function render_base_page(array $page): string
{
    $buttons = '<div class="hb-actions">'
        . button_html($page['cta_primary']['label'], $page['cta_primary']['url'], 'primary')
        . button_html($page['cta_secondary']['label'], $page['cta_secondary']['url'], 'secondary')
        . '</div>';

    $html = common_styles();
    $html .= '<div class="hb-editorial-page">';
    $html .= '<section class="hb-hero"><div class="hb-shell">';
    $html .= '<p class="hb-kicker">' . esc($page['kicker']) . '</p>';
    $html .= '<div class="hb-hero-grid">';
    $html .= '<div class="hb-meta">' . esc($page['meta']) . '<strong>' . esc($page['meta_title']) . '</strong></div>';
    $html .= '<div><h1>' . $page['h1_html'] . '</h1><p class="hb-intro">' . esc($page['intro']) . '</p>' . $buttons . '</div>';
    $html .= '</div></div></section>';
    $html .= $page['body_html'];
    $html .= '</div>';

    return $html;
}

function render_sphere_page(array $page): string
{
    $cards = link_cards_html($page['cards']);
    $expertiseCards = '<div class="hb-grid-3">';
    foreach ($page['expertises'] as $expertise) {
        $expertiseCards .= '<div class="hb-card"><p class="hb-kicker">Expertise</p><h4>' . esc($expertise) . '</h4></div>';
    }
    $expertiseCards .= '</div>';

    $body = section_split(
        'Lecture transverse',
        esc($page['section_1_title']),
        esc($page['section_1_body_1']) . '</p><p>' . esc($page['section_1_body_2'])
    );

    $body .= <<<HTML
<section id="situations" class="hb-section hb-section--panel">
  <div class="hb-shell hb-split">
    <div>
      <p class="hb-kicker">Situations</p>
      <h2>{$page['section_2_title']}</h2>
    </div>
    <div>{$cards}</div>
  </div>
</section>
<section class="hb-section">
  <div class="hb-shell hb-split">
    <div>
      <p class="hb-kicker">Expertises</p>
      <h2>{$page['section_3_title']}</h2>
    </div>
    <div>{$expertiseCards}</div>
  </div>
</section>
HTML;

    if (! empty($page['footer_note'])) {
        $body .= footer_band(
            button_html($page['cta_primary']['label'], $page['cta_primary']['url'], 'primary')
            . button_html($page['cta_secondary']['label'], $page['cta_secondary']['url'], 'secondary'),
            'Une même exigence de cohérence.',
            esc($page['footer_note'])
        );
    }

    $page['body_html'] = $body;
    return render_base_page($page);
}

function render_hub_page(array $page): string
{
    $whenCards = '<div class="hb-grid-2">';
    foreach ($page['when'] as $item) {
        $whenCards .= '<div class="hb-card"><p>' . esc($item) . '</p></div>';
    }
    $whenCards .= '</div>';

    $expertises = '<div class="hb-grid-2">';
    foreach ($page['expertises'] as $item) {
        $expertises .= '<div class="hb-card"><p class="hb-kicker">Expertise associée</p><h4>' . esc($item) . '</h4></div>';
    }
    $expertises .= '</div>';

    $body = <<<HTML
<section class="hb-section">
  <div class="hb-shell hb-split">
    <div>
      <p class="hb-kicker">Quand nous intervenons</p>
      <h2>{$page['when_title']}</h2>
    </div>
    <div>{$whenCards}</div>
  </div>
</section>
<section class="hb-section hb-section--panel">
  <div class="hb-shell hb-split">
    <div>
      <p class="hb-kicker">Notre approche</p>
      <h2>{$page['approach_title']}</h2>
    </div>
    <div class="hb-text">
      <p>{$page['approach_1']}</p>
      <p>{$page['approach_2']}</p>
    </div>
  </div>
</section>
<section class="hb-section">
  <div class="hb-shell hb-split">
    <div>
      <p class="hb-kicker">Expertises associées</p>
      <h2>{$page['expertises_title']}</h2>
    </div>
    <div>{$expertises}</div>
  </div>
</section>
HTML;

    $body .= footer_band(
        button_html($page['cta_primary']['label'], $page['cta_primary']['url'], 'primary')
        . button_html($page['cta_secondary']['label'], $page['cta_secondary']['url'], 'secondary'),
        'Activer la bonne combinaison d’expertises.',
        "Nous construisons un cadre d'action lisible, juridiquement solide et durable, à partir de la situation réelle plutôt que d'un empilement de matières."
    );

    $page['body_html'] = $body;
    return render_base_page($page);
}

function render_institutional_page(array $page): string
{
    $body = '';
    foreach ($page['sections'] as $index => $section) {
        $panel = $index % 2 === 1 ? ' hb-section--panel' : '';
        $extra = '';
        if (! empty($section['list'])) {
            $extra = list_html($section['list'], 'hb-bullets');
        } elseif (! empty($section['body_2'])) {
            $extra = '<p>' . esc($section['body_2']) . '</p>';
        }

        $body .= <<<HTML
<section class="hb-section{$panel}">
  <div class="hb-shell hb-split">
    <div>
      <p class="hb-kicker">{$section['kicker']}</p>
      <h2>{$section['title']}</h2>
    </div>
    <div class="hb-text">
      <p>{$section['body_1']}</p>
      {$extra}
    </div>
  </div>
</section>
HTML;
    }

    if (! empty($page['cards'])) {
        $body .= <<<HTML
<section class="hb-section hb-section--deep">
  <div class="hb-shell">
    <div class="hb-portrait-grid">
      {$page['cards']}
    </div>
  </div>
</section>
HTML;
    }

    if (! empty($page['principles'])) {
        $body .= '<section class="hb-section hb-section--panel"><div class="hb-shell">';
        $body .= '<p class="hb-kicker">Repères</p><h2>' . esc($page['principles_title']) . '</h2>';
        $body .= '<div class="hb-grid-4" style="margin-top:32px;">';
        foreach ($page['principles'] as $principle) {
            $body .= '<article class="hb-feature-card">';
            $body .= '<p class="hb-kicker">' . esc($principle['kicker']) . '</p>';
            $body .= '<h4>' . esc($principle['title']) . '</h4>';
            $body .= '<p class="hb-note">' . esc($principle['text']) . '</p>';
            $body .= '</article>';
        }
        $body .= '</div></div></section>';
    }

    $body .= footer_band(
        button_html($page['cta_primary']['label'], $page['cta_primary']['url'], 'primary')
        . button_html($page['cta_secondary']['label'], $page['cta_secondary']['url'], 'secondary'),
        'Créer un cadre de travail fiable.',
        "La méthode, l'équipe et l'écosystème n'ont de sens que s'ils renforcent la lisibilité, la continuité et la qualité de l'accompagnement."
    );

    $page['body_html'] = $body;
    return render_base_page($page);
}

function render_expertise_page(array $page): string
{
    $body = <<<HTML
<section class="hb-section">
  <div class="hb-shell hb-split">
    <div>
      <p class="hb-kicker">Quand nous intervenons</p>
      <h2>Situations accompagnées</h2>
    </div>
    <div class="hb-text"><p>{$page['when']}</p></div>
  </div>
</section>
<section class="hb-section hb-section--panel">
  <div class="hb-shell hb-split">
    <div>
      <p class="hb-kicker">Notre approche</p>
      <h2>Une lecture cohérente</h2>
    </div>
    <div class="hb-text"><p>{$page['approach']}</p></div>
  </div>
</section>
<section class="hb-section">
  <div class="hb-shell hb-split">
    <div>
      <p class="hb-kicker">Page de rattachement</p>
      <h2>Continuer la lecture</h2>
    </div>
    <div class="hb-text">
      <div class="hb-card">
        <h4>{$page['parent_title']}</h4>
        <p>{$page['parent_copy']}</p>
        <div class="hb-actions">
          <a class="hb-button hb-button--secondary" href="{$page['parent_url']}">Revenir à la page de rattachement</a>
        </div>
      </div>
    </div>
  </div>
</section>
HTML;

    $page['body_html'] = $body;
    return render_base_page($page);
}

function render_contact_page(array $page): string
{
    $body = <<<HTML
<section class="hb-section">
  <div class="hb-shell hb-contact-grid">
    <div class="hb-contact-card">
      <p class="hb-kicker">Premier échange</p>
      <h2>{$page['exchange_title']}</h2>
      <p>{$page['exchange_body']}</p>
      <p>{$page['exchange_body_2']}</p>
      <div class="hb-actions">
        <a class="hb-button hb-button--primary" href="mailto:david.hazzan@h-b-avocats.fr,julie.bouchareu@h-b-avocats.fr">Écrire au cabinet</a>
        <a class="hb-button hb-button--secondary" href="tel:+33491220228">Appeler le cabinet</a>
      </div>
    </div>
    <div class="hb-contact-card hb-contact-links">
      <p class="hb-kicker">Informations pratiques</p>
      <h2>{$page['info_title']}</h2>
      <p>Cabinet d'avocats à Marseille, sur rendez-vous.</p>
      <p>Téléphone : <a href="tel:+33491220228">04 91 22 02 28</a></p>
      <p>E-mails :<br><a href="mailto:david.hazzan@h-b-avocats.fr">david.hazzan@h-b-avocats.fr</a><br><a href="mailto:julie.bouchareu@h-b-avocats.fr">julie.bouchareu@h-b-avocats.fr</a></p>
      <p>Accueil du secrétariat : du lundi au vendredi, 9h à 12h30 et 14h à 17h30.</p>
    </div>
  </div>
</section>
HTML;

    $body .= footer_band(
        button_html('Écrire au cabinet', 'mailto:david.hazzan@h-b-avocats.fr,julie.bouchareu@h-b-avocats.fr', 'primary')
        . button_html('Appeler le cabinet', 'tel:+33491220228', 'secondary'),
        'Ouvrir un premier échange.',
        'Chaque prise de contact a pour objectif de clarifier la situation, poser un cadre de travail adapté et déterminer le bon niveau d’intervention.'
    );

    $page['body_html'] = $body;
    return render_base_page($page);
}

function render_team_page(array $page): string
{
    $cards = <<<HTML
<article class="hb-portrait">
  <img src="https://hazzan-bouchareu-avocats.local/wp-content/uploads/2026/03/David-HAZZAN-Avocat-1.jpg" alt="David Hazzan">
  <div class="hb-portrait-copy">
    <p class="hb-kicker">Avocat associé</p>
    <h4>David Hazzan</h4>
    <p>David Hazzan déploie toute son énergie au service de ses clients depuis plus de 30 ans. Il les accompagne avec une grande disponibilité et une approche structurée, attentive autant aux décisions immédiates qu’à leurs effets dans le temps.</p>
  </div>
</article>
<article class="hb-portrait">
  <img src="https://hazzan-bouchareu-avocats.local/wp-content/uploads/2026/04/Julie-BOUCHAREU-Avocat-1.jpg" alt="Julie Bouchareu">
  <div class="hb-portrait-copy">
    <p class="hb-kicker">Avocat associée</p>
    <h4>Julie Bouchareu</h4>
    <p>Julie Bouchareu accompagne avec exigence ses clients depuis plus de 15 ans. Sa pratique conjugue rigueur, sens du détail et lecture transversale des enjeux, avec pour objectif constant la clarté du conseil comme à la qualité de la défense.</p>
  </div>
</article>
HTML;

    $page['sections'][1]['body_2'] = 'Chaque profil détaillé pourra ensuite être décliné à partir du gabarit individuel prévu dans l’arborescence du site.';
    $page['cards'] = $cards;
    return render_institutional_page($page);
}

function render_expertises_landing(array $page): string
{
    $groupsHtml = '<div class="hb-page-index">';
    foreach ($page['groups'] as $group) {
        $groupsHtml .= '<div class="hb-page-index-group">';
        $groupsHtml .= '<p class="hb-kicker">' . esc($group['kicker']) . '</p>';
        $groupsHtml .= '<h4>' . esc($group['title']) . '</h4>';
        $groupsHtml .= '<ul>';
        foreach ($group['links'] as $link) {
            $groupsHtml .= '<li><a href="' . esc($link['url']) . '">' . esc($link['label']) . '</a></li>';
        }
        $groupsHtml .= '</ul></div>';
    }
    $groupsHtml .= '</div>';

    $body = <<<HTML
<section class="hb-section">
  <div class="hb-shell hb-split">
    <div>
      <p class="hb-kicker">Navigation secondaire</p>
      <h2>Accéder aux matières</h2>
    </div>
    <div class="hb-text">
      <p>{$page['section_body']}</p>
      {$groupsHtml}
    </div>
  </div>
</section>
HTML;

    $body .= footer_band(
        button_html($page['cta_primary']['label'], $page['cta_primary']['url'], 'primary')
        . button_html($page['cta_secondary']['label'], $page['cta_secondary']['url'], 'secondary'),
        'Les matières ne valent que par leur coordination.',
        "L'enjeu n'est pas d'empiler des réponses techniques mais d'activer les expertises utiles au bon moment, dans un cadre global et lisible."
    );

    $page['body_html'] = $body;
    return render_base_page($page);
}

function divi_json(array $attrs): string
{
    return json_encode($attrs, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

function divi_self(string $type, array $attrs): string
{
    return '<!-- wp:divi/' . $type . ' ' . divi_json($attrs) . ' /-->' . "\n";
}

function divi_open(string $type, array $attrs): string
{
    return '<!-- wp:divi/' . $type . ' ' . divi_json($attrs) . ' -->' . "\n";
}

function divi_close(string $type): string
{
    return '<!-- /wp:divi/' . $type . ' -->' . "\n";
}

function divi_text_module(string $html, string $kind = 'body'): string
{
    $module = [
        'decoration' => [
            'animation' => [
                'desktop' => [
                    'value' => [
                        'style' => 'fade',
                    ],
                ],
            ],
        ],
    ];
    $root = [
        'content' => [
            'innerContent' => [
                'desktop' => ['value' => $html],
            ],
        ],
        'builderVersion' => '5.0.3',
    ];

    if ($kind === 'kicker') {
        $module['decoration']['bodyFont']['body']['font']['desktop']['value'] = [
            'style' => ['uppercase'],
            'size' => '10px',
            'letterSpacing' => '1.2px',
            'lineHeight' => '1.5em',
        ];
        $module['decoration']['spacing']['desktop']['value']['margin'] = [
            'bottom' => '10px',
            'syncVertical' => 'off',
            'syncHorizontal' => 'off',
        ];
        $root['css']['desktop']['value']['freeForm'] = "selector p{font-family:'Presicav',sans-serif;color:#111111;opacity:0.72;}";
    } elseif ($kind === 'h1') {
        $module['decoration']['headingFont']['h1']['font']['desktop']['value'] = [
            'style' => ['uppercase'],
            'size' => '4.8vw',
            'lineHeight' => '0.95em',
            'letterSpacing' => '-1px',
        ];
        $module['decoration']['spacing']['desktop']['value']['margin'] = [
            'top' => '8px',
            'bottom' => '18px',
            'syncVertical' => 'off',
            'syncHorizontal' => 'off',
        ];
        $module['decoration']['animation']['desktop']['value']['delay'] = '200ms';
        $root['css']['desktop']['value']['freeForm'] = "selector h1{font-family:'FSBenjamin-Regular';color:#111111;}";
    } elseif ($kind === 'h2') {
        $module['decoration']['headingFont']['h2']['font']['desktop']['value'] = [
            'style' => ['uppercase'],
            'size' => '3.2vw',
            'lineHeight' => '0.98em',
        ];
        $module['decoration']['spacing']['desktop']['value']['margin'] = [
            'bottom' => '22px',
            'syncVertical' => 'off',
            'syncHorizontal' => 'off',
        ];
        $module['decoration']['animation']['desktop']['value']['style'] = 'slide';
        $module['decoration']['animation']['desktop']['value']['direction'] = 'top';
        $module['decoration']['animation']['desktop']['value']['intensity'] = ['slide' => '2%'];
        $root['css']['desktop']['value']['freeForm'] = "selector h2{font-family:'FSBenjaminProRegular';color:#111111;}";
    } elseif ($kind === 'h3') {
        $module['decoration']['headingFont']['h3']['font']['desktop']['value'] = [
            'style' => ['uppercase'],
            'size' => '14px',
            'letterSpacing' => '1.1px',
            'lineHeight' => '1.4em',
        ];
        $module['decoration']['spacing']['desktop']['value']['margin'] = [
            'bottom' => '10px',
            'syncVertical' => 'off',
            'syncHorizontal' => 'off',
        ];
        $root['css']['desktop']['value']['freeForm'] = "selector h3{font-family:'Presicav',sans-serif;color:#111111;}";
    } elseif ($kind === 'h4') {
        $module['decoration']['headingFont']['h4']['font']['desktop']['value'] = [
            'size' => '1.8vw',
            'lineHeight' => '1.08em',
        ];
        $module['decoration']['spacing']['desktop']['value']['margin'] = [
            'bottom' => '12px',
            'syncVertical' => 'off',
            'syncHorizontal' => 'off',
        ];
        $module['decoration']['animation']['desktop']['value']['style'] = 'slide';
        $module['decoration']['animation']['desktop']['value']['direction'] = 'top';
        $module['decoration']['animation']['desktop']['value']['intensity'] = ['slide' => '2%'];
        $root['css']['desktop']['value']['freeForm'] = "selector h4{font-family:'FSBenjaminProRegular';color:#111111;}";
    } elseif ($kind === 'body' || $kind === 'list') {
        $module['decoration']['bodyFont']['body']['font']['desktop']['value'] = [
            'size' => '18px',
            'lineHeight' => '1.65em',
        ];
        $module['decoration']['spacing']['desktop']['value']['margin'] = [
            'bottom' => '14px',
            'syncVertical' => 'off',
            'syncHorizontal' => 'off',
        ];
        $module['decoration']['animation']['desktop']['value']['style'] = 'slide';
        $module['decoration']['animation']['desktop']['value']['direction'] = 'top';
        $module['decoration']['animation']['desktop']['value']['intensity'] = ['slide' => '2%'];
        $root['css']['desktop']['value']['freeForm'] = "selector p,selector li{font-family:'FSBenjaminProLight';color:#111111;opacity:0.78;}";
    } elseif ($kind === 'inverse-h2') {
        $module['decoration']['headingFont']['h2']['font']['desktop']['value'] = [
            'style' => ['uppercase'],
            'size' => '3vw',
            'lineHeight' => '0.98em',
            'color' => '#f6efe8',
        ];
        $module['decoration']['spacing']['desktop']['value']['margin'] = [
            'bottom' => '18px',
            'syncVertical' => 'off',
            'syncHorizontal' => 'off',
        ];
        $root['css']['desktop']['value']['freeForm'] = "selector h2{font-family:'FSBenjaminProRegular';color:#f6efe8;}";
    } elseif ($kind === 'inverse-body') {
        $module['decoration']['bodyFont']['body']['font']['desktop']['value'] = [
            'size' => '18px',
            'lineHeight' => '1.65em',
            'color' => '#f6efe8',
        ];
        $module['decoration']['spacing']['desktop']['value']['margin'] = [
            'bottom' => '16px',
            'syncVertical' => 'off',
            'syncHorizontal' => 'off',
        ];
        $module['decoration']['animation']['desktop']['value']['style'] = 'slide';
        $module['decoration']['animation']['desktop']['value']['direction'] = 'top';
        $module['decoration']['animation']['desktop']['value']['intensity'] = ['slide' => '2%'];
        $root['css']['desktop']['value']['freeForm'] = "selector p,selector li{font-family:'FSBenjaminProLight';color:#f6efe8;opacity:0.9;}";
    }

    return divi_self('text', array_merge(['module' => $module], $root));
}

function divi_button_module(string $label, string $url, bool $secondary = false): string
{
    $module = [
        'decoration' => [
            'animation' => ['desktop' => ['value' => ['style' => 'fade', 'delay' => '350ms']]],
        ],
    ];

    $button = [
        'innerContent' => [
            'desktop' => ['value' => ['text' => $label, 'linkUrl' => $url]],
        ],
        'decoration' => [
            'button' => ['desktop' => ['value' => ['enable' => 'on']]],
            'border' => ['desktop' => ['value' => ['styles' => ['all' => ['width' => '0px']], 'radius' => ['topLeft' => '13px', 'topRight' => '13px', 'bottomLeft' => '13px', 'bottomRight' => '13px', 'sync' => 'on']]]],
            'font' => ['font' => ['desktop' => ['value' => ['style' => ['uppercase'], 'size' => '10px', 'letterSpacing' => '1.1px', 'color' => $secondary ? '#111111' : '#f6efe8']]]],
            'spacing' => ['desktop' => ['value' => ['padding' => ['top' => '12px', 'bottom' => '12px', 'left' => '34px', 'right' => '34px', 'syncVertical' => 'on', 'syncHorizontal' => 'on'], 'margin' => ['top' => '16px', 'right' => '12px', 'syncVertical' => 'off', 'syncHorizontal' => 'off']]]],
            'background' => ['desktop' => ['value' => $secondary ? ['color' => 'rgba(255,255,255,0.42)'] : ['gradient' => ['enabled' => 'on', 'direction' => '45deg', 'stops' => [['position' => '0', 'color' => 'rgba(242,237,233,0.16)'], ['position' => '50', 'color' => 'rgba(0,0,0,0.12)'], ['position' => '100', 'color' => 'rgba(242,237,233,0.16)']]]]]],
        ],
    ];

    if ($secondary) {
        $button['decoration']['border']['desktop']['value']['styles']['all'] = ['width' => '1px', 'color' => 'rgba(17,17,17,0.18)'];
    }

    return divi_self('button', [
        'module' => $module,
        'button' => $button,
        'builderVersion' => '5.0.3',
        'css' => ['desktop' => ['value' => ['mainElement' => "font-family:'Presicav',sans-serif;backdrop-filter: blur(8px);-webkit-backdrop-filter: blur(8px);"]]],
    ]);
}

function divi_image_module(string $src, string $title = '', string $alt = ''): string
{
    return divi_self('image', [
        'module' => [
            'decoration' => [
                'attributes' => [
                    'desktop' => [
                        'value' => [
                            'attributes' => [
                                ['id' => 'hbportrait', 'name' => 'class', 'value' => 'hb-portrait-reveal', 'adminLabel' => '', 'targetElement' => 'main'],
                            ],
                        ],
                    ],
                ],
                'animation' => [
                    'desktop' => [
                        'value' => [
                            'style' => 'fade',
                        ],
                    ],
                ],
            ],
        ],
        'image' => [
            'innerContent' => [
                'desktop' => ['value' => ['src' => $src, 'alt' => $alt, 'titleText' => $title]],
            ],
        ],
        'builderVersion' => '5.0.3',
    ]);
}

function divi_section_open(string $bgColor = '#f2ede9', string $top = '100px', string $bottom = '100px', array $extra = []): string
{
    $section = [
        'module' => [
            'decoration' => [
                'background' => ['desktop' => ['value' => ['color' => $bgColor]]],
                'spacing' => ['desktop' => ['value' => ['padding' => ['top' => $top, 'bottom' => $bottom, 'syncVertical' => 'off', 'syncHorizontal' => 'on']]]],
                'layout' => ['desktop' => ['value' => ['rowGap' => '0px']]],
            ],
        ],
        'builderVersion' => '5.0.3',
    ];
    if ($extra) {
        $section = array_replace_recursive($section, $extra);
    }
    return divi_open('section', $section);
}

function divi_row_open(string $structure = 'equal-columns_2', string $width = '86%', string $maxWidth = '1280px'): string
{
    return divi_open('row', [
        'module' => [
            'advanced' => ['flexColumnStructure' => ['desktop' => ['value' => $structure]]],
            'decoration' => [
                'layout' => ['desktop' => ['value' => ['flexWrap' => 'nowrap', 'columnGap' => '6%']]],
                'sizing' => ['desktop' => ['value' => ['width' => $width, 'maxWidth' => $maxWidth]]],
                'spacing' => ['desktop' => ['value' => ['margin' => ['top' => '0px', 'bottom' => '0px', 'syncVertical' => 'on', 'syncHorizontal' => 'off']]]],
            ],
        ],
        'builderVersion' => '5.0.3',
    ]);
}

function divi_column_open(string $flexType = '12_24'): string
{
    return divi_open('column', [
        'module' => [
            'decoration' => [
                'sizing' => ['desktop' => ['value' => ['flexType' => $flexType]]],
            ],
        ],
        'builderVersion' => '5.0.3',
    ]);
}

function divi_buttons_row(array $buttons): string
{
    $html = divi_row_open('equal-columns_1', '86%', '1280px');
    $html .= divi_column_open('24_24');
    foreach ($buttons as $button) {
        $html .= divi_button_module($button['label'], $button['url'], $button['secondary'] ?? false);
    }
    $html .= divi_close('column');
    $html .= divi_close('row');
    return $html;
}

function divi_split_section(string $bg, string $kicker, string $title, array $paragraphs): string
{
    $html = divi_section_open($bg, '96px', '96px');
    $html .= divi_row_open();
    $html .= divi_column_open('9_24');
    $html .= divi_text_module('<p>' . esc($kicker) . '</p>', 'kicker');
    $html .= divi_text_module('<h2>' . esc($title) . '</h2>', 'h2');
    $html .= divi_close('column');
    $html .= divi_column_open('15_24');
    foreach ($paragraphs as $paragraph) {
        $html .= divi_text_module('<p>' . esc($paragraph) . '</p>', 'body');
    }
    $html .= divi_close('column');
    $html .= divi_close('row');
    $html .= divi_close('section');
    return $html;
}

function divi_cards_section(string $bg, string $kicker, string $title, array $cards, int $perRow = 2): string
{
    $html = divi_section_open($bg, '96px', '96px');
    $html .= divi_row_open();
    $html .= divi_column_open('9_24');
    $html .= divi_text_module('<p>' . esc($kicker) . '</p>', 'kicker');
    $html .= divi_text_module('<h2>' . esc($title) . '</h2>', 'h2');
    $html .= divi_close('column');
    $html .= divi_column_open('15_24');

    $chunks = array_chunk($cards, $perRow);
    foreach ($chunks as $chunk) {
        $structure = match (count($chunk)) {
            1 => 'equal-columns_1',
            2 => 'equal-columns_2',
            3 => 'equal-columns_3',
            default => 'equal-columns_4',
        };
        $html .= divi_row_open($structure, '100%', '100%');
        foreach ($chunk as $card) {
            $flex = match (count($chunk)) {
                1 => '24_24',
                2 => '12_24',
                3 => '8_24',
                default => '6_24',
            };
            $html .= divi_column_open($flex);
            $html .= divi_text_module('<p>' . esc($card['kicker']) . '</p>', 'kicker');
            $html .= divi_text_module('<h4>' . esc($card['title']) . '</h4>', 'h4');
            if (! empty($card['text'])) {
                $html .= divi_text_module('<p>' . esc($card['text']) . '</p>', 'body');
            }
            if (! empty($card['url']) && ! empty($card['cta'])) {
                $html .= divi_button_module($card['cta'], $card['url'], true);
            }
            $html .= divi_close('column');
        }
        $html .= divi_close('row');
    }

    $html .= divi_close('column');
    $html .= divi_close('row');
    $html .= divi_close('section');
    return $html;
}

function divi_footer_band(string $title, string $text, array $buttons): string
{
    $html = divi_section_open('#111111', '110px', '110px');
    $html .= divi_row_open();
    $html .= divi_column_open('10_24');
    $html .= divi_text_module('<p>Continuer</p>', 'kicker');
    $html .= divi_text_module('<h2>' . esc($title) . '</h2>', 'inverse-h2');
    $html .= divi_close('column');
    $html .= divi_column_open('14_24');
    $html .= divi_text_module('<p>' . esc($text) . '</p>', 'inverse-body');
    foreach ($buttons as $button) {
        $html .= divi_button_module($button['label'], $button['url'], $button['secondary'] ?? false);
    }
    $html .= divi_close('column');
    $html .= divi_close('row');
    $html .= divi_close('section');
    return $html;
}

function render_divi_page(array $page): string
{
    $content = '<!-- wp:divi/placeholder -->';

    $content .= divi_section_open('#f2ede9', '140px', '72px', [
        'module' => [
            'decoration' => [
                'sizing' => ['desktop' => ['value' => ['height' => '85vh']]],
                'layout' => ['desktop' => ['value' => ['justifyContent' => 'flex-end', 'rowGap' => '0px']]],
                'attributes' => ['desktop' => ['value' => ['attributes' => [
                    ['id' => 'hbreveal', 'name' => 'class', 'value' => 'hb-section-reveal-vertical', 'adminLabel' => '', 'targetElement' => 'main'],
                ]]]],
            ],
        ],
    ]);
    $content .= divi_row_open();
    $content .= divi_column_open('8_24');
    $content .= divi_text_module('<p>' . esc($page['kicker']) . '</p>', 'kicker');
    $content .= divi_text_module('<p>' . esc($page['meta']) . '<br><strong>' . esc($page['meta_title']) . '</strong></p>', 'body');
    $content .= divi_close('column');
    $content .= divi_column_open('16_24');
    $content .= divi_text_module('<h1>' . $page['h1_html'] . '</h1>', 'h1');
    $content .= divi_text_module('<p>' . esc($page['intro']) . '</p>', 'body');
    $content .= divi_button_module($page['cta_primary']['label'], $page['cta_primary']['url'], false);
    $content .= divi_button_module($page['cta_secondary']['label'], $page['cta_secondary']['url'], true);
    $content .= divi_close('column');
    $content .= divi_close('row');
    $content .= divi_close('section');

    switch ($page['template']) {
        case 'sphere':
            $content .= divi_split_section('#fbf8f4', 'Lecture transverse', $page['section_1_title'], [$page['section_1_body_1'], $page['section_1_body_2']]);
            $cards = array_map(static fn($card) => ['kicker' => $card['chip'], 'title' => $card['title'], 'text' => $card['text'], 'cta' => $card['cta'], 'url' => $card['url']], $page['cards']);
            $content .= divi_cards_section('#f3eee9', 'Situations', $page['section_2_title'], $cards, 2);
            $expertiseCards = array_map(static fn($item) => ['kicker' => 'Expertise', 'title' => $item, 'text' => '', 'cta' => '', 'url' => ''], $page['expertises']);
            $content .= divi_cards_section('#fbf8f4', 'Expertises', $page['section_3_title'], $expertiseCards, 3);
            $content .= divi_footer_band('Une même exigence de cohérence.', $page['footer_note'], [
                ['label' => $page['cta_primary']['label'], 'url' => $page['cta_primary']['url'], 'secondary' => false],
                ['label' => $page['cta_secondary']['label'], 'url' => $page['cta_secondary']['url'], 'secondary' => true],
            ]);
            break;

        case 'hub':
            $whenCards = array_map(static fn($item) => ['kicker' => 'Situation', 'title' => $item, 'text' => '', 'cta' => '', 'url' => ''], $page['when']);
            $content .= divi_cards_section('#fbf8f4', 'Quand nous intervenons', $page['when_title'], $whenCards, 2);
            $content .= divi_split_section('#f3eee9', 'Notre approche', $page['approach_title'], [$page['approach_1'], $page['approach_2']]);
            $expertiseCards = array_map(static fn($item) => ['kicker' => 'Expertise associée', 'title' => $item, 'text' => '', 'cta' => '', 'url' => ''], $page['expertises']);
            $content .= divi_cards_section('#fbf8f4', 'Expertises associées', $page['expertises_title'], $expertiseCards, 2);
            $content .= divi_footer_band('Activer la bonne combinaison d’expertises.', "Nous construisons un cadre d'action lisible, juridiquement solide et durable, à partir de la situation réelle plutôt que d'un empilement de matières.", [
                ['label' => $page['cta_primary']['label'], 'url' => $page['cta_primary']['url'], 'secondary' => false],
                ['label' => $page['cta_secondary']['label'], 'url' => $page['cta_secondary']['url'], 'secondary' => true],
            ]);
            break;

        case 'institutional':
            foreach ($page['sections'] as $index => $section) {
                $paragraphs = [$section['body_1']];
                if (! empty($section['body_2'])) {
                    $paragraphs[] = $section['body_2'];
                }
                if (! empty($section['list'])) {
                    $paragraphs[] = implode(' · ', $section['list']);
                }
                $content .= divi_split_section($index % 2 === 1 ? '#f3eee9' : '#fbf8f4', $section['kicker'], $section['title'], $paragraphs);
            }
            if (! empty($page['principles'])) {
                $principleCards = array_map(static fn($item) => ['kicker' => $item['kicker'], 'title' => $item['title'], 'text' => $item['text'], 'cta' => '', 'url' => ''], $page['principles']);
                $content .= divi_cards_section('#f3eee9', 'Repères', $page['principles_title'], $principleCards, 4);
            }
            $content .= divi_footer_band('Créer un cadre de travail fiable.', "La méthode, l'équipe et l'écosystème n'ont de sens que s'ils renforcent la lisibilité, la continuité et la qualité de l'accompagnement.", [
                ['label' => $page['cta_primary']['label'], 'url' => $page['cta_primary']['url'], 'secondary' => false],
                ['label' => $page['cta_secondary']['label'], 'url' => $page['cta_secondary']['url'], 'secondary' => true],
            ]);
            break;

        case 'team':
            foreach ($page['sections'] as $index => $section) {
                $paragraphs = [$section['body_1']];
                if (! empty($section['body_2'])) {
                    $paragraphs[] = $section['body_2'];
                }
                $content .= divi_split_section($index % 2 === 1 ? '#f3eee9' : '#fbf8f4', $section['kicker'], $section['title'], $paragraphs);
            }
            $content .= divi_section_open('#fbf8f4', '96px', '96px');
            $content .= divi_row_open('equal-columns_2');
            $content .= divi_column_open('12_24');
            $content .= divi_image_module('https://hazzan-bouchareu-avocats.local/wp-content/uploads/2026/03/David-HAZZAN-Avocat-1.jpg', 'David Hazzan', 'David Hazzan');
            $content .= divi_text_module('<p>Avocat associé</p>', 'kicker');
            $content .= divi_text_module('<h4>David Hazzan</h4>', 'h4');
            $content .= divi_text_module("<p>David Hazzan déploie toute son énergie au service de ses clients depuis plus de 30 ans. Il les accompagne avec une grande disponibilité et une approche structurée, attentive autant aux décisions immédiates qu’à leurs effets dans le temps.</p>", 'body');
            $content .= divi_close('column');
            $content .= divi_column_open('12_24');
            $content .= divi_image_module('https://hazzan-bouchareu-avocats.local/wp-content/uploads/2026/04/Julie-BOUCHAREU-Avocat-1.jpg', 'Julie Bouchareu', 'Julie Bouchareu');
            $content .= divi_text_module('<p>Avocat associée</p>', 'kicker');
            $content .= divi_text_module('<h4>Julie Bouchareu</h4>', 'h4');
            $content .= divi_text_module("<p>Julie Bouchareu accompagne avec exigence ses clients depuis plus de 15 ans. Sa pratique conjugue rigueur, sens du détail et lecture transversale des enjeux, avec pour objectif constant la clarté du conseil comme à la qualité de la défense.</p>", 'body');
            $content .= divi_close('column');
            $content .= divi_close('row');
            $content .= divi_close('section');
            $content .= divi_footer_band('Rencontrer les personnes derrière la pratique.', "Chaque profil détaillé pourra ensuite être décliné à partir du gabarit individuel prévu dans l’arborescence du site.", [
                ['label' => $page['cta_primary']['label'], 'url' => $page['cta_primary']['url'], 'secondary' => false],
                ['label' => $page['cta_secondary']['label'], 'url' => $page['cta_secondary']['url'], 'secondary' => true],
            ]);
            break;

        case 'contact':
            $content .= divi_split_section('#fbf8f4', 'Premier échange', $page['exchange_title'], [$page['exchange_body'], $page['exchange_body_2']]);
            $contactCards = [
                ['kicker' => 'Téléphone', 'title' => '04 91 22 02 28', 'text' => 'Du lundi au vendredi, 9h à 12h30 et 14h à 17h30.', 'cta' => 'Appeler', 'url' => 'tel:+33491220228'],
                ['kicker' => 'E-mail', 'title' => 'Écrire au cabinet', 'text' => 'david.hazzan@h-b-avocats.fr · julie.bouchareu@h-b-avocats.fr', 'cta' => 'Écrire', 'url' => 'mailto:david.hazzan@h-b-avocats.fr,julie.bouchareu@h-b-avocats.fr'],
            ];
            $content .= divi_cards_section('#f3eee9', 'Informations pratiques', $page['info_title'], $contactCards, 2);
            $content .= divi_footer_band('Ouvrir un premier échange.', "Chaque prise de contact a pour objectif de clarifier la situation, poser un cadre de travail adapté et déterminer le bon niveau d’intervention.", [
                ['label' => 'Écrire au cabinet', 'url' => 'mailto:david.hazzan@h-b-avocats.fr,julie.bouchareu@h-b-avocats.fr', 'secondary' => false],
                ['label' => 'Appeler le cabinet', 'url' => 'tel:+33491220228', 'secondary' => true],
            ]);
            break;

        case 'expertise':
            $content .= divi_split_section('#fbf8f4', 'Quand nous intervenons', 'Situations accompagnées', [$page['when']]);
            $content .= divi_split_section('#f3eee9', 'Notre approche', 'Une lecture cohérente', [$page['approach']]);
            $content .= divi_cards_section('#fbf8f4', 'Page de rattachement', 'Continuer la lecture', [[
                'kicker' => 'Page liée',
                'title' => $page['parent_title'],
                'text' => $page['parent_copy'],
                'cta' => 'Revenir à la page de rattachement',
                'url' => $page['parent_url'],
            ]], 1);
            break;

        case 'expertises_landing':
            $content .= divi_split_section('#fbf8f4', 'Navigation secondaire', 'Accéder aux matières', [$page['section_body']]);
            foreach ($page['groups'] as $group) {
                $cards = array_map(static fn($link) => ['kicker' => $group['kicker'], 'title' => $link['label'], 'text' => '', 'cta' => 'Ouvrir la page', 'url' => $link['url']], $group['links']);
                $content .= divi_cards_section('#f3eee9', $group['kicker'], $group['title'], $cards, 2);
            }
            $content .= divi_footer_band('Les matières ne valent que par leur coordination.', "L'enjeu n'est pas d'empiler des réponses techniques mais d'activer les expertises utiles au bon moment, dans un cadre global et lisible.", [
                ['label' => $page['cta_primary']['label'], 'url' => $page['cta_primary']['url'], 'secondary' => false],
                ['label' => $page['cta_secondary']['label'], 'url' => $page['cta_secondary']['url'], 'secondary' => true],
            ]);
            break;

        default:
            break;
    }

    $content .= '<!-- /wp:divi/placeholder -->';
    return $content;
}

function render_page(array $page): string
{
    return render_divi_page($page);
}

$pages = [
    [
        'path' => 'entreprise',
        'title' => "L'Entreprise",
        'slug' => 'entreprise',
        'status' => 'publish',
        'template' => 'sphere',
        'kicker' => 'Ce que nous protégeons',
        'meta' => 'Page sphère',
        'meta_title' => "Une lecture globale de l'activité",
        'h1_html' => "L'Entreprise",
        'intro' => "Diriger une entreprise, c'est prendre des décisions qui engagent bien au-delà d'un seul domaine du droit. Nous accompagnons les dirigeants dans les moments qui structurent, développent ou fragilisent leur activité.",
        'cta_primary' => ['label' => 'Découvrir les situations accompagnées', 'url' => '#situations'],
        'cta_secondary' => ['label' => 'Nous parler de votre entreprise', 'url' => page_url('contact/')],
        'section_1_title' => "Une lecture transversale des enjeux de l'entreprise.",
        'section_1_body_1' => "Croissance, gouvernance, contractualisation, fiscalité, relations sociales, responsabilité : dans la pratique, ces sujets se croisent en permanence.",
        'section_1_body_2' => "Notre rôle est d'apporter un cadre clair, d'anticiper les points de tension et de coordonner les bons leviers au bon moment.",
        'section_2_title' => "Deux portes d'entrée selon la nature de votre situation.",
        'cards' => [
            ['chip' => 'Hub situationnel', 'title' => "Piloter & développer l'entreprise", 'text' => "Création, structuration, contrats, fiscalité opérationnelle, actifs immatériels, relations avec l'administration.", 'cta' => 'Ouvrir la page', 'url' => page_url('entreprise/piloter-et-developper-l-entreprise/')],
            ['chip' => 'Hub situationnel', 'title' => 'Gérer les ressources humaines & sociales', 'text' => 'Relations de travail, organisation sociale, contrôles, contentieux, protection sociale et prévention des risques.', 'cta' => 'Ouvrir la page', 'url' => page_url('entreprise/gerer-les-ressources-humaines-et-sociales/')],
        ],
        'section_3_title' => 'Expertises mobilisées selon les situations.',
        'expertises' => ['Droit des sociétés', 'Droit des affaires', 'Droit fiscal', 'Propriété intellectuelle', 'Droit public', 'Droit du travail', 'Droit de la sécurité sociale et de la protection sociale'],
        'footer_note' => "Les expertises n'interviennent jamais en silo : elles se croisent pour sécuriser les décisions structurantes, accompagner la croissance et limiter les angles morts.",
    ],
    [
        'path' => 'entreprise/piloter-et-developper-l-entreprise',
        'title' => "Piloter & développer l'entreprise",
        'slug' => 'piloter-et-developper-l-entreprise',
        'parent_path' => 'entreprise',
        'status' => 'publish',
        'template' => 'hub',
        'kicker' => 'Hub situationnel',
        'meta' => "Rattaché à L'Entreprise",
        'meta_title' => 'Croissance, structuration, décisions durables',
        'h1_html' => "Piloter &amp;<br>développer<br>l'entreprise",
        'intro' => "De la création à l'expansion, nous structurons votre activité pour qu'elle soit juridiquement robuste, fiscalement efficiente et durable.",
        'cta_primary' => ['label' => 'Accéder aux expertises liées', 'url' => page_url('expertises/')],
        'cta_secondary' => ['label' => 'Nous confier votre situation', 'url' => page_url('contact/')],
        'when_title' => 'Quand nous intervenons',
        'when' => ["Création ou structuration d'une société.", 'Évolution de la gouvernance ou réorganisation du capital.', 'Déploiement de contrats commerciaux ou partenariats stratégiques.', "Protection d'actifs immatériels et sécurisation de la marque.", "Relations avec l'administration, l'urbanisme ou les marchés publics."],
        'approach_title' => 'Une décision soutenable',
        'approach_1' => "Nous abordons chaque décision de développement comme un ensemble cohérent : juridique, fiscal, contractuel et opérationnel.",
        'approach_2' => "La question n'est pas seulement de rendre une opération possible, mais de la rendre soutenable, lisible et sécurisée dans le temps.",
        'expertises_title' => 'Les expertises activées',
        'expertises' => ['Droit des sociétés', 'Droit des affaires', 'Droit fiscal - IS / TVA', 'Propriété intellectuelle', 'Droit public'],
    ],
    [
        'path' => 'entreprise/gerer-les-ressources-humaines-et-sociales',
        'title' => 'Gérer les ressources humaines & sociales',
        'slug' => 'gerer-les-ressources-humaines-et-sociales',
        'parent_path' => 'entreprise',
        'status' => 'publish',
        'template' => 'hub',
        'kicker' => 'Hub situationnel',
        'meta' => "Rattaché à L'Entreprise",
        'meta_title' => 'Le cadre social comme outil de continuité',
        'h1_html' => 'Gérer les<br>ressources<br>humaines &amp; sociales',
        'intro' => "Le capital humain est votre première richesse, et souvent votre premier risque juridique. Nous sécurisons vos relations individuelles et collectives.",
        'cta_primary' => ['label' => 'Accéder aux expertises liées', 'url' => page_url('expertises/')],
        'cta_secondary' => ['label' => 'Nous parler de votre organisation', 'url' => page_url('contact/')],
        'when_title' => 'Quand nous intervenons',
        'when' => ["Organisation des embauches et de la politique contractuelle.", "Gestion des ruptures, conflits individuels et contentieux prud'homaux.", "Mise en place ou évolution des instances représentatives du personnel.", 'Contrôles URSSAF, accidents du travail, risques professionnels et santé au travail.'],
        'approach_title' => 'Conformité, décision, anticipation',
        'approach_1' => "Nous travaillons à la fois sur la conformité, l'anticipation du risque et la capacité de l'entreprise à prendre une décision lisible et défendable.",
        'approach_2' => "L'objectif n'est pas seulement de réagir à un conflit, mais d'organiser un cadre social solide et durable.",
        'expertises_title' => 'Les expertises activées',
        'expertises' => ['Droit du travail', 'Droit de la sécurité sociale et de la protection sociale'],
    ],
    [
        'path' => 'patrimoine',
        'title' => 'Le Patrimoine',
        'slug' => 'patrimoine',
        'status' => 'publish',
        'template' => 'sphere',
        'kicker' => 'Ce que nous protégeons',
        'meta' => 'Page sphère',
        'meta_title' => 'Le lien entre actifs, famille et transmission',
        'h1_html' => 'Le<br>Patrimoine',
        'intro' => "Votre réussite professionnelle doit servir votre construction patrimoniale. Nous assurons la cohérence entre vos actifs professionnels, immobiliers et privés.",
        'cta_primary' => ['label' => 'Nous parler de votre patrimoine', 'url' => page_url('contact/')],
        'cta_secondary' => ['label' => 'Découvrir les expertises liées', 'url' => '#situations'],
        'section_1_title' => 'Une vision patrimoniale globale.',
        'section_1_body_1' => "Le patrimoine n'est pas une somme d'actifs séparés. Il se construit à l'intersection de la vie professionnelle, de la situation familiale, de la fiscalité et des projets de transmission.",
        'section_1_body_2' => 'Nous accompagnons cette cohérence avec une logique de long terme.',
        'section_2_title' => 'Ce que nous accompagnons',
        'cards' => [
            ['chip' => 'Actifs', 'title' => 'Structuration immobilière', 'text' => "Structuration immobilière et détention d'actifs, dans une logique de cohérence patrimoniale.", 'cta' => 'Voir le détail', 'url' => page_url('expertises/droit-immobilier/')],
            ['chip' => 'Transmission', 'title' => 'Arbitrages patrimoniaux & fiscaux', 'text' => 'Arbitrages patrimoniaux et fiscaux, préparation de la transmission et articulation entre patrimoine privé et activité professionnelle.', 'cta' => 'Voir le détail', 'url' => page_url('expertises/droit-fiscal-ir-ifi/')],
        ],
        'section_3_title' => 'Expertises mobilisées',
        'expertises' => ['Droit immobilier', 'Droit des successions', 'Droit fiscal - IR / IFI'],
        'footer_note' => 'La cohérence patrimoniale se joue autant dans la structure de détention que dans les décisions de transmission et la fiscalité personnelle du dirigeant.',
    ],
    [
        'path' => 'individu',
        'title' => "L'Individu",
        'slug' => 'individu',
        'status' => 'publish',
        'template' => 'sphere',
        'kicker' => 'Ce que nous protégeons',
        'meta' => 'Page sphère',
        'meta_title' => 'Clarté, protection, continuité',
        'h1_html' => "L'Individu",
        'intro' => "Parce que la vie n'est pas linéaire, nous sommes votre garde rapprochée pour affronter les conflits, les ruptures et les situations de crise.",
        'cta_primary' => ['label' => 'Nous parler de votre situation', 'url' => page_url('contact/')],
        'cta_secondary' => ['label' => 'Découvrir les expertises liées', 'url' => '#situations'],
        'section_1_title' => 'Lorsque la situation devient personnelle.',
        'section_1_body_1' => "Une procédure pénale, une séparation, un litige du quotidien ou un dommage corporel peuvent fragiliser bien au-delà du seul plan juridique.",
        'section_1_body_2' => 'Nous accompagnons ces moments avec la même exigence de clarté, de protection et de continuité.',
        'section_2_title' => 'Ce que nous accompagnons',
        'cards' => [
            ['chip' => 'Protection', 'title' => 'Défense pénale', 'text' => 'Défense pénale et protection du dirigeant lorsque la situation professionnelle engage la responsabilité personnelle.', 'cta' => 'Voir le détail', 'url' => page_url('expertises/droit-penal/')],
            ['chip' => 'Équilibre', 'title' => 'Séparation & réorganisation familiale', 'text' => 'Séparation, divorce, réorganisation familiale et articulation avec les enjeux patrimoniaux ou professionnels.', 'cta' => 'Voir le détail', 'url' => page_url('expertises/droit-de-la-famille/')],
            ['chip' => 'Réparation', 'title' => 'Préjudice corporel', 'text' => 'Dommages corporels, responsabilité médicale, expertise et indemnisation du préjudice.', 'cta' => 'Voir le détail', 'url' => page_url('expertises/dommages-corporels-et-responsabilite-medicale/')],
            ['chip' => 'Litiges', 'title' => 'Protection du quotidien', 'text' => 'Litiges de consommation et situations de crise individuelle appelant une réponse claire et structurée.', 'cta' => 'Voir le détail', 'url' => page_url('expertises/droit-de-la-consommation/')],
        ],
        'section_3_title' => 'Expertises mobilisées',
        'expertises' => ['Droit pénal', 'Droit de la famille', 'Dommages corporels et responsabilité médicale', 'Droit de la consommation'],
        'footer_note' => "Même lorsqu'une situation semble strictement personnelle, ses effets débordent souvent sur les équilibres familiaux, patrimoniaux et professionnels.",
    ],
    [
        'path' => 'cabinet',
        'title' => 'Le cabinet',
        'slug' => 'cabinet',
        'status' => 'publish',
        'template' => 'institutional',
        'kicker' => 'Le Cabinet',
        'meta' => 'Page institutionnelle',
        'meta_title' => 'Coordination, clarté, continuité',
        'h1_html' => 'Le<br>cabinet',
        'intro' => "Hazzan & Bouchareu accompagne des dirigeants, des familles et des particuliers dans des situations qui exigent une lecture globale du droit. Notre pratique repose sur la coordination, la clarté et la continuité.",
        'cta_primary' => ['label' => 'Découvrir notre méthode', 'url' => page_url('cabinet/notre-methode/')],
        'cta_secondary' => ['label' => "Rencontrer l'équipe", 'url' => page_url('cabinet/equipe/')],
        'sections' => [
            ['kicker' => 'Positionnement', 'title' => 'Une pratique structurée, jamais fragmentée.', 'body_1' => "Nous ne concevons pas le droit comme une succession de réponses isolées. Nous le pratiquons comme un outil de cohérence au service des trajectoires de vie et d'activité.", 'body_2' => "Cette posture s'inscrit dans la lignée d'Entourage, tout en conservant l'autonomie et la responsabilité propres au cabinet."],
            ['kicker' => 'Ce qui nous distingue', 'title' => 'Une relation de travail lisible et engagée.', 'body_1' => "Notre manière d'accompagner tient autant à la qualité du cadre posé qu'à la continuité de la relation.", 'list' => ['Une lecture transversale des situations.', 'Un accompagnement dans la durée.', 'Une relation directe et engagée avec le client.', 'Une capacité à articuler les enjeux professionnels, patrimoniaux et personnels.']],
        ],
        'principles_title' => 'Quatre repères de pratique',
        'principles' => [
            ['kicker' => '1', 'title' => 'Lecture transversale', 'text' => 'Nous abordons chaque situation dans son ensemble, sans cloisonner artificiellement les enjeux.'],
            ['kicker' => '2', 'title' => 'Continuité', 'text' => 'Le suivi s’inscrit dans le temps et vise à éviter les ruptures de compréhension.'],
            ['kicker' => '3', 'title' => 'Clarté', 'text' => 'Nous posons un cadre explicite, partageable et défendable à chaque étape.'],
            ['kicker' => '4', 'title' => 'Engagement', 'text' => 'La relation client repose sur une implication directe et assumée du cabinet.'],
        ],
    ],
    [
        'path' => 'cabinet/notre-methode',
        'title' => 'Notre méthode',
        'slug' => 'notre-methode',
        'parent_path' => 'cabinet',
        'status' => 'publish',
        'template' => 'institutional',
        'kicker' => 'Le Cabinet',
        'meta' => 'Page institutionnelle',
        'meta_title' => 'Une méthode claire, structurée et humaine',
        'h1_html' => 'Notre<br>méthode',
        'intro' => "Une méthode claire, structurée et humaine, qui permet de traiter chaque situation dans sa globalité sans perdre la rigueur du cadre juridique.",
        'cta_primary' => ['label' => 'Prendre rendez-vous', 'url' => page_url('contact/')],
        'cta_secondary' => ['label' => 'Découvrir ce que nous protégeons', 'url' => page_url('entreprise/')],
        'sections' => [
            ['kicker' => 'Étape 1', 'title' => 'Comprendre la situation', 'body_1' => "Nous commençons toujours par un premier échange, physique ou téléphonique, afin de comprendre le contexte, la problématique et les attentes du client."],
            ['kicker' => 'Étape 2', 'title' => 'Clarifier et cadrer', 'body_1' => "À l'issue de ce premier échange, nous formalisons la problématique et demandons les pièces nécessaires afin de poser un cadre de travail clair, partagé et sécurisé."],
            ['kicker' => 'Étape 3', 'title' => 'Construire la stratégie', 'body_1' => "Le dossier est analysé dans sa globalité. Nous mobilisons les expertises nécessaires, présentons les options possibles et définissons les modalités d'intervention du cabinet."],
            ['kicker' => 'Étape 4', 'title' => 'Agir et accompagner dans la durée', 'body_1' => "Une fois la stratégie validée, nous mettons en œuvre les actions définies en lien étroit avec le client, qui reste informé du traitement de son dossier."],
        ],
    ],
    [
        'path' => 'cabinet/equipe',
        'title' => "L'équipe",
        'slug' => 'equipe',
        'parent_path' => 'cabinet',
        'status' => 'publish',
        'template' => 'team',
        'kicker' => 'Le Cabinet',
        'meta' => 'Page institutionnelle',
        'meta_title' => 'Des profils engagés, complémentaires, responsables',
        'h1_html' => "L'équipe",
        'intro' => "Un cabinet repose avant tout sur des personnes. L'équipe de Hazzan & Bouchareu rassemble des profils engagés dans une pratique du droit à la fois rigoureuse, lisible et humaine.",
        'cta_primary' => ['label' => 'Découvrir les profils', 'url' => '#profils'],
        'cta_secondary' => ['label' => 'Nous contacter', 'url' => page_url('contact/')],
        'sections' => [
            ['kicker' => 'Coordination', 'title' => 'Une complémentarité au service des situations.', 'body_1' => "Chaque membre du cabinet intervient dans une logique de coordination. Les expertises dialoguent entre elles pour construire une réponse adaptée à la situation réelle du client, et non à une matière isolée."],
            ['kicker' => 'Profils', 'title' => 'Des visages, une exigence commune.', 'body_1' => "Les portraits détaillés pourront ensuite être déclinés dans des pages individuelles structurées autour de la posture, des situations accompagnées et des expertises associées."],
        ],
    ],
    [
        'path' => 'cabinet/travailler-en-entourage',
        'title' => 'Travailler en entourage',
        'slug' => 'travailler-en-entourage',
        'parent_path' => 'cabinet',
        'status' => 'publish',
        'template' => 'institutional',
        'kicker' => 'Le Cabinet',
        'meta' => 'Page pont vers l’écosystème',
        'meta_title' => 'Un socle juridique, un cercle plus large',
        'h1_html' => 'Travailler en<br>entourage',
        'intro' => "Certaines situations dépassent le seul cadre d'un cabinet. Lorsqu'une vision plus large est nécessaire, Hazzan & Bouchareu s'inscrit dans la dynamique d'Entourage.",
        'cta_primary' => ['label' => "Découvrir l'esprit Entourage", 'url' => page_url('cabinet/travailler-en-entourage/')],
        'cta_secondary' => ['label' => 'Nous parler de votre situation', 'url' => page_url('contact/')],
        'sections' => [
            ['kicker' => 'Écosystème', 'title' => 'Un socle juridique, un cercle plus large.', 'body_1' => "Hazzan & Bouchareu constitue le socle juridique structurant : un cabinet d'avocats qui accompagne ses clients dans la durée, avec une approche globale, rigoureuse et coordonnée du droit.", 'body_2' => "Entourage est l'extension naturelle de cette philosophie. Il intervient lorsque les situations appellent un cercle élargi de compétences complémentaires."],
            ['kicker' => 'Vision commune', 'title' => 'Une même vision, des entités autonomes.', 'body_1' => "Au sein de cet ensemble, Hazzan & Bouchareu, Constance Avocats et Entourage partagent une même vision de l'accompagnement, tout en conservant chacun leur identité, leur pratique et leur autonomie."],
        ],
    ],
    [
        'path' => 'contact',
        'title' => 'Contact',
        'slug' => 'contact',
        'status' => 'publish',
        'template' => 'contact',
        'kicker' => 'Contact',
        'meta' => 'Page de conversion',
        'meta_title' => 'Un premier échange confidentiel',
        'h1_html' => 'Contact',
        'intro' => "Vous pouvez nous contacter pour un premier échange confidentiel, afin de présenter votre situation et de déterminer le cadre d'intervention le plus adapté.",
        'cta_primary' => ['label' => 'Prendre rendez-vous', 'url' => 'mailto:david.hazzan@h-b-avocats.fr,julie.bouchareu@h-b-avocats.fr'],
        'cta_secondary' => ['label' => 'Appeler le cabinet', 'url' => 'tel:+33491220228'],
        'exchange_title' => 'Présenter votre situation',
        'exchange_body' => "Le premier échange peut prendre la forme d'un appel, d'un rendez-vous physique au cabinet ou d'un rendez-vous téléphonique, selon la nature de votre besoin.",
        'exchange_body_2' => 'Nous posons ensuite le cadre le plus adapté pour la suite : orientation, demande de pièces, rendez-vous approfondi ou proposition de stratégie.',
        'info_title' => 'Le cabinet à Marseille',
    ],
    [
        'path' => 'expertises',
        'title' => 'Expertises',
        'slug' => 'expertises',
        'status' => 'publish',
        'template' => 'expertises_landing',
        'kicker' => 'Navigation secondaire',
        'meta' => 'Page utilitaire',
        'meta_title' => 'Matières mobilisées selon les situations',
        'h1_html' => 'Expertises',
        'intro' => "Les matières mobilisées ne sont jamais une fin en soi. Elles s'articulent autour des situations que nous accompagnons, qu'elles concernent l'entreprise, le patrimoine ou l'individu.",
        'cta_primary' => ['label' => 'Parler de votre situation', 'url' => page_url('contact/')],
        'cta_secondary' => ['label' => 'Revenir à la page d’accueil', 'url' => page_url('')],
        'section_body' => "Retrouvez ci-dessous les expertises rattachées aux différentes sphères du site.",
        'groups' => [
            ['kicker' => "L'Entreprise", 'title' => 'Piloter & développer', 'links' => [
                ['label' => 'Droit des sociétés', 'url' => page_url('expertises/droit-des-societes/')],
                ['label' => 'Droit des affaires', 'url' => page_url('expertises/droit-des-affaires/')],
                ['label' => 'Droit fiscal - IS / TVA', 'url' => page_url('expertises/droit-fiscal-is-tva/')],
                ['label' => 'Propriété intellectuelle', 'url' => page_url('expertises/propriete-intellectuelle/')],
                ['label' => 'Droit public', 'url' => page_url('expertises/droit-public/')],
            ]],
            ['kicker' => "L'Entreprise", 'title' => 'Ressources humaines & sociales', 'links' => [
                ['label' => 'Droit du travail', 'url' => page_url('expertises/droit-du-travail/')],
                ['label' => 'Droit de la sécurité sociale et de la protection sociale', 'url' => page_url('expertises/droit-de-la-securite-sociale-et-de-la-protection-sociale/')],
            ]],
            ['kicker' => 'Le Patrimoine', 'title' => 'Structurer, arbitrer, transmettre', 'links' => [
                ['label' => 'Droit immobilier', 'url' => page_url('expertises/droit-immobilier/')],
                ['label' => 'Droit des successions', 'url' => page_url('expertises/droit-des-successions/')],
                ['label' => 'Droit fiscal - IR / IFI', 'url' => page_url('expertises/droit-fiscal-ir-ifi/')],
            ]],
            ['kicker' => "L'Individu", 'title' => 'Protéger la personne', 'links' => [
                ['label' => 'Droit pénal', 'url' => page_url('expertises/droit-penal/')],
                ['label' => 'Droit de la famille', 'url' => page_url('expertises/droit-de-la-famille/')],
                ['label' => 'Dommages corporels et responsabilité médicale', 'url' => page_url('expertises/dommages-corporels-et-responsabilite-medicale/')],
                ['label' => 'Droit de la consommation', 'url' => page_url('expertises/droit-de-la-consommation/')],
            ]],
        ],
    ],
];

$expertisePages = [
    ['slug' => 'droit-des-societes', 'title' => 'Droit des sociétés', 'intro' => "Nous intervenons sur la création, la structuration et l'évolution des sociétés, avec une attention particulière portée à la cohérence de la gouvernance, du capital et des décisions structurantes.", 'when' => "Structuration d'activité, évolution de la gouvernance, réorganisation du capital, pactes, opérations de croissance.", 'approach' => "Cette matière est mobilisée comme un outil de construction et de stabilité, jamais isolément.", 'parent_title' => "Piloter & développer l'entreprise", 'parent_path' => 'entreprise/piloter-et-developper-l-entreprise', 'parent_copy' => "Cette expertise s'inscrit dans le hub situationnel dédié au pilotage et au développement de l'entreprise."],
    ['slug' => 'droit-des-affaires', 'title' => 'Droit des affaires', 'intro' => "Nous sécurisons les relations commerciales, contractuelles et partenariales qui soutiennent l'activité de l'entreprise.", 'when' => 'Contrats, négociation, partenariat, fournisseurs, clients, responsabilité commerciale.', 'approach' => "Nous travaillons le cadre contractuel comme une condition de lisibilité et de pérennité.", 'parent_title' => "Piloter & développer l'entreprise", 'parent_path' => 'entreprise/piloter-et-developper-l-entreprise', 'parent_copy' => "Cette expertise prolonge les décisions de structuration, de négociation et d'expansion de l'activité."],
    ['slug' => 'droit-fiscal-is-tva', 'title' => 'Droit fiscal - IS / TVA', 'intro' => "Nous accompagnons les entreprises dans les enjeux fiscaux liés à leur fonctionnement, à leur développement et à leurs arbitrages opérationnels.", 'when' => 'Fiscalité courante, structuration, optimisation du fonctionnement, contrôle et conformité.', 'approach' => "La fiscalité est intégrée à la stratégie globale de l'entreprise et non traitée comme un sujet autonome.", 'parent_title' => "Piloter & développer l'entreprise", 'parent_path' => 'entreprise/piloter-et-developper-l-entreprise', 'parent_copy' => "Cette expertise intervient en appui des décisions de croissance, de structuration et d'arbitrage opérationnel."],
    ['slug' => 'propriete-intellectuelle', 'title' => 'Propriété intellectuelle', 'intro' => "Nous protégeons les actifs immatériels qui participent à la valeur de l'entreprise : marque, nom, création, savoir-faire et signes distinctifs.", 'when' => 'Dépôt, protection, exploitation, défense et sécurisation des actifs de marque.', 'approach' => "La propriété intellectuelle est abordée comme un actif stratégique et non comme une simple formalité.", 'parent_title' => "Piloter & développer l'entreprise", 'parent_path' => 'entreprise/piloter-et-developper-l-entreprise', 'parent_copy' => "Cette expertise protège ce qui fonde la valeur, la singularité et la continuité de l'activité."],
    ['slug' => 'droit-public', 'title' => 'Droit public', 'intro' => "Nous accompagnons les relations avec l'administration et les enjeux publics qui peuvent conditionner le développement d'une activité.", 'when' => 'Urbanisme, autorisations, marchés publics, rapports avec les acteurs publics.', 'approach' => "Nous apportons une lecture claire d'environnements réglementaires souvent complexes.", 'parent_title' => "Piloter & développer l'entreprise", 'parent_path' => 'entreprise/piloter-et-developper-l-entreprise', 'parent_copy' => "Cette expertise intervient lorsque le développement d'une activité dépend d'autorisations, d'acteurs publics ou d'un cadre réglementaire spécifique."],
    ['slug' => 'droit-du-travail', 'title' => 'Droit du travail', 'intro' => "Nous sécurisons les relations individuelles et collectives de travail afin de donner à l'entreprise un cadre social clair et défendable.", 'when' => "Embauche, exécution du contrat, rupture, contentieux, dialogue social.", 'approach' => "Le droit du travail est abordé comme un enjeu humain, organisationnel et stratégique.", 'parent_title' => 'Gérer les ressources humaines & sociales', 'parent_path' => 'entreprise/gerer-les-ressources-humaines-et-sociales', 'parent_copy' => "Cette expertise s'inscrit dans le hub social, au plus près des décisions de recrutement, d'organisation et de gestion du risque humain."],
    ['slug' => 'droit-de-la-securite-sociale-et-de-la-protection-sociale', 'title' => 'Droit de la sécurité sociale et de la protection sociale', 'intro' => "Nous accompagnons les entreprises et les personnes sur les questions de protection sociale, de contrôle et de risques liés au travail.", 'when' => 'URSSAF, accidents du travail, maladies professionnelles, cotisations et contentieux associés.', 'approach' => "Nous intervenons avec une logique de sécurisation et d'anticipation du risque.", 'parent_title' => 'Gérer les ressources humaines & sociales', 'parent_path' => 'entreprise/gerer-les-ressources-humaines-et-sociales', 'parent_copy' => "Cette expertise prolonge la construction d'un cadre social solide, lisible et durable."],
    ['slug' => 'droit-immobilier', 'title' => 'Droit immobilier', 'intro' => "Nous accompagnons la structuration, la détention et la gestion d'actifs immobiliers dans une logique de cohérence patrimoniale.", 'when' => 'Acquisition, détention, SCI, gestion locative, arbitrages patrimoniaux.', 'approach' => "L'immobilier est traité comme une composante d'ensemble du patrimoine et de la stratégie familiale ou entrepreneuriale.", 'parent_title' => 'Le Patrimoine', 'parent_path' => 'patrimoine', 'parent_copy' => "Cette expertise s'intègre dans la lecture patrimoniale globale du cabinet."],
    ['slug' => 'droit-des-successions', 'title' => 'Droit des successions', 'intro' => "Nous préparons et accompagnons les transmissions pour sécuriser les équilibres familiaux, patrimoniaux et professionnels.", 'when' => "Anticipation, transmission d'entreprise, organisation successorale, conflits liés à l'héritage.", 'approach' => "Notre approche vise à concilier protection, lisibilité et continuité.", 'parent_title' => 'Le Patrimoine', 'parent_path' => 'patrimoine', 'parent_copy' => "Cette expertise structure la continuité patrimoniale et la préparation des transmissions."],
    ['slug' => 'droit-fiscal-ir-ifi', 'title' => 'Droit fiscal - IR / IFI', 'intro' => "Nous accompagnons la fiscalité personnelle du dirigeant et des particuliers dans une logique d'équilibre et de cohérence patrimoniale.", 'when' => "Arbitrages patrimoniaux, détention d'actifs, fiscalité personnelle et transmission.", 'approach' => "La fiscalité personnelle est envisagée dans son articulation avec les projets de vie et les actifs détenus.", 'parent_title' => 'Le Patrimoine', 'parent_path' => 'patrimoine', 'parent_copy' => "Cette expertise éclaire les décisions patrimoniales en lien avec la détention, l'arbitrage et la transmission."],
    ['slug' => 'droit-penal', 'title' => 'Droit pénal', 'intro' => "Nous défendons les personnes confrontées à une procédure pénale, y compris les dirigeants lorsque la situation professionnelle engage leur responsabilité personnelle.", 'when' => "Défense pénale, mise en cause du dirigeant, infractions connexes à l'activité ou à la vie personnelle.", 'approach' => "Nous intervenons avec gravité, clarté et protection.", 'parent_title' => "L'Individu", 'parent_path' => 'individu', 'parent_copy' => "Cette expertise protège la personne lorsque la situation devient sensible et engage sa responsabilité."],
    ['slug' => 'droit-de-la-famille', 'title' => 'Droit de la famille', 'intro' => "Nous accompagnons les séparations, réorganisations familiales et situations où l'équilibre privé a des conséquences patrimoniales ou professionnelles.", 'when' => "Divorce, séparation, résidence, prestations, articulation avec le patrimoine ou l'entreprise.", 'approach' => "Le droit de la famille est traité avec précision juridique et attention aux conséquences humaines.", 'parent_title' => "L'Individu", 'parent_path' => 'individu', 'parent_copy' => "Cette expertise prolonge l'accompagnement des ruptures, réorganisations et équilibres personnels."],
    ['slug' => 'dommages-corporels-et-responsabilite-medicale', 'title' => 'Dommages corporels et responsabilité médicale', 'intro' => "Nous accompagnons les victimes dans l'évaluation et la réparation des préjudices corporels, ainsi que dans les situations mettant en cause une responsabilité médicale.", 'when' => 'Accidents, faute médicale, expertise, indemnisation et suivi du préjudice.', 'approach' => "Nous intervenons avec une exigence de preuve et une forte attention au vécu de la personne.", 'parent_title' => "L'Individu", 'parent_path' => 'individu', 'parent_copy' => "Cette expertise protège la personne dans les situations de dommage, de réparation et de responsabilité."],
    ['slug' => 'droit-de-la-consommation', 'title' => 'Droit de la consommation', 'intro' => "Nous accompagnons les particuliers dans les litiges du quotidien nécessitant une protection claire de leurs droits.", 'when' => 'Contrats, services, achats, litiges et contestations.', 'approach' => "Cette expertise prolonge notre volonté de ne pas laisser l'individu seul face à une situation de tension.", 'parent_title' => "L'Individu", 'parent_path' => 'individu', 'parent_copy' => "Cette expertise apporte une réponse claire aux litiges du quotidien et aux situations de contestation."],
];

foreach ($expertisePages as $expertise) {
    $pages[] = [
        'path' => 'expertises/' . $expertise['slug'],
        'title' => $expertise['title'],
        'slug' => $expertise['slug'],
        'parent_path' => 'expertises',
        'status' => 'publish',
        'template' => 'expertise',
        'kicker' => 'Expertise',
        'meta' => 'Page matière',
        'meta_title' => 'Second niveau de navigation',
        'h1_html' => esc($expertise['title']),
        'intro' => $expertise['intro'],
        'cta_primary' => ['label' => 'Nous parler de votre situation', 'url' => page_url('contact/')],
        'cta_secondary' => ['label' => 'Revenir à la page de rattachement', 'url' => page_url($expertise['parent_path'] . '/')],
        'when' => $expertise['when'],
        'approach' => $expertise['approach'],
        'parent_title' => $expertise['parent_title'],
        'parent_url' => page_url($expertise['parent_path'] . '/'),
        'parent_copy' => $expertise['parent_copy'],
    ];
}

$pages[] = [
    'path' => 'cabinet/equipe/prenom-nom',
    'title' => 'Template - profil avocat individuel',
    'slug' => 'prenom-nom',
    'parent_path' => 'cabinet/equipe',
    'status' => 'draft',
    'template' => 'institutional',
    'kicker' => 'Gabarit',
    'meta' => 'Page profil individuelle',
    'meta_title' => 'À dupliquer après validation des biographies',
    'h1_html' => 'Prénom Nom',
    'intro' => 'Avocat, fonction à préciser.',
    'cta_primary' => ['label' => 'Contacter cet avocat', 'url' => page_url('contact/')],
    'cta_secondary' => ['label' => "Revenir à l'équipe", 'url' => page_url('cabinet/equipe/')],
    'sections' => [
        ['kicker' => 'Posture', 'title' => 'Une manière personnelle d’accompagner.', 'body_1' => "Texte de 3 à 5 lignes présentant la manière d'accompagner, le type de relation client et la vision personnelle du droit."],
        ['kicker' => 'Situations accompagnées', 'title' => 'Priorités de pratique', 'body_1' => 'Bloc listant les types de situations suivies en priorité, avec renvoi vers les hubs concernés.'],
        ['kicker' => 'Expertises associées', 'title' => 'Matières mobilisées', 'body_1' => 'Bloc de renvoi vers les matières concernées.'],
        ['kicker' => 'Parcours', 'title' => 'Formation et expérience', 'body_1' => 'Formation, expériences et éléments biographiques à confirmer.'],
    ],
];

usort($pages, static function (array $a, array $b): int {
    return substr_count($a['path'], '/') <=> substr_count($b['path'], '/');
});

function fetch_existing_pages(mysqli $mysqli): array
{
    $pages = [];
    $result = $mysqli->query("SELECT ID, post_parent, post_name, post_title, post_status FROM mod543_posts WHERE post_type = 'page'");
    while ($row = $result->fetch_assoc()) {
        $pages[(int) $row['ID']] = [
            'id' => (int) $row['ID'],
            'parent' => (int) $row['post_parent'],
            'slug' => $row['post_name'],
            'title' => $row['post_title'],
            'status' => $row['post_status'],
        ];
    }
    return $pages;
}

function build_path_map(array $pages): array
{
    $pathMap = [];
    $resolved = [];

    $resolve = function (int $id) use (&$resolve, &$pages, &$resolved): string {
        if (isset($resolved[$id])) {
            return $resolved[$id];
        }
        $page = $pages[$id];
        $slug = $page['slug'];
        if ($page['parent'] === 0) {
            return $resolved[$id] = $slug;
        }
        $parentPath = $resolve($page['parent']);
        return $resolved[$id] = $parentPath . '/' . $slug;
    };

    foreach (array_keys($pages) as $id) {
        $pathMap[$resolve($id)] = $id;
    }

    return $pathMap;
}

function ensure_post_meta(mysqli $mysqli, int $postId, string $metaKey, string $metaValue): void
{
    $escapedKey = $mysqli->real_escape_string($metaKey);
    $escapedValue = $mysqli->real_escape_string($metaValue);
    $exists = $mysqli->query("SELECT meta_id FROM mod543_postmeta WHERE post_id = {$postId} AND meta_key = '{$escapedKey}' LIMIT 1");
    if ($exists && $exists->num_rows > 0) {
        $mysqli->query("UPDATE mod543_postmeta SET meta_value = '{$escapedValue}' WHERE post_id = {$postId} AND meta_key = '{$escapedKey}'");
        return;
    }
    $mysqli->query("INSERT INTO mod543_postmeta (post_id, meta_key, meta_value) VALUES ({$postId}, '{$escapedKey}', '{$escapedValue}')");
}

function seo_title_for_page(array $page): string
{
    return $page['title'] . ' | Hazzan & Bouchareu Avocats à Marseille';
}

function seo_description_for_page(array $page): string
{
    return $page['intro'];
}

function seo_focus_keyword_for_page(array $page): string
{
    $title = mb_strtolower($page['title'], 'UTF-8');
    return $title . ' marseille';
}

$existingPages = fetch_existing_pages($mysqli);
$pathMap = build_path_map($existingPages);
$authorId = 1;
$now = date('Y-m-d H:i:s');

foreach ($pages as $page) {
    $parentId = 0;
    if (! empty($page['parent_path'])) {
        if (! isset($pathMap[$page['parent_path']])) {
            fwrite(STDERR, "Missing parent path: {$page['parent_path']}\n");
            exit(1);
        }
        $parentId = $pathMap[$page['parent_path']];
    }

    $content = render_page($page);
    $title = $mysqli->real_escape_string($page['title']);
    $slug = $mysqli->real_escape_string($page['slug']);
    $status = $mysqli->real_escape_string($page['status']);
    $contentEscaped = $mysqli->real_escape_string($content);
    $path = $page['path'];

    if (isset($pathMap[$path])) {
        $postId = $pathMap[$path];
        $mysqli->query("
            UPDATE mod543_posts
            SET post_title = '{$title}',
                post_content = '{$contentEscaped}',
                post_status = '{$status}',
                post_name = '{$slug}',
                post_parent = {$parentId},
                post_modified = '{$now}',
                post_modified_gmt = '{$now}'
            WHERE ID = {$postId}
            LIMIT 1
        ");
    } else {
        $mysqli->query("
            INSERT INTO mod543_posts (
                post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt,
                post_status, comment_status, ping_status, post_password, post_name, to_ping,
                pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent,
                guid, menu_order, post_type, post_mime_type, comment_count
            ) VALUES (
                {$authorId}, '{$now}', '{$now}', '{$contentEscaped}', '{$title}', '',
                '{$status}', 'closed', 'closed', '', '{$slug}', '',
                '', '{$now}', '{$now}', '', {$parentId},
                '', 0, 'page', '', 0
            )
        ");
        $postId = (int) $mysqli->insert_id;
        $guid = $mysqli->real_escape_string(page_url("?page_id={$postId}"));
        $mysqli->query("UPDATE mod543_posts SET guid = '{$guid}' WHERE ID = {$postId}");
    }

    ensure_post_meta($mysqli, $postId, '_wp_page_template', 'default');
    ensure_post_meta($mysqli, $postId, '_et_pb_use_builder', 'on');
    ensure_post_meta($mysqli, $postId, 'rank_math_title', seo_title_for_page($page));
    ensure_post_meta($mysqli, $postId, 'rank_math_description', seo_description_for_page($page));
    ensure_post_meta($mysqli, $postId, 'rank_math_focus_keyword', seo_focus_keyword_for_page($page));
    $pathMap[$path] = $postId;
}

echo "Synced " . count($pages) . " pages.\n";
