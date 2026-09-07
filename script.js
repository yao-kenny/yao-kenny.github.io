const articles = [
  {title:'把 AI 当成同事，而不是工具',date:'2026.08.11',time:'8 min read',tags:['AI','产品'],excerpt:'当我们不再只问“它能做什么”，而开始讨论共同目标、边界和信任，产品设计会发生什么变化？',body:['过去两年，AI 产品的核心问题从能力展示转向了协作设计。模型会写字、会搜索、会规划，这些能力本身已经不再稀奇。真正困难的是：如何把它放进一个真实的工作关系里。','我更愿意把 Agent 设计成一个有上下文的同事。它需要知道项目正在往哪里走，知道哪些判断有证据，知道什么时候应该停下来问人。好的协作不是把所有事情自动化，而是让人把注意力放在更值得判断的地方。']},
  {title:'为什么我仍然写长文',date:'2026.07.03',time:'6 min read',tags:['写作','思考'],excerpt:'短内容适合传播，长文章适合发现自己究竟在想什么。',body:['写作对我来说不是发布观点，而是把模糊的直觉变成可以被检验的句子。很多时候，文章的结论并不是开始时就知道的，它是在写作过程中慢慢长出来的。','长文的价值不在于更长，而在于允许复杂性留下来。它给例外、反例和犹豫留出位置，也让读者有机会带着自己的经验进入。']},
  {title:'一个人也可以做的产品研究',date:'2026.06.18',time:'10 min read',tags:['产品','方法'],excerpt:'没有大团队和完整预算时，如何用最小的研究闭环获得真实信号？',body:['研究不是一组神秘的仪式，而是一种持续缩小不确定性的方式。一个人做研究，最重要的是把问题说窄：这周只验证一个关键假设。','我通常从五次访谈开始，配合一次可用性走查和一个能被真实用户完成的原型。研究结束时不追求完整答案，只记录哪些信号足以改变下一步。']},
  {title:'让系统替你记住，而不是替你决定',date:'2026.05.29',time:'7 min read',tags:['系统','AI'],excerpt:'从个人知识库到团队工作台，记录与判断之间应该保持什么距离？',body:['记忆是系统最适合接管的部分：它可以稳定、完整、可检索。判断则需要责任、语境和取舍，至少现在还应该由人保留。','这条边界让工具变得更有分寸。系统帮你找回曾经看过的资料，提醒你上次的决定和依据，但最后的选择仍然回到你的桌面上。']},
  {title:'在不确定里保持节奏',date:'2026.04.12',time:'5 min read',tags:['思考'],excerpt:'关于长期项目、反馈周期，以及如何不被每一次波动带走。',body:['长期工作最稀缺的不是热情，而是稳定的反馈节奏。你需要一套足够小的测量，让自己知道事情仍在向前。','我把节奏理解成一种温和的纪律：每周交付一个可见结果，每月重新检查方向。剩下的时间，用来接受事情比预想更慢。']},
  {title:'产品经理的第二现场',date:'2026.03.08',time:'9 min read',tags:['产品','方法'],excerpt:'真正的产品判断，经常发生在会议室之外：在现场、在日志、在一句没被记录的话里。',body:['产品工作有一个容易被忽略的现场：用户真正使用产品的地方。那里没有精心准备的演示，也没有被整理过的语言，只有行为和停顿。','走进第二现场，意味着把观察当成一等输入。它会让优先级变得不那么漂亮，却更接近真实。']}
];

const grid = document.querySelector('#article-grid');
const searchInput = document.querySelector('#search-input');
const filters = document.querySelector('#tag-filters');
const emptyState = document.querySelector('#empty-state');
const dialog = document.querySelector('#article-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogMeta = document.querySelector('#dialog-meta');
const dialogContent = document.querySelector('#dialog-content');
const themeToggle = document.querySelector('#theme-toggle');

const tags = ['All', ...new Set(articles.flatMap((article) => article.tags))];
let activeTag = 'All';

function renderFilters() {
  filters.innerHTML = tags.map((tag) => `<button class="filter-button ${tag === activeTag ? 'is-selected' : ''}" data-tag="${tag}">${tag}</button>`).join('');
}

function renderArticles() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = articles.map((article, index) => ({article, index})).filter(({article}) => {
    const matchesTag = activeTag === 'All' || article.tags.includes(activeTag);
    const matchesQuery = !query || [article.title, article.excerpt, ...article.tags].join(' ').toLowerCase().includes(query);
    return matchesTag && matchesQuery;
  });
  grid.innerHTML = visible.map(({article, index}) => `<article class="article-item" tabindex="0" role="button" data-article="${index}"><div class="article-meta"><span>${article.date}</span><span>·</span><span>${article.time}</span><span>·</span><span>${article.tags.join(' / ')}</span></div><h3 class="article-title">${article.title}</h3><p class="article-excerpt">${article.excerpt}</p></article>`).join('');
  emptyState.hidden = visible.length > 0;
}

function openArticle(index) {
  const article = articles[index];
  if (!article) return;
  dialogTitle.textContent = article.title;
  dialogMeta.innerHTML = `<span>${article.date}</span><span>·</span><span>${article.time}</span><span>·</span><span>${article.tags.join(' / ')}</span>`;
  dialogContent.innerHTML = article.body.map((paragraph) => `<p>${paragraph}</p>`).join('');
  dialog.showModal();
}

filters.addEventListener('click', (event) => { const button = event.target.closest('[data-tag]'); if (!button) return; activeTag = button.dataset.tag; renderFilters(); renderArticles(); });
searchInput.addEventListener('input', renderArticles);
grid.addEventListener('click', (event) => { const item = event.target.closest('[data-article]'); if (item) openArticle(Number(item.dataset.article)); });
grid.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { const item = event.target.closest('[data-article]'); if (item) { event.preventDefault(); openArticle(Number(item.dataset.article)); } } });
document.querySelectorAll('[data-article]').forEach((button) => button.addEventListener('click', () => openArticle(Number(button.dataset.article))));
document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
document.addEventListener('keydown', (event) => { if (event.key === '/' && document.activeElement !== searchInput && !dialog.open) { event.preventDefault(); searchInput.focus(); } });
themeToggle.addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; themeToggle.setAttribute('aria-label', next === 'dark' ? '切换浅色模式' : '切换深色模式'); });
renderFilters(); renderArticles();
