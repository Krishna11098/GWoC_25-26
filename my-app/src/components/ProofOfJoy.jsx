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
    <section className="w-full bg-[#f7f5ef] px-8 py-24 md:px-16 md:py-32">
      <div className="mx-auto max-w-6xl flex flex-col gap-10">
        <header className="max-w-2xl flex flex-col gap-3">
          <p className="text-sm uppercase tracking-widest font-bold text-gray-900 opacity-70">Featured Articles</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900">Proof of Joy</h2>
          <p className="text-lg md:text-2xl text-gray-900 leading-relaxed opacity-85">
            Real stories, real smiles. See how JoyJuncture experiences bring
            people together across events, workshops, and communities.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">
          {articles.map((article) => (
            <a key={article.title} className="flex flex-col gap-1 bg-transparent border-0 border-b border-[#e8e1d6] rounded-none p-0 pb-5 no-underline text-gray-900 transition-transform duration-200 ease hover:translate-y-[-3px] hover:text-black" href={article.href}>
              <span className="text-xs font-semibold tracking-wider opacity-70 uppercase">{article.tag}</span>
              <h3 className="text-lg leading-relaxed font-bold tracking-tight">{article.title}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
