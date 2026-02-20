'use client';

import { useCallback, useEffect, useState } from 'react';

// Premium Abstract SVGs as Components
const HeroIllustration = () => (
  <svg viewBox="0 0 800 600" className="hero-illustration">
    <defs>
      <linearGradient id="primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#a1a1aa" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0066ff" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
      </linearGradient>
      <linearGradient id="glass-border" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="12" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="glow-strong" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="24" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="glass-blur" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="16" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
    <circle cx="400" cy="300" r="250" fill="#00e5ff" opacity="0.05" filter="url(#glow-strong)" />
    <circle cx="550" cy="200" r="200" fill="#7800ff" opacity="0.04" filter="url(#glow-strong)" />
    <g transform="translate(150, 150) rotate(-5)" filter="url(#glass-blur)">
      <rect x="0" y="0" width="300" height="200" rx="20" fill="url(#glass-grad)" stroke="url(#glass-border)" strokeWidth="1.5" opacity="0.6" />
      <line x1="40" y1="50" x2="200" y2="50" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="4" strokeLinecap="round" />
    </g>
    <path d="M 350 250 Q 500 150 600 280 T 650 450" fill="none" stroke="url(#accent-grad)" strokeWidth="2" strokeDasharray="4 8" opacity="0.6" filter="url(#glow)">
      <animate attributeName="stroke-dashoffset" from="120" to="0" dur="20s" linear infinite />
    </path>
    <g transform="translate(250, 220) rotate(2)" filter="url(#glass-blur)">
      <rect x="0" y="0" width="380" height="260" rx="24" fill="url(#glass-grad)" stroke="url(#glass-border)" strokeWidth="1.5" />
      <rect x="30" y="30" width="80" height="80" rx="16" fill="url(#accent-grad)" opacity="0.2" />
      <rect x="130" y="40" width="180" height="12" rx="6" fill="#ffffff" opacity="0.8" />
      <g transform="translate(30, 140)">
        <path d="M 0 80 L 40 50 L 80 65 L 120 30 L 160 45 L 200 10 L 240 25 L 280 0 L 320 15" fill="none" stroke="url(#accent-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
      </g>
    </g>
  </svg>
);

const serviceDefs = (
  <defs>
    <linearGradient id="s-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#0066ff" stopOpacity="0.2" />
    </linearGradient>
    <filter id="s-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
);

const EngineeringIcon = () => (
  <svg viewBox="0 0 400 300" className="service-icon" style={{ height: '120px' }}>
    {serviceDefs}
    <g transform="translate(50, 50)">
      <rect x="60" y="0" width="180" height="80" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <rect x="20" y="80" width="220" height="100" rx="16" fill="rgba(255,255,255,0.05)" stroke="url(#s-grad)" strokeWidth="1.5" filter="url(#s-glow)" />
      <line x1="50" y1="110" x2="160" y2="110" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="140" x2="200" y2="140" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" />
    </g>
  </svg>
);

const GrowthIcon = () => (
  <svg viewBox="0 0 400 300" className="service-icon" style={{ height: '120px' }}>
    {serviceDefs}
    <g transform="translate(50, 80)">
      <path d="M 20 150 Q 100 140 150 80 T 280 10" fill="none" stroke="url(#s-grad)" strokeWidth="8" strokeLinecap="round" filter="url(#s-glow)" />
      <rect x="260" y="20" width="20" height="140" rx="4" fill="url(#s-grad)" opacity="0.8" />
    </g>
  </svg>
);

const InfraIcon = () => (
  <svg viewBox="0 0 400 300" className="service-icon" style={{ height: '120px' }}>
    {serviceDefs}
    <g transform="translate(60, 40)">
      <rect x="0" y="120" width="240" height="40" rx="8" fill="rgba(255,255,255,0.05)" stroke="url(#s-grad)" strokeWidth="1" />
      <circle cx="20" cy="140" r="4" fill="#00e5ff" filter="url(#s-glow)">
        <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
      </circle>
      <line x1="90" y1="140" x2="200" y2="140" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
    </g>
  </svg>
);

