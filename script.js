let articles = [];
let availableTags = [];
let activeTag = 'All';
let currentIndex = -1;
let previousHash = '#writing';
let lastTrigger = null;

const grid = document.querySelector('#article-grid');
const searchInput = document.querySelector('#search-input');
const filters = document.querySelector('#tag-filters');
const emptyState = document.querySelector('#empty-state');
const dialog = document.querySelector('#article-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogMeta = document.querySelector('#dialog-meta');
const dialogContent = document.querySelector('#dialog-content');
const dialogBack = document.querySelector('#dialog-back');
const tocToggle = document.querySelector('#toc-toggle');
const toc = document.querySelector('#reader-toc');
const copyLink = document.querySelector('#copy-link');
const shareStatus = document.querySelector('#share-status');
const readerTags = document.querySelector('#reader-tags');
const readerPrev = document.querySelector('#reader-prev');
const readerNext = document.querySelector('#reader-next');
const themeToggle = document.querySelector('#theme-toggle');
const siteTitle = document.title;

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
  grid.innerHTML = visible.map(({article, index}) => `<article class="article-item" tabindex="0" role="button" data-article="${index}"><div class="article-meta"><span>${escapeHTML(article.date)}</span><span aria-hidden="true">·</span><span>${escapeHTML(article.time)}</span><span aria-hidden="true">·</span><span>${escapeHTML((article.tags || []).join(' / '))}</span></div><h3 class="article-title">${escapeHTML(article.title)}</h3><p class="article-excerpt">${escapeHTML(article.excerpt)}</p></article>`).join('');
  emptyState.textContent = articles.length ? 'No posts match your search.' : 'No posts yet. Add your first article in content/posts.json.';
  emptyState.hidden = visible.length > 0;
}

function renderToc(article) {
  const items = Array.isArray(article.toc) ? article.toc : [];
  toc.innerHTML = items.map((item) => `<a href="#${escapeHTML(item.id)}" data-toc-id="${escapeHTML(item.id)}">${escapeHTML(item.title)}</a>`).join('');
  tocToggle.disabled = items.length === 0;
  tocToggle.setAttribute('aria-expanded', 'false');
  toc.hidden = true;
}

function renderBody(article) {
  const headingIds = new Map((article.toc || []).map((item) => [item.title, item.id]));
  return (article.body || []).map((raw) => {
    const value = String(raw ?? '').trim();
    if (!value) return '';
    if (value === '---') return '<hr class="reader-rule">';
    if (headingIds.has(value)) return `<h3 id="${escapeHTML(headingIds.get(value))}" tabindex="-1">${escapeHTML(value)}</h3>`;
    const isDiagram = value.includes('↓') || value.includes('│') || value.includes('├──') || value.includes('└──');
    if (isDiagram) return `<pre class="reader-code"><code>${escapeHTML(value)}</code></pre>`;
    return `<p>${escapeHTML(value).replace(/\n/g, '<br>')}</p>`;
  }).join('');
}

function renderReaderNav() {
  const previous = articles[currentIndex - 1];
  const next = articles[currentIndex + 1];
  readerPrev.hidden = !previous;
  readerNext.hidden = !next;
  if (previous) readerPrev.innerHTML = `<span class="reader-nav-label">上一篇</span><strong>${escapeHTML(previous.title)}</strong>`;
  if (next) readerNext.innerHTML = `<span class="reader-nav-label">下一篇</span><strong>${escapeHTML(next.title)}</strong>`;
  readerPrev.dataset.index = previous ? String(currentIndex - 1) : '';
  readerNext.dataset.index = next ? String(currentIndex + 1) : '';
}

