import { useState, useCallback } from 'react'
import './App.css'

const API_KEY = import.meta.env.VITE_NEWS_API_KEY
const API_URL = 'https://newsdata.io/api/1/latest'
const TRANSLATE_URL = 'https://api.mymemory.translated.net/get'

const CATEGORIES = [
  { value: '', label: { en: 'All', ro: 'Toate' } },
  { value: 'business', label: { en: 'Business', ro: 'Business' } },
  { value: 'technology', label: { en: 'Technology', ro: 'Tehnologie' } },
  { value: 'sports', label: { en: 'Sports', ro: 'Sport' } },
  { value: 'entertainment', label: { en: 'Entertainment', ro: 'Divertisment' } },
  { value: 'health', label: { en: 'Health', ro: 'Sănătate' } },
  { value: 'science', label: { en: 'Science', ro: 'Știință' } },
]

const UI_TEXT = {
  en: {
    search: 'Search news...',
    refresh: 'Refresh',
    loading: 'Loading...',
    error: 'Failed to fetch news',
    noArticles: 'No articles found',
    readMore: 'Read more',
    translate: 'Traduce în română',
    translateBack: 'Show in English',
  },
  ro: {
    search: 'Caută știri...',
    refresh: 'Reîmprospătare',
    loading: 'Se încarcă...',
    error: 'Nu au putut fi încărcate știrile',
    noArticles: 'Nu au fost găsite articole',
    readMore: 'Citește mai mult',
    translate: 'Tradu în română',
    translateBack: 'Afișează în engleză',
  }
}

async function translateText(text, targetLang = 'ro') {
  if (!text) return text
  const url = `${TRANSLATE_URL}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
  const res = await fetch(url)
  const data = await res.json()
  return data.responseData?.translatedText || text
}

function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [lang, setLang] = useState('en')
  const [translating, setTranslating] = useState(false)
  const [translatedIds, setTranslatedIds] = useState(new Set())
  const t = UI_TEXT[lang]

  const fetchNews = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ apikey: API_KEY })
      if (category) params.append('category', category)
      if (search) params.append('q', search)
      const res = await fetch(`${API_URL}?${params}`)
      if (!res.ok) throw new Error(t.error)
      const data = await res.json()
      setArticles(data.results || [])
      setTranslatedIds(new Set())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [category, search, t.error])
  const toggleLang = () => {
    setLang(l => l === 'en' ? 'ro' : 'en')
  }

  const translateArticle = async (id, article) => {
    if (translatedIds.has(id)) return
    setTranslating(true)
    try {
      const [title, desc] = await Promise.all([
        translateText(article.title, 'ro'),
        translateText(article.description, 'ro'),
      ])
      setArticles(prev => prev.map(a => a.article_id === id ? { ...a, _title: title, _desc: desc } : a))
      setTranslatedIds(prev => new Set(prev).add(id))
    } finally {
      setTranslating(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h1 className="logo">Newsify</h1>
          <div className="controls">
            <input
              type="text"
              placeholder={t.search}
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label[lang]}</option>
              ))}
            </select>
            <button className="refresh-btn" onClick={fetchNews} disabled={loading}>
              {loading ? t.loading : t.refresh}
            </button>
            <button className="lang-btn" onClick={toggleLang}>
              {lang === 'en' ? '🇷🇴 RO' : '🇬🇧 EN'}
            </button>
          </div>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card skeleton">
              <div className="skeleton-img" />
              <div className="skeleton-line w75" />
              <div className="skeleton-line w100" />
              <div className="skeleton-line w50" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="empty">{t.noArticles}</div>
      ) : (
        <main className="grid">
          {articles.map((article, idx) => (
            <article key={article.article_id || idx} className="card">
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="card-img"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
              <div className="card-body">
                <h2 className="card-title">{translatedIds.has(article.article_id) ? article._title : article.title}</h2>
                <p className="card-desc">{translatedIds.has(article.article_id) ? article._desc : article.description}</p>
                <div className="card-meta">
                  <span className="source">{article.source_id || 'News'}</span>
                  <span className="date">
                    {article.pubDate ? new Date(article.pubDate).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className="card-actions">
                  <button
                    className="translate-btn"
                    onClick={() => translateArticle(article.article_id, article)}
                    disabled={translating}
                  >
                    {translatedIds.has(article.article_id) ? t.translateBack : t.translate}
                  </button>
                  {article.link && (
                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="card-link">
                      {t.readMore}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </main>
      )}
    </div>
  )
}

export default App
