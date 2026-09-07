let articles = [];
let availableTags = [];
let activeTag = 'All';

const grid = document.querySelector('#article-grid');
const searchInput = document.querySelector('#search-input');
const filters = document.querySelector('#tag-filters');
const emptyState = document.querySelector('#empty-state');
const themeToggle = document.querySelector('#theme-toggle');

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]));
}

function slugFor(article, index) {
  return article.slug || `post-${index}`;
}

function allTags() {
  return ['All', ...new Set([...availableTags, ...articles.flatMap((article) => article.tags || [])])];
}

function renderFilters() {
  filters.innerHTML = allTags().map((tag) => `<button class="filter-button ${tag === activeTag ? 'is-selected' : ''}" data-tag="${escapeHTML(tag)}">${escapeHTML(tag)}</button>`).join('');
}

function renderArticles() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = articles.map((article, index) => ({article, index})).filter(({article}) => {
    const tags = article.tags || [];
    const matchesTag = activeTag === 'All' || tags.includes(activeTag);
    const matchesQuery = !query || [article.title, article.excerpt, ...tags].join(' ').toLowerCase().includes(query);
    return matchesTag && matchesQuery;
  });
  grid.innerHTML = visible.map(({article, index}) => `<article class="article-item" tabindex="0" role="link" data-article="${index}"><div class="article-meta"><span>${escapeHTML(article.date)}</span><span aria-hidden="true">·</span><span>${escapeHTML(article.time)}</span><span aria-hidden="true">·</span><span>${escapeHTML((article.tags || []).join(' / '))}</span></div><h3 class="article-title">${escapeHTML(article.title)}</h3><p class="article-excerpt">${escapeHTML(article.excerpt)}</p></article>`).join('');
  emptyState.textContent = articles.length ? 'No posts match your search.' : 'No posts yet. Add your first article in content/posts.json.';
  emptyState.hidden = visible.length > 0;
}

function openArticle(index) {
  const article = articles[index];
  if (article) window.location.href = `post.html?slug=${encodeURIComponent(slugFor(article, index))}`;
}

async function loadContent() {
  try {
    const response = await fetch('content/posts.json', {cache: 'no-store'});
    if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
    const payload = await response.json();
    articles = Array.isArray(payload.posts) ? payload.posts : [];
    availableTags = Array.isArray(payload.tags) ? payload.tags : [];
  } catch (error) {
    articles = [];
    availableTags = [];
    emptyState.textContent = 'Content is unavailable right now. Check content/posts.json.';
  }
  renderFilters();
  renderArticles();
  const legacySlug = location.hash.replace(/^#/, '');
  const legacyIndex = articles.findIndex((article, index) => legacySlug === slugFor(article, index));
  if (legacyIndex >= 0) openArticle(legacyIndex);
}

filters.addEventListener('click', (event) => { const button = event.target.closest('[data-tag]'); if (!button) return; activeTag = button.dataset.tag; renderFilters(); renderArticles(); });
searchInput.addEventListener('input', renderArticles);
grid.addEventListener('click', (event) => { const item = event.target.closest('[data-article]'); if (item) openArticle(Number(item.dataset.article)); });
grid.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { const item = event.target.closest('[data-article]'); if (item) { event.preventDefault(); openArticle(Number(item.dataset.article)); } } });
document.addEventListener('keydown', (event) => { if (event.key === '/' && document.activeElement !== searchInput) { event.preventDefault(); searchInput.focus(); } });
themeToggle.addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; themeToggle.setAttribute('aria-label', next === 'dark' ? '切换浅色模式' : '切换深色模式'); });

loadContent();
