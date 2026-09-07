# Content Guide

博客不再把文章写在 `script.js` 里。所有真实文章和 Tag 都放在 `content/posts.json`。

## 添加一篇文章

在 `posts` 数组中加入一个对象：

```json
{
  "title": "文章标题",
  "date": "2026.09.07",
  "time": "8 min read",
  "tags": ["AI", "产品"],
  "excerpt": "文章列表里显示的摘要。",
  "body": [
    "第一段正文。",
    "第二段正文。"
  ]
}
```

## 管理 Tag

把希望出现在筛选栏里的 Tag 写入 `tags` 数组，例如：

```json
{
  "tags": ["AI", "产品", "写作"],
  "posts": []
}
```

文章对象中的 `tags` 也会自动补充筛选项。删除某个 Tag 前，请先检查文章对象里是否仍在使用它。

## 发布

修改 `content/posts.json` 后提交并推送到 `main` 分支，GitHub Actions 会自动重新发布 GitHub Pages。线上页面不需要再改 `script.js`。
