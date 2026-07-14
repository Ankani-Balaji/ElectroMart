import "./Brands.css";

const BRANDS = ["Nova", "Aether", "Pulse", "Orbit", "StreamCast", "GameForge", "SnapShot", "SoundWave"];

const Brands = () => (
  <section className="container brands-section">
    <div className="section-heading">
      <h2>Top Brands</h2>
      <p className="text-soft">The names driving innovation forward.</p>
    </div>
    <div className="brands-marquee">
      <div className="brands-track">
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <span key={i} className="brand-chip">{brand}</span>
        ))}
      </div>
    </div>
  </section>
);

export default Brands;