const ProcessIllustration = () => (
  <svg viewBox="0 0 400 300" className="process-illustration" style={{ width: '100%', maxWidth: '320px', marginTop: '2rem' }}>
    <defs>
      <linearGradient id="p-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0066ff" stopOpacity="0.2" />
      </linearGradient>
      <filter id="p-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g transform="translate(40, 40)">
      <path d="M 0 100 Q 150 100 150 50 T 300 150" fill="none" stroke="url(#p-grad)" strokeWidth="3" strokeDasharray="4 8" opacity="0.6">
        <animate attributeName="stroke-dashoffset" from="120" to="0" dur="10s" linear infinite />
      </path>
      <circle cx="0" cy="100" r="8" fill="#00e5ff" filter="url(#p-glow)" />
      <circle cx="150" cy="50" r="16" fill="rgba(255,255,255,0.05)" stroke="url(#p-grad)" />
      <circle cx="150" cy="50" r="4" fill="#ffffff" />
      <circle cx="300" cy="150" r="24" fill="rgba(255,255,255,0.05)" stroke="#00e5ff" filter="url(#p-glow)">
        <animate attributeName="r" values="24;28;24" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="300" cy="150" r="8" fill="#ffffff" />
    </g>
  </svg>
);

const PortfolioBackground = () => (
  <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', top: 0, right: '-20%', width: '80%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.4 }}>
    <defs>
      <filter id="pf-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="40" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g transform="translate(500, 500)" filter="url(#pf-glow)">
      <circle cx="0" cy="0" r="400" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.1" strokeDasharray="4 16">
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="120s" repeatCount="indefinite" />
      </circle>
      <circle cx="0" cy="0" r="300" fill="none" stroke="#7800ff" strokeWidth="2" opacity="0.15" strokeDasharray="20 40">
        <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="180s" repeatCount="indefinite" />
      </circle>
      <circle cx="0" cy="0" r="150" fill="#00e5ff" opacity="0.03" />
    </g>
  </svg>
);

const ContactIllustration = () => (
  <svg viewBox="0 0 800 600" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.6 }}>
    <defs>
      <linearGradient id="c-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#7800ff" stopOpacity="0.05" />
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#c-grad)" />
    <path d="M 0 600 Q 400 400 800 600 L 800 0 L 0 0 Z" fill="rgba(8, 17, 39, 0.8)" />
    <path d="M -100 200 Q 300 0 900 300" fill="none" stroke="#00e5ff" strokeWidth="1" strokeDasharray="2 10" opacity="0.2">
      <animate attributeName="d" values="M -100 200 Q 300 0 900 300; M -100 250 Q 300 100 900 250; M -100 200 Q 300 0 900 300" dur="20s" repeatCount="indefinite" />
    </path>
    <path d="M -100 400 Q 400 200 900 500" fill="none" stroke="#7800ff" strokeWidth="1" strokeDasharray="4 12" opacity="0.2">
      <animate attributeName="d" values="M -100 400 Q 400 200 900 500; M -100 350 Q 400 300 900 450; M -100 400 Q 400 200 900 500" dur="25s" repeatCount="indefinite" />
    </path>
  </svg>
);

