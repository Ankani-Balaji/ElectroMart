import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import "./Hero.css";

const SLIDES = [
  {
    eyebrow: "Nova X13 Ultra",
    title: "Flagship power. Titanium frame.",
    subtitle: "200MP camera system, on-device neural engine, all-day battery.",
    cta: "Shop Smartphones",
    link: "/products?category=smartphones",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200",
  },
  {
    eyebrow: "Aether Book Pro 14",
    title: "Built for creators who don't wait.",
    subtitle: "Mini-LED display, 20-hour battery, machined from a single block of aluminum.",
    cta: "Shop Laptops",
    link: "/products?category=laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200",
  },
  {
    eyebrow: "Flash Deals",
    title: "Up to 40% off audio & wearables.",
    subtitle: "This week only — while stock lasts.",
    cta: "Shop Flash Deals",
    link: "/products",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200",
  },
];

const Hero = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[active];

  return (
    <section className="hero">
      <div className="hero__bg" style={{ backgroundImage: `url(${slide.image})` }} />
      <div className="hero__scrim" />
      <div className="container hero__content fade-in" key={active}>
        <span className="hero__eyebrow mono">{slide.eyebrow}</span>
        <h1 className="hero__title">{slide.title}</h1>
        <p className="hero__subtitle">{slide.subtitle}</p>
        <Link to={slide.link} className="hero__cta">
          {slide.cta} <FiArrowRight />
        </Link>
      </div>

      <div className="hero__dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero__dot ${i === active ? "is-active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Show slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
