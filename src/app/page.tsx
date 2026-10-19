"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    number: "01",
    name: "ORIGINAL",
    subtitle: "The essential.",
    description: "Espresso, chilled water, nothing in the way.",
    size: "250 ML",
    price: "PRICE TBD",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1100&q=85",
    tone: "warm"
  },
  {
    number: "02",
    name: "OVER ICE",
    subtitle: "Cold by nature.",
    description: "A darker pour over ice. Clean, sharp, uncompromising.",
    size: "350 ML",
    price: "PRICE TBD",
    image:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1100&q=85",
    tone: "cool"
  },
  {
    number: "03",
    name: "AFTER HOURS",
    subtitle: "A different ritual.",
    description: "A signature concept for the hours that belong to you.",
    size: "300 ML",
    price: "PRICE TBD",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1100&q=85",
    tone: "dark"
  }
];

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced || !dotRef.current || !ringRef.current || !labelRef.current) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const move = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      label.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const tick = () => {
      rx += (x - rx) * 0.15;
      ry += (y - ry) * 0.15;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onEnter = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      ring.classList.add("cursor-ring--active");
      label.textContent = target.dataset.cursor || "VIEW";
      label.classList.add("cursor-label--visible");
    };
    const onLeave = () => {
      ring.classList.remove("cursor-ring--active");
      label.classList.remove("cursor-label--visible");
    };

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-cursor]"));
    targets.forEach((target) => {
      target.addEventListener("mouseenter", onEnter);
      target.addEventListener("mouseleave", onLeave);
    });
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      targets.forEach((target) => {
        target.removeEventListener("mouseenter", onEnter);
        target.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-label" ref={labelRef} aria-hidden="true" />
    </>
  );
}

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const storyImageRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(0);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (!reduced) {
        const intro = gsap.timeline({
          onComplete: () => setIntroDone(true),
          defaults: { ease: "power3.out" }
        });
        intro
          .from(".hero-kicker", { y: 18, opacity: 0, duration: 0.7 })
          .from(".hero-line", { yPercent: 110, rotate: 2, duration: 1, stagger: 0.13 }, "-=0.35")
          .from(heroImageRef.current, { scale: 0.88, y: 45, opacity: 0, duration: 1.2 }, "-=0.85")
          .from(".hero-bottom > *", { y: 15, opacity: 0, duration: 0.55, stagger: 0.1 }, "-=0.7");

        gsap.to(".hero-image-inner", {
          yPercent: 12,
          scale: 1.07,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });

        const story = gsap.timeline({
          scrollTrigger: {
            trigger: ".story",
            start: "top top",
            end: "+=230%",
            pin: ".story-stage",
            scrub: 1,
            anticipatePin: 1
          }
        });
        story
          .fromTo(".story-image", { scale: 0.72, rotate: -5, xPercent: -12 }, { scale: 1, rotate: 0, xPercent: 0, duration: 1 })
          .fromTo(".story-word--one", { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6 }, 0.2)
          .to(".story-word--one", { yPercent: -100, opacity: 0, duration: 0.5 }, 1.1)
          .fromTo(".story-word--two", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6 }, 1.25)
          .to(".story-image", { scale: 1.18, xPercent: 10, duration: 0.8 }, 1.5)
          .to(".story-word--two", { yPercent: -100, opacity: 0, duration: 0.5 }, 2.05)
          .fromTo(".story-word--three", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6 }, 2.2)
          .to(".story-image", { scale: 1.32, rotate: 3, duration: 0.7 }, 2.35);

        gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((element) => {
          gsap.fromTo(
            element,
            { y: 42, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 88%", once: true }
            }
          );
        });

        gsap.utils.toArray<HTMLElement>(".product-card").forEach((card) => {
          const image = card.querySelector<HTMLElement>(".product-image");
          if (image) {
            gsap.to(image, {
              yPercent: -7,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            });
          }
        });
      } else {
        setIntroDone(true);
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const jumpTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main ref={mainRef}>
      <CustomCursor />
      <div className={`site-shell ${introDone ? "site-shell--ready" : ""}`}>
        <header className="nav">
          <a href="#top" className="wordmark" aria-label="Blacktaste home">
            BLACKTASTE<span>®</span>
          </a>
          <nav className="nav-links" aria-label="Main navigation">
            <button onClick={() => jumpTo("experience")} data-cursor="EXPLORE">Experience</button>
            <button onClick={() => jumpTo("philosophy")} data-cursor="READ">Philosophy</button>
            <button onClick={() => jumpTo("selection")} data-cursor="VIEW">Selection</button>
          </nav>
          <button className="nav-cta" onClick={() => jumpTo("contact")} data-cursor="GO THERE">
            GET IN TOUCH <ArrowUpRight size={14} />
          </button>
          <button className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </header>

        {menuOpen && (
          <div className="mobile-menu">
            <button onClick={() => jumpTo("experience")}>Experience <ArrowDownRight size={18} /></button>
            <button onClick={() => jumpTo("philosophy")}>Philosophy <ArrowDownRight size={18} /></button>
            <button onClick={() => jumpTo("selection")}>Selection <ArrowDownRight size={18} /></button>
            <button onClick={() => jumpTo("contact")}>Contact <ArrowUpRight size={18} /></button>
          </div>
        )}

        <section className="hero" id="top">
          <div className="hero-topline">
            <span className="hero-kicker"><span className="status-dot" /> INDEPENDENT COFFEE STUDY — NO. 001</span>
            <span className="hero-index">EST. IN THE DARK / 2026</span>
          </div>
          <div className="hero-copy">
            <h1 ref={heroTitleRef} aria-label="Not made to please">
              <span className="hero-line-wrap"><span className="hero-line">NOT MADE</span></span>
              <span className="hero-line-wrap hero-line-wrap--second"><span className="hero-line">TO PLEASE<span className="period">.</span></span></span>
            </h1>
          </div>
          <div className="hero-product" ref={heroImageRef}>
            <div className="hero-glow" />
            <div className="hero-image-inner">
              <img
                src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=90"
                alt="A dark iced coffee in a glass, styled for the BLACKTASTE campaign"
                fetchPriority="high"
              />
            </div>
            <div className="product-stamp"><span>BT</span><small>BLACK<br />TASTE</small></div>
            <div className="image-index">FIG. 01 / THE ORIGINAL</div>
          </div>
          <div className="hero-bottom">
            <p className="hero-description">A study in contrast.<br />Coffee without the noise.</p>
            <button className="scroll-cue" onClick={() => jumpTo("experience")} data-cursor="SCROLL">
              <span>SCROLL TO EXPERIENCE</span><span className="scroll-cue-icon"><ArrowDown size={15} /></span>
            </button>
            <p className="hero-side-note">BITTER BY NATURE.<br />BOLD BY DESIGN.</p>
          </div>
          <div className="hero-marquee" aria-hidden="true">
            <div className="marquee-track"><span>PURE / BOLD / BLACK / PURE / BOLD / BLACK /&nbsp;</span><span>PURE / BOLD / BLACK / PURE / BOLD / BLACK /&nbsp;</span></div>
          </div>
        </section>

        <section className="story" id="experience">
          <div className="story-stage">
            <div className="story-background-word" aria-hidden="true">CONTRAST</div>
            <div className="story-topline"><span>02 — THE PROCESS</span><span>SCROLL TO REVEAL</span></div>
            <div className="story-image" ref={storyImageRef}>
              <img src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=85" alt="Close-up of a chilled dark coffee" loading="lazy" />
              <div className="story-image-overlay" />
              <span className="story-image-label">A MOMENT, HELD COLD.</span>
            </div>
            <div className="story-copy" aria-live="polite">
              <p className="story-eyebrow">IT STARTS WITH THE ESSENTIALS</p>
              <div className="story-word-window">
                <h2 className="story-word story-word--one">PURE<br />ESPRESSO<span>.</span></h2>
                <h2 className="story-word story-word--two">COLD<br />WATER<span>.</span></h2>
                <h2 className="story-word story-word--three">SOLID<br />ICE<span>.</span></h2>
              </div>
              <p className="story-description">Three simple elements.<br />Nothing to hide behind.</p>
            </div>
            <div className="story-bottomline"><span>BLACKTASTE® / FIELD NOTES</span><span>SCROLL IS THE EDIT</span></div>
          </div>
        </section>

        <section className="philosophy section-pad" id="philosophy">
          <div className="section-label reveal-up"><span>03 / THE PHILOSOPHY</span><span>LESS, BUT LOUDER.</span></div>
          <div className="philosophy-grid">
            <h2 className="philosophy-title reveal-up">LESS NOISE.<br /><em>MORE</em> CHARACTER<span>.</span></h2>
            <div className="philosophy-aside reveal-up">
              <span className="aside-number">[ 001 — 003 ]</span>
              <p>Americano is a lesson in restraint. Espresso meets water, bitterness meets clarity, and every element has a reason to be there.</p>
              <p className="small-note">A conceptual brand story. Actual product details may vary.</p>
              <button className="text-link" onClick={() => jumpTo("selection")} data-cursor="DISCOVER">DISCOVER THE SELECTION <ArrowDownRight size={16} /></button>
            </div>
          </div>
          <div className="philosophy-image-wrap reveal-up">
            <img src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1800&q=85" alt="Dark coffee on a tabletop in warm directional light" loading="lazy" />
            <div className="philosophy-image-caption"><span>STUDY 01</span><span>THE BEAUTY OF LESS</span><span>BLACKTASTE®</span></div>
          </div>
          <div className="philosophy-foot"><span>NO SHORTCUTS IN THE DETAILS.</span><span>MADE FOR THE IN-BETWEEN.</span></div>
        </section>

        <section className="selection section-pad" id="selection">
          <div className="section-label reveal-up"><span>04 / THE SELECTION</span><span>THREE TAKES ON BLACK.</span></div>
          <div className="selection-heading reveal-up">
            <h2>CHOOSE<br />YOUR <em>RITUAL.</em></h2>
            <p>Different moments.<br />Same point of view.</p>
          </div>
          <div className="product-grid">
            {products.map((product, index) => (
              <button
                type="button"
                className={`product-card product-card--${product.tone} ${activeProduct === index ? "product-card--active" : ""}`}
                key={product.number}
                onMouseEnter={() => setActiveProduct(index)}
                onFocus={() => setActiveProduct(index)}
                onClick={() => setActiveProduct(index)}
                data-cursor="SELECT"
                aria-pressed={activeProduct === index}
              >
                <div className="product-card-top"><span>{product.number} / BT</span><ArrowUpRight size={17} /></div>
                <div className="product-photo">
                  <img className="product-image" src={product.image} alt={`${product.name} Americano concept`} loading="lazy" />
                  <span className="product-photo-tag">BLACKTASTE®</span>
                </div>
                <div className="product-card-info">
                  <div><span className="product-subtitle">{product.subtitle}</span><h3>{product.name}</h3></div>
                  <span className="product-number">{product.number}</span>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-card-bottom"><span>{product.size}</span><span>{product.price}</span></div>
              </button>
            ))}
          </div>
          <p className="selection-note reveal-up">* Product names and prices are placeholders for this portfolio concept.</p>
        </section>

        <section className="closing" id="contact">
          <div className="closing-topline"><span>05 / THE AFTERTASTE</span><span>END OF TRANSMISSION</span></div>
          <div className="closing-art">
            <div className="closing-glow" />
            <img src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1300&q=85" alt="BLACKTASTE iced coffee campaign visual" loading="lazy" />
            <span className="closing-art-label">A LITTLE LESS SWEET.<br />A LITTLE MORE YOU.</span>
          </div>
          <div className="closing-title-wrap">
            <p>IF YOU KNOW, YOU KNOW.</p>
            <h2>MAKE IT<br /><em>BLACK.</em></h2>
          </div>
          <div className="closing-bottom">
            <a href="mailto:hello@blacktaste.example" className="contact-link" data-cursor="SAY HELLO">LET&apos;S MAKE SOMETHING <ArrowUpRight size={18} /></a>
            <span>AN EXPERIMENT IN AMERICANO.</span>
          </div>
          <footer className="footer">
            <a href="#top" className="footer-logo">BLACKTASTE<span>®</span></a>
            <span>BITTER BY NATURE. BOLD BY DESIGN.</span>
            <div><a href="#top">BACK TO TOP ↑</a><span>© 2026 BLACKTASTE — CONCEPT PROJECT</span></div>
          </footer>
        </section>
      </div>
    </main>
  );
}
