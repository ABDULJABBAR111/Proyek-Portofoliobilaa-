export default function Hero({ lines, desc, features, outcome, flip }) {
  return (
    <section className="hero">
      <div className="eyebrow"><span className="bar" />Portofolio</div>
      <h1>
        {lines.map((l, i) => (
          <span key={i} className={l.accent ? 'accent' : ''}>{l.t}</span>
        ))}
      </h1>
      <span className="pill">Proyek Portofolio • Finance Staff</span>
      <p className="desc">{desc}</p>
      <div className="features">
        {features.map((f) => (
          <div key={f.title} className="feat">
            <span className="ico">{f.icon}</span>
            <div><b>{f.title}</b><small>{f.text}</small></div>
          </div>
        ))}
      </div>
      <div className="outcome">
        <span className="check">✓</span>
        <div><small>Hasil / Outcome</small><p>{outcome}</p></div>
      </div>
    </section>
  );
}
