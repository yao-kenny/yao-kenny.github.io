const archiveList = document.querySelector('#archive-list');
const retryLoad = document.querySelector('#retry-load');
const themeToggle = document.querySelector('#theme-toggle');

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]));
}

function slugFor(article, index) {
  return article.slug || `post-${index}`;
}

function renderArchive(posts) {
  const groups = posts.reduce((result, article, index) => {
    const year = String(article.date || '').slice(0, 4) || 'Other';
    (result[year] ||= []).push({article, index});
    return result;
  }, {});
  const years = Object.keys(groups).sort((a, b) => b.localeCompare(a));
  archiveList.innerHTML = years.length ? years.map((year) => `<section class="archive-group" aria-labelledby="archive-${escapeHTML(year)}"><h2 id="archive-${escapeHTML(year)}">${escapeHTML(year)}</h2><div class="archive-items">${groups[year].map(({article, index}) => `<a class="archive-item" href="post.html?slug=${encodeURIComponent(slugFor(article, index))}"><time datetime="${escapeHTML(article.date)}">${escapeHTML(article.date)}</time><span>${escapeHTML(article.title)}</span></a>`).join('')}</div></section>`).join('') : '<p class="empty-state">还没有文章。</p>';
}

async function loadArchive() {
  retryLoad.hidden = true;
  try {
    const response = await fetch('content/posts.json', {cache: 'no-store'});
    if (!response.ok) throw new Error('Archive request failed');
    const payload = await response.json();
    renderArchive(Array.isArray(payload.posts) ? payload.posts : []);
  } catch (error) {
    archiveList.innerHTML = '<p class="empty-state" role="status">归档暂时无法加载，请稍后重试。</p>';
    retryLoad.hidden = false;
  }
}

themeToggle.addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; themeToggle.setAttribute('aria-label', next === 'dark' ? '切换浅色模式' : '切换深色模式'); themeToggle.title = next === 'dark' ? '切换浅色模式' : '切换深色模式'; try { localStorage.setItem('kenny-theme', next); } catch (error) {} });
retryLoad.addEventListener('click', loadArchive);

loadArchive();
