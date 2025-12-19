const articles = [
  {
    tag: "Latin America · Case Studies",
    title:
      "Cross-Border UX Research: Unifying Online Grocery Shopping Across Latin America",
    href: "#",
  },
  {
    tag: "Middle East · Customer Insights",
    title:
      "Understanding Consumer Behaviour in the Middle East: Key Insights for Global Companies",
    href: "#",
  },
  {
    tag: "Asia-Pacific · Customer Insights",
    title:
      "Understanding East Asian Consumer Behaviour: A Guide for Global Brands",
    href: "#",
  },
  {
    tag: "Middle East · Case Studies",
    title:
      "Unlocking the Flavours of Egypt: A Journey into Seasoning Preferences",
    href: "#",
  },
];

export default function ProofOfJoy() {
  return (
    <section className="proof-of-joy">
      <div className="proof-wrapper">
        <header className="proof-header">
          <p className="proof-eyebrow">Featured Articles</p>
          <h2>Proof of Joy</h2>
          <p>
            Real stories, real smiles. See how JoyJuncture experiences bring
            people together across events, workshops, and communities.
          </p>
        </header>

        <div className="proof-grid">
          {articles.map((article) => (
            <a key={article.title} className="proof-card" href={article.href}>
              <span className="proof-meta">{article.tag}</span>
              <h3>{article.title}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