export default function HomePage() {
  const initialFormData = {
    name: '',
    email: '',
    company: '',
    timeline: '',
    message: ''
  };

  const scrollToSection = useCallback(sectionId => {
    if (typeof window === 'undefined') {
      return;
    }
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
    }
  }, []);

  useEffect(() => {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const navGroup = document.querySelector('[data-nav-menu]');
    const navLinks = [...document.querySelectorAll('.nav-link')];
    const sections = [...document.querySelectorAll('section[id]')];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const closeNavigation = () => {
      if (!navGroup) {
        return;
      }
      navGroup.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      if (navToggle) {
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    };

    const toggleNavigation = () => {
      if (!navGroup) {
        return;
      }
      const isOpen = navGroup.classList.toggle('is-open');
      document.body.classList.toggle('no-scroll', isOpen);
      if (navToggle) {
        navToggle.classList.toggle('is-active', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    };

    const highlightNavigation = () => {
      const scrollPosition = window.scrollY + 160;
      let currentId = 'home';

      sections.forEach(section => {
        if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
          currentId = section.id;
        }
      });

      navLinks.forEach(link => {
        const targetId = link.getAttribute('href')?.replace('#', '');
        if (targetId) {
          link.classList.toggle('is-active', targetId === currentId);
        }
      });
    };

    const handleResize = () => {
      if (window.innerWidth > 900) {
        closeNavigation();
      }
    };

    const handleKeydown = event => {
      if (event.key === 'Escape') {
        closeNavigation();
      }
    };

    const observerSupported = 'IntersectionObserver' in window;
    let observer;

    if (!prefersReducedMotion.matches && observerSupported) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18, rootMargin: '0px 0px -80px 0px' }
      );

      document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    } else {
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
    }

    if (navToggle && navGroup) {
      navToggle.addEventListener('click', toggleNavigation);
    }

    navLinks.forEach(link => {
      link.addEventListener('click', closeNavigation);
    });

    highlightNavigation();
    window.addEventListener('scroll', highlightNavigation, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeydown);

    const cleanup = () => {
      if (navToggle && navGroup) {
        navToggle.removeEventListener('click', toggleNavigation);
      }
      navLinks.forEach(link => {
        link.removeEventListener('click', closeNavigation);
      });
      window.removeEventListener('scroll', highlightNavigation);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeydown);
      if (observer) {
        observer.disconnect();
      }
    };

    return cleanup;
  }, []);

  const [formData, setFormData] = useState(initialFormData);
  const [formStatus, setFormStatus] = useState('idle');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formStatus !== 'idle') {
      setFormStatus('idle');
      setFormMessage('');
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFormStatus('submitting');
    setFormMessage('Sending your request…');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || 'We could not send your booking right now.');
      }

      setFormStatus('success');
      setFormMessage('Thanks! Our team will reach out within one business day.');
      setFormData({ ...initialFormData });
    } catch (error) {
      setFormStatus('error');
      setFormMessage(error.message || 'We could not send your booking right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="site-header" data-reveal>
        <div className="container nav-wrapper">
          <a className="brand" href="#home" aria-label="Vistalabs home">
            Vistalabs<span className="logo-dot">.</span>
          </a>
          <button className="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" data-nav-toggle>
            <span />
            <span />
            <span />
          </button>
          <div className="nav-group" data-nav-menu>
            <ul className="nav-menu">
              <li>
                <a className="nav-link" data-scroll="true" href="#home">
                  Home
                </a>
              </li>
              <li>
                <a className="nav-link" data-scroll="true" href="#services">
                  Services
                </a>
              </li>
              <li>
                <a className="nav-link" data-scroll="true" href="#platform">
                  Platform Advantage
                </a>
              </li>
              <li>
                <a className="nav-link" data-scroll="true" href="#process">
                  Process
                </a>
              </li>
              <li>
                <a className="nav-link" data-scroll="true" href="#portfolio">
                  Portfolio
                </a>
              </li>
              <li>
                <a className="nav-link" data-scroll="true" href="#team">
                  Team
                </a>
              </li>
              <li>
                <a className="nav-link" data-scroll="true" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
            <a className="btn btn-sm btn-outline nav-cta" href="mailto:britz.listen@gmail.com">
              Book discovery
            </a>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="container hero-layout">
            <div className="hero-copy" data-reveal>
              <p className="eyebrow">High-Performance Digital Product Consultancy</p>
              <h1>We engineer digital platforms that scale your ambition.</h1>
              <p className="lede">
                Ex-Microsoft and Amazon engineers building bespoke software, high-traffic consumer apps, and enterprise platforms that simply work. Fast, beautiful, and built for growth.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="mailto:britz.listen@gmail.com">
                  Let's build together
                </a>
                <button className="btn btn-ghost" type="button" onClick={() => scrollToSection('portfolio')}>
                  View our work
                </button>
              </div>
              <div className="hero-metrics">
                <div className="metric">
                  <span className="metric-value">20K+</span>
                  <span className="metric-label">Active Users Scaled</span>
                </div>
                <div className="metric">
                  <span className="metric-value">300+</span>
                  <span className="metric-label">Daily Organic Leads</span>
                </div>
                <div className="metric">
                  <span className="metric-value">Zero</span>
                  <span className="metric-label">Unplanned Outages</span>
                </div>
              </div>
            </div>

            <div className="hero-visual" data-reveal>
              <HeroIllustration />
            </div>
          </div>
          <div className="hero-glow" aria-hidden="true" />
        </section>

        <section className="credibility" data-reveal>
          <div className="container credibility-wrapper">
            <p className="credibility-title">Our engineering DNA</p>
            <div className="badge-row">
              <span className="badge">Microsoft Alumni</span>
              <span className="badge">Amazon Architecture Mentors</span>
              <span className="badge">Full-Stack Experts</span>
            </div>
          </div>
        </section>

        <section id="services" className="section" data-reveal>
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Our Value Proposition</p>
              <h2>End-to-end capabilities driving real outcomes</h2>
              <p className="section-lede">
                We aren't just developers; we are product partners. We build the right thing, get eyes on it, and ensure it runs flawlessly at scale.
              </p>
            </div>
            <div className="grid services-grid">
              <article className="card">
                <EngineeringIcon />
                <h3>Product Engineering</h3>
                <p>From zero to one, we craft lightning-fast Next.js frontends and robust, secure APIs that users love and competitors envy.</p>
              </article>
              <article className="card">
                <GrowthIcon />
                <h3>Growth &amp; SEO Architecture</h3>
                <p>Beautiful code is worthless if nobody sees it. We architect for organic discovery, programmatic SEO, and high-conversion flows.</p>
              </article>
              <article className="card">
                <InfraIcon />
                <h3>Enterprise Infrastructure</h3>
                <p>Your platform needs to sleep less than you do. We deploy immutable infrastructure and 24/7 observability to guarantee uptime.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="process" className="section section-split" data-reveal>
          <div className="container split-layout">
            <div className="split-copy">
              <p className="eyebrow">Delivery Framework</p>
              <h2>A transparent, measurable engineering process</h2>
              <p className="section-lede">
                We blend technical rigor with business alignment. Every engagement includes a dedicated architect and delivery lead to co-own your outcomes from sprint zero to launch.
              </p>
              <ProcessIllustration />
            </div>
            <ol className="timeline split-panel">
              <li style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span className="step" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>01. Discover &amp; Architect</span>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Strategy workshops to define value, constraints, and success metrics followed by precision blueprinting.</p>
              </li>
              <li style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span className="step" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>02. Build &amp; Test</span>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Iterative delivery with automated Playwright, API, and load testing baked into every sprint.</p>
              </li>
              <li style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span className="step" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>03. Launch &amp; Evolve</span>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Zero-downtime releases orchestrated through GitHub Actions, backed by continuous 24/7 telemetry monitoring.</p>
              </li>
            </ol>
          </div>
        </section>

        <section id="portfolio" className="section section-alt" data-reveal style={{ position: 'relative', overflow: 'hidden' }}>
          <PortfolioBackground />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-header">
              <p className="eyebrow">Select Work</p>
              <h2>Proven scale across diverse domains</h2>
            </div>
            <div className="grid portfolio-grid">
              <article className="card portfolio-card" data-reveal style={{ transitionDelay: '0ms' }}>
                <figure className="portfolio-figure">
                  <img src="/portfolio/sir-tarun-rupani.svg" alt="Sir Tarun Rupani Portal" loading="lazy" />
                </figure>
                <header>
                  <h3>Sir Tarun Rupani</h3>
                  <span className="tag">EdTech Scale</span>
                </header>
                <p>Educational content delivery platform engineered to support 20k+ registered students with seamless video streaming and progress analytics.</p>
                <a className="arrow-link" href="https://sirtarunrupani.com" target="_blank" rel="noopener noreferrer">
                  Explore Project
                </a>
              </article>

              <article className="card portfolio-card" data-reveal style={{ transitionDelay: '100ms' }}>
                <figure className="portfolio-figure">
                  <picture>
                    <source srcSet="/portfolio/kashitaxi.webp" type="image/webp" />
                    <img src="/portfolio/kashitaxi.png" alt="Kashitaxi Platform" loading="lazy" />
                  </picture>
                </figure>
                <header>
                  <h3>Kashitaxi.in</h3>
                  <span className="tag">Growth &amp; SEO</span>
                </header>
                <p>Architected a high-performance mobility platform with a programmatic SEO foundation that consistently captures 300+ daily organic leads.</p>
                <a className="arrow-link" href="https://kashitaxi.in" target="_blank" rel="noopener noreferrer">
                  Explore Project
                </a>
              </article>

              <article className="card portfolio-card" data-reveal style={{ transitionDelay: '200ms' }}>
                <figure className="portfolio-figure">
                  <img src="/portfolio/gaadi-diary.svg" alt="Gaadi Diary Dashboard" loading="lazy" />
                </figure>
                <header>
                  <h3>Gaadi Diary</h3>
                  <span className="tag">Travel ERP</span>
                </header>
                <p>Complex multi-tenant SaaS architecture for enterprise travel agencies, simplifying fleet operations, deep analytics, and dynamic billing.</p>
                <a className="arrow-link" href="https://gaadi-diary.vistalabs.in" target="_blank" rel="noopener noreferrer">
                  Explore Project
                </a>
              </article>

              <article className="card portfolio-card" data-reveal style={{ transitionDelay: '300ms' }}>
                <figure className="portfolio-figure">
                  <img src="/portfolio/library-saas.svg" alt="Library SaaS Dashboard" loading="lazy" />
                </figure>
                <header>
                  <h3>Library SaaS</h3>
                  <span className="tag">Enterprise B2B</span>
                </header>
                <p>Enterprise-grade institutional management system with precise member tracking, physical inventory reconciliation, and automated financial engines.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="team" className="section" data-reveal>
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Leadership</p>
              <h2>The team guiding every engagement</h2>
            </div>
            <div className="grid team-grid">
              <article className="card">
                <h3>Abhinav Pandey</h3>
                <p className="role">Owner &amp; CEO</p>
                <p>Drives the strategic vision, partnerships, and measurable outcomes for every client initiative.</p>
              </article>
              <article className="card">
                <h3>Paanshul</h3>
                <p className="role">Tech Lead</p>
                <p>Leads architecture and engineering excellence with playbooks honed at Microsoft and Amazon.</p>
              </article>
              <article className="card">
                <h3>Jainender</h3>
                <p className="role">Infrastructure Head</p>
                <p>Owns the VIstalabs infrastructure estate, partner cloud relations, and the observability systems that keep platforms resilient.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="contact" className="section cta" data-reveal style={{ position: 'relative', overflow: 'hidden' }}>
          <ContactIllustration />
          <div className="container cta-layout" style={{ position: 'relative', zIndex: 1 }}>
            <div>
              <p className="eyebrow">Ready to build?</p>
              <h2>Let's design your next launch together</h2>
              <p className="section-lede">
                Tell us about your goals and we will assemble a blended team of strategy, engineering, and infrastructure experts.
              </p>
            </div>
            <div className="cta-panel">
              <form className="contact-form" onSubmit={handleSubmit} data-testid="booking-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Full name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Ananya Sharma"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Work email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="company">Organisation</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="GovTech Dept. / Stark Mobility"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="timeline">Desired go-live</label>
                    <input
                      id="timeline"
                      name="timeline"
                      type="text"
                      placeholder="Example: 8 weeks"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Tell us about the initiative</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Share what you're building, your user goals, and any success criteria."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-footer">
                  <p className="form-note">We reply within one business day. Attachments welcome in the follow-up email.</p>
                  <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Send booking request'}
                  </button>
                </div>
                {formMessage && (
                  <p
                    className={`form-feedback form-feedback--${formStatus}`}
                    role="status"
                    aria-live="polite"
                  >
                    {formMessage}
                  </p>
                )}
              </form>
              <div className="contact-grid">
                <div>
                  <span className="contact-label">Email</span>
                  <a href="mailto:britz.listen@gmail.com">britz.listen@gmail.com</a>
                </div>
                <div>
                  <span className="contact-label">Phone</span>
                  <a href="tel:+918800939951">+91 88009 39951</a>
                </div>
                <div>
                  <span className="contact-label">Locations</span>
                  <p>Lucknow · Hyderabad · Remote-first</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-layout">
          <p>&copy; 2025 VIstalabs. Crafted with Playwright-tested quality on the VIstalabs managed edge.</p>
          <a className="arrow-link" href="#home">
            Back to top
          </a>
        </div>
      </footer>
    </>
  );
}
