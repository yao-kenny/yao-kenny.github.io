let articles = [];
let currentIndex = -1;

const postState = document.querySelector('#post-state');
const postArticle = document.querySelector('#post-article');
const postMeta = document.querySelector('#post-meta');
const postTitle = document.querySelector('#post-title');
const postExcerpt = document.querySelector('#post-excerpt');
const postContent = document.querySelector('#post-content');
const postToc = document.querySelector('#post-toc');
const tocToggle = document.querySelector('#toc-toggle');
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

function renderBody(article) {
  const headingIds = new Map((article.toc || []).map((item) => [item.title, item.id]));
  return (article.body || []).map((raw) => {
    const value = String(raw ?? '').trim();
    if (!value) return '';
    if (value === '---') return '<hr class="reader-rule">';
    if (headingIds.has(value)) return `<h2 id="${escapeHTML(headingIds.get(value))}" tabindex="-1">${escapeHTML(value)}</h2>`;
    const isDiagram = value.includes('↓') || value.includes('│') || value.includes('├──') || value.includes('└──');
    if (isDiagram) return `<pre class="reader-code"><code>${escapeHTML(value)}</code></pre>`;
    return `<p>${escapeHTML(value).replace(/\n/g, '<br>')}</p>`;
  }).join('');
}

function renderToc(article) {
  const items = Array.isArray(article.toc) ? article.toc : [];
  postToc.innerHTML = items.map((item) => `<a href="#${escapeHTML(item.id)}" data-toc-id="${escapeHTML(item.id)}">${escapeHTML(item.title)}</a>`).join('');
  tocToggle.disabled = items.length === 0;
}

function renderNavigation() {
  const previous = articles[currentIndex - 1];
  const next = articles[currentIndex + 1];
  const setLink = (link, article, label, index) => {
    link.hidden = !article;
    if (!article) return;
    link.href = `post.html?slug=${encodeURIComponent(slugFor(article, index))}`;
    link.innerHTML = `<span class="reader-nav-label">${label}</span><strong>${escapeHTML(article.title)}</strong>`;
  };
  setLink(readerPrev, previous, '上一篇', currentIndex - 1);
  setLink(readerNext, next, '下一篇', currentIndex + 1);
}

function renderArticle(article) {
  document.title = `${article.title} · ${siteTitle}`;
  postMeta.innerHTML = `<span>${escapeHTML(article.date)}</span><span aria-hidden="true">·</span><span>${escapeHTML(article.time)}</span><span aria-hidden="true">·</span><span>${escapeHTML((article.tags || []).join(' / '))}</span>`;
  postTitle.textContent = article.title;
  postExcerpt.textContent = article.excerpt || '';
  postContent.innerHTML = renderBody(article);
  readerTags.textContent = (article.tags || []).map((tag) => `#${tag}`).join('  ');
  renderToc(article);
  renderNavigation();
  postState.hidden = true;
  postArticle.hidden = false;
}

async function copyArticleLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
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
  } catch (error) {
    postState.textContent = '文章暂时无法加载，请稍后重试。';
    return;
  }
  const requestedSlug = new URLSearchParams(location.search).get('slug');
  currentIndex = articles.findIndex((article, index) => slugFor(article, index) === requestedSlug);
  if (currentIndex < 0) {
    postState.textContent = '没有找到这篇文章。';
    return;
  }
  renderArticle(articles[currentIndex]);
}

tocToggle.addEventListener('click', () => { const expanded = tocToggle.getAttribute('aria-expanded') === 'true'; tocToggle.setAttribute('aria-expanded', String(!expanded)); postToc.hidden = expanded; });
postToc.addEventListener('click', (event) => { const link = event.target.closest('[data-toc-id]'); if (!link) return; event.preventDefault(); const target = document.getElementById(link.dataset.tocId); if (target) { target.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'}); target.focus({preventScroll: true}); } });
copyLink.addEventListener('click', copyArticleLink);
document.addEventListener('keydown', (event) => { if (event.altKey && event.key.toLowerCase() === 'c') { event.preventDefault(); tocToggle.click(); } });
themeToggle.addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; themeToggle.setAttribute('aria-label', next === 'dark' ? '切换浅色模式' : '切换深色模式'); });

loadContent();
