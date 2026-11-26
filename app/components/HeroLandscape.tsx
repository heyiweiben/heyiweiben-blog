import { useEffect, useRef } from "react";

export function HeroLandscape() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(hero.offsetHeight, 1)));
      hero.style.setProperty("--hero-progress", progress.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="hero" ref={heroRef} aria-labelledby="home-title">
      <div className="hero__sky" aria-hidden="true" />
      <div className="hero__static" aria-hidden="true" />
      <div className="hero__mist hero__mist--one" aria-hidden="true" />
      <div className="hero__mist hero__mist--two" aria-hidden="true" />
      <picture>
        <source media="(max-width: 760px)" type="image/avif" srcSet="/images/landscape/web/hero-far-840.avif" />
        <source type="image/avif" srcSet="/images/landscape/web/hero-far-1672.avif" />
        <source media="(max-width: 760px)" type="image/webp" srcSet="/images/landscape/web/hero-far-840.webp" />
        <img className="hero__layer hero__layer--far" src="/images/landscape/web/hero-far.webp" alt="" width="1672" height="941" decoding="async" fetchPriority="high" />
      </picture>
      <picture>
        <source media="(max-width: 760px)" type="image/avif" srcSet="/images/landscape/web/hero-mid-840.avif" />
        <source type="image/avif" srcSet="/images/landscape/web/hero-mid-1672.avif" />
        <source media="(max-width: 760px)" type="image/webp" srcSet="/images/landscape/web/hero-mid-840.webp" />
        <img className="hero__layer hero__layer--mid" src="/images/landscape/web/hero-mid.webp" alt="" width="1672" height="941" decoding="async" fetchPriority="low" />
      </picture>
      <picture>
        <source media="(max-width: 760px)" type="image/avif" srcSet="/images/landscape/web/hero-near-840.avif" />
        <source type="image/avif" srcSet="/images/landscape/web/hero-near-1672.avif" />
        <source media="(max-width: 760px)" type="image/webp" srcSet="/images/landscape/web/hero-near-840.webp" />
        <img className="hero__layer hero__layer--near" src="/images/landscape/web/hero-near.webp" alt="" width="1672" height="941" decoding="async" fetchPriority="low" />
      </picture>
      <div className="hero__copy">
        <h1 id="home-title">问题之下</h1>
        <p>在技术、商业与生活之间。</p>
      </div>
    </section>
  );
}
