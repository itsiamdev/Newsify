import './App.css'

const mainArticle = {
  id: 1,
  title: "Breaking News: AI is taking over",
  description: "Artificial Intelligence is growing rapidly and changing the world.",
  image: "https://via.placeholder.com/600x300",
  source: "Tech News",
  date: "2026-06-01",
  link: "#"
}

const articles = [
  {
    id: 2,
    title: "Sports Update",
    description: "Latest results from the football world.",
    image: "https://via.placeholder.com/300",
    source: "ESPN",
    date: "2026-06-01",
    link: "#"
  },
  {
    id: 3,
    title: "Health Tips",
    description: "How to stay healthy in 2026.",
    image: "https://via.placeholder.com/300",
    source: "HealthLine",
    date: "2026-06-01",
    link: "#"
  },
  {
    id: 4,
    title: "Technology News",
    description: "Latest innovations in the tech industry.",
    image: "https://placehold.co/300x200/2563eb/ffffff?text=Tech",
    source: "Tech Today",
    date: "2026-06-01",
    link: "#"
  },
  {
    id: 5,
    title: "Business Market Update",
    description: "Stock markets rally on positive economic data.",
    image: "https://placehold.co/300x200/dc2626/ffffff?text=Business",
    source: "Finance News",
    date: "2026-06-01",
    link: "#"
  },
  {
    id: 6,
    title: "Science Discovery",
    description: "New research reveals insights about climate change.",
    image: "https://placehold.co/300x200/0891b2/ffffff?text=Science",
    source: "Science Daily",
    date: "2026-06-01",
    link: "#"
  },
  {
    id: 7,
    title: "Entertainment Buzz",
    description: "Upcoming movies generating excitement.",
    image: "https://placehold.co/300x200/7c3aed/ffffff?text=Entertainment",
    source: "Entertainment Weekly",
    date: "2026-06-01",
    link: "#"
  }
]

function App() {
  return (
    <div className="app">
      <h1>Newsify</h1>

      {/* Articol principal */}
      <div className="main-article">
        <img src={mainArticle.image} alt={mainArticle.title} />
        <h2>{mainArticle.title}</h2>
        <p>{mainArticle.description}</p>
      </div>

      {/* Lista articole */}
      <div className="articles">
        {articles.map(article => (
          <div key={article.id} className="card">
            <img src={article.image} alt={article.title} />
            <h3>{article.title}</h3>
            <p>{article.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App