function openArticle(index, {updateHistory = true} = {}) {
  const article = articles[index];
  if (!article) return;
  if (!dialog.open) {
    const isArticleHash = articles.some((entry, entryIndex) => location.hash === `#${slugFor(entry, entryIndex)}`);
    previousHash = location.hash && !isArticleHash ? location.hash : '#writing';
    lastTrigger = grid.querySelector(`[data-article="${index}"]`);
  }
  currentIndex = index;
  document.title = `${article.title} · ${siteTitle}`;
  dialogTitle.textContent = article.title;
  dialogMeta.innerHTML = `<span>${escapeHTML(article.date)}</span><span aria-hidden="true">·</span><span>${escapeHTML(article.time)}</span><span aria-hidden="true">·</span><span>${escapeHTML((article.tags || []).join(' / '))}</span>`;
  readerTags.textContent = (article.tags || []).map((tag) => `#${tag}`).join('  ');
  dialogContent.innerHTML = renderBody(article);
  renderToc(article);
  renderReaderNav();
  shareStatus.textContent = '';
  if (!dialog.open) dialog.showModal();
  dialog.querySelector('.dialog-body').scrollTop = 0;
  if (updateHistory) history.pushState({article: slugFor(article, index)}, '', `#${slugFor(article, index)}`);
  requestAnimationFrame(() => tocToggle.focus());
}

function closeArticle({restoreHash = true} = {}) {
  if (!dialog.open) return;
  dialog.close();
  document.title = siteTitle;
  if (restoreHash) history.pushState({}, '', previousHash || '#writing');
  currentIndex = -1;
  if (lastTrigger) requestAnimationFrame(() => lastTrigger.focus());
}

function syncArticleHash() {
  const slug = location.hash.replace(/^#/, '');
  const index = articles.findIndex((article, articleIndex) => slug === slugFor(article, articleIndex));
  if (index < 0) {
    if (dialog.open) closeArticle({restoreHash: false});
    return;
  }
  if (!dialog.open || currentIndex !== index) openArticle(index, {updateHistory: false});
}

async function copyArticleLink() {
  const article = articles[currentIndex];
  if (!article) return;
  const url = `${location.origin}${location.pathname}#${slugFor(article, currentIndex)}`;
  try {
    await navigator.clipboard.writeText(url);
    shareStatus.textContent = '链接已复制';
  } catch (error) {
    shareStatus.textContent = '复制失败，请手动复制地址';
  }
  setTimeout(() => { shareStatus.textContent = ''; }, 2400);
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
  syncArticleHash();
}

filters.addEventListener('click', (event) => { const button = event.target.closest('[data-tag]'); if (!button) return; activeTag = button.dataset.tag; renderFilters(); renderArticles(); });
searchInput.addEventListener('input', renderArticles);
grid.addEventListener('click', (event) => { const item = event.target.closest('[data-article]'); if (item) openArticle(Number(item.dataset.article)); });
grid.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { const item = event.target.closest('[data-article]'); if (item) { event.preventDefault(); openArticle(Number(item.dataset.article)); } } });
dialogBack.addEventListener('click', () => closeArticle());
document.querySelector('#dialog-close').addEventListener('click', () => closeArticle());
dialog.addEventListener('click', (event) => { if (event.target === dialog) closeArticle(); });
dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeArticle(); });
dialog.addEventListener('close', () => { document.title = siteTitle; if (location.hash.startsWith('#post-')) history.replaceState({}, '', previousHash || '#writing'); });
tocToggle.addEventListener('click', () => { const expanded = tocToggle.getAttribute('aria-expanded') === 'true'; tocToggle.setAttribute('aria-expanded', String(!expanded)); toc.hidden = expanded; });
toc.addEventListener('click', (event) => { const link = event.target.closest('[data-toc-id]'); if (!link) return; event.preventDefault(); const target = document.getElementById(link.dataset.tocId); if (target) { target.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'}); target.focus({preventScroll: true}); } });
copyLink.addEventListener('click', copyArticleLink);
[readerPrev, readerNext].forEach((button) => button.addEventListener('click', () => { if (button.dataset.index) openArticle(Number(button.dataset.index)); }));
window.addEventListener('hashchange', syncArticleHash);
window.addEventListener('popstate', syncArticleHash);
document.addEventListener('keydown', (event) => { if (event.altKey && event.key.toLowerCase() === 'c' && dialog.open) { event.preventDefault(); tocToggle.click(); return; } if (event.key === '/' && document.activeElement !== searchInput && !dialog.open) { event.preventDefault(); searchInput.focus(); } });
themeToggle.addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; themeToggle.setAttribute('aria-label', next === 'dark' ? '切换浅色模式' : '切换深色模式'); });

loadContent();
