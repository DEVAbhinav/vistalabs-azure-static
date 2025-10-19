'use client';

import { useCallback, useEffect, useState } from 'react';

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
          <a className="brand" href="#home" aria-label="VIstalabs home">
            VIstalabs
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
              <p className="eyebrow">Sovereign infrastructure consultancy · India</p>
              <h1>World-class engineers delivering maintainable technology for lasting impact.</h1>
              <p className="lede">
                Engineers from Microsoft and Amazon co-create with local businesses and government institutions to ship secure, resilient, and future-ready digital platforms.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="mailto:britz.listen@gmail.com">
                  Book a discovery call
                </a>
                <button className="btn btn-ghost" type="button" onClick={() => scrollToSection('portfolio')}>
                  View recent launches
                </button>
              </div>
              <div className="hero-metrics">
                <div className="metric">
                  <span className="metric-value">25+</span>
                  <span className="metric-label">Enterprise builds in production</span>
                </div>
                <div className="metric">
                  <span className="metric-value">65%</span>
                  <span className="metric-label">Hybrid platforms across owned + cloud regions</span>
                </div>
                <div className="metric">
                  <span className="metric-value">0</span>
                  <span className="metric-label">Unplanned outages in 24 months</span>
                </div>
              </div>
            </div>

            <div className="hero-visual" data-reveal>
              <div className="glass-card">
                <h2>Resilient Delivery Platform</h2>
                <p>Ultra-low latency experiences hosted on VIstalabs-owned infrastructure with elastic bursts to GSC and Azure regions.</p>
                <ul className="checklist">
                  <li>Automated CI/CD with continuous hardening</li>
                  <li>24×7 observability across private and partner clouds</li>
                  <li>Serverless extensions that spin up only when required</li>
                </ul>
              </div>
              <div className="glass-card accent">
                <h3>Delivery stack</h3>
                <p>Design → Dev → Test → Deploy → Observe → Maintain</p>
                <div className="stack-tags">
                  <span>DevOps Automation</span>
                  <span>Hybrid Edge</span>
                  <span>Playwright QA</span>
                  <span>IaC</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-glow" aria-hidden="true" />
        </section>

        <section className="credibility" data-reveal>
          <div className="container credibility-wrapper">
            <p className="credibility-title">Trusted by leadership from</p>
            <div className="badge-row">
              <span className="badge">Microsoft alumni engineers</span>
              <span className="badge">Amazon architecture mentors</span>
              <span className="badge">Cloud Solution Architects</span>
              <span className="badge">GovTech specialists</span>
            </div>
          </div>
        </section>

        <section id="services" className="section" data-reveal>
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">What we deliver</p>
              <h2>End-to-end technology services engineered for reliability</h2>
              <p className="section-lede">
                From greenfield builds to modernization, we architect, implement, and operate platforms that scale with your ambition.
              </p>
            </div>
            <div className="grid services-grid">
              <article className="card">
                <h3>Experience &amp; Service Design</h3>
                <p>Research-driven UX, service blueprints, and prototyping to align teams around the customer journey.</p>
              </article>
              <article className="card">
                <h3>Cloud-native Engineering</h3>
                <p>Modular, well-tested applications leveraging React, .NET, and serverless patterns across partner clouds for rapid iteration.</p>
              </article>
              <article className="card">
                <h3>DevSecOps Automation</h3>
                <p>GitHub Actions, Infrastructure as Code, and automated quality gates baked into every deployment.</p>
              </article>
              <article className="card">
                <h3>AI &amp; Data Foundations</h3>
                <p>Operational analytics, data pipelines, and responsible AI integrations tailored to your domain.</p>
              </article>
              <article className="card">
                <h3>Observability &amp; Uptime</h3>
                <p>24×7 monitoring, alerting, and incident response powered by OpenTelemetry pipelines, Grafana, and partner-native tooling.</p>
              </article>
              <article className="card">
                <h3>Managed Services</h3>
                <p>Continuous improvement, compliance updates, and lifecycle management by our infrastructure team.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="platform" className="section section-split" data-reveal>
          <div className="container split-layout">
            <div className="split-copy">
              <p className="eyebrow">Why our platform works</p>
              <h2>A managed platform spanning our racks and trusted clouds</h2>
              <p className="section-lede">
                We blend our own sovereign hardware footprint with partners like GSC and Azure, so you gain global scale, predictable spend, and uncompromised security—without hiring an in-house cloud team.
              </p>
              <ul className="feature-list">
                <li>Blueprints for secure landing zones and hybrid mesh connectivity</li>
                <li>Cost governance embedded in design, monitoring, and runbooks</li>
                <li>Automated compliance checks for public sector workloads</li>
                <li>Zero-downtime releases with blue/green toggles and feature flags</li>
              </ul>
            </div>
            <div className="split-panel">
              <div className="panel-card">
                <h3>Managed estate</h3>
                <p>Our infrastructure head, Jainender, leads a pod that provisions, monitors, and optimizes workloads across VIstalabs servers, GSC, and Azure regions.</p>
                <dl className="stat-grid">
                  <div>
                    <dt>Regions managed</dt>
                    <dd>7</dd>
                  </div>
                  <div>
                    <dt>SLAs maintained</dt>
                    <dd>99.98%</dd>
                  </div>
                  <div>
                    <dt>Security posture</dt>
                    <dd>Tier-1 compliant</dd>
                  </div>
                </dl>
              </div>
              <div className="panel-card highlight">
                <h3>Partnership promise</h3>
                <p>
                  We co-own outcomes—from architecture to QA, launch, and ongoing improvement. Every engagement includes a dedicated solutions architect and delivery lead on-call.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="section" data-reveal>
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">How we deliver</p>
              <h2>A transparent, measurable delivery framework</h2>
            </div>
            <ol className="timeline">
              <li>
                <span className="step">01</span>
                <div>
                  <h3>Discover &amp; Align</h3>
                  <p>Strategy workshops led by Abhinav Pandey to define value, constraints, and success metrics.</p>
                </div>
              </li>
              <li>
                <span className="step">02</span>
                <div>
                  <h3>Architect</h3>
                  <p>Solution blueprints authored by Paanshul, balancing velocity, security, and maintainability.</p>
                </div>
              </li>
              <li>
                <span className="step">03</span>
                <div>
                  <h3>Build &amp; Test</h3>
                  <p>Iterative delivery with automated Playwright, API, and load testing at every sprint.</p>
                </div>
              </li>
              <li>
                <span className="step">04</span>
                <div>
                  <h3>Launch on VIstalabs Platform</h3>
                  <p>Zero-downtime releases orchestrated through GitHub Actions to our sovereign edge and partner clouds.</p>
                </div>
              </li>
              <li>
                <span className="step">05</span>
                <div>
                  <h3>Operate &amp; Evolve</h3>
                  <p>Continuous monitoring, optimization, and roadmap execution from our managed services pod.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section id="portfolio" className="section section-alt" data-reveal>
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Recent launches</p>
              <h2>Transforming ideas into measurable outcomes</h2>
            </div>
            <div className="grid portfolio-grid">
              <article className="card portfolio-card">
                <figure className="portfolio-figure">
                  <picture>
                    <source srcSet="/portfolio/subahebanaras.webp" type="image/webp" />
                    <img src="/portfolio/subahebanaras.png" alt="Hero section of Subahebanaras civic platform" loading="lazy" />
                  </picture>
                </figure>
                <header>
                  <h3>Subahebanaras.net</h3>
                  <span className="tag">GovTech</span>
                </header>
                <p>Digital civic platform modernizing citizen services with multilingual, mobile-ready forms and analytics dashboards.</p>
                <a className="arrow-link" href="https://subahebanaras.net" target="_blank" rel="noopener noreferrer">
                  Visit site
                </a>
              </article>
              <article className="card portfolio-card">
                <figure className="portfolio-figure">
                  <picture>
                    <source srcSet="/portfolio/kashitaxi.webp" type="image/webp" />
                    <img src="/portfolio/kashitaxi.png" alt="Landing page hero of Kashitaxi mobility platform" loading="lazy" />
                  </picture>
                </figure>
                <header>
                  <h3>Kashitaxi.in</h3>
                  <span className="tag">Mobility</span>
                </header>
                <p>Real-time taxi operations platform with mobile-first booking flows, responsive driver dashboards, and automated payouts.</p>
                <a className="arrow-link" href="https://kashitaxi.in" target="_blank" rel="noopener noreferrer">
                  Visit site
                </a>
              </article>
              <article className="card portfolio-card">
                <figure className="portfolio-figure">
                  <picture>
                    <source srcSet="/portfolio/stark-ent.webp" type="image/webp" />
                    <img src="/portfolio/stark-ent.png" alt="Operations dashboard of Stark Enterprises logistics platform" loading="lazy" />
                  </picture>
                </figure>
                <header>
                  <h3>Stark Enterprises</h3>
                  <span className="tag">Supply Chain</span>
                </header>
                <p>Unified control tower for nationwide logistics with tablet-ready workflows, responsive analytics, and fulfilment automations.</p>
                <a className="arrow-link" href="mailto:britz.listen@gmail.com?subject=Stark%20Enterprises%20Demo">
                  Request walkthrough
                </a>
              </article>
              <article className="card portfolio-card">
                <figure className="portfolio-figure portfolio-figure--cluster">
                  <div className="portfolio-thumbs">
                    <div className="portfolio-thumb">
                      <picture>
                        <source srcSet="/portfolio/kashitaxi-mobile-view.webp" type="image/webp" />
                        <img src="/portfolio/kashitaxi-mobile-view.png" alt="Mobile booking flow for Kashitaxi" loading="lazy" />
                      </picture>
                    </div>
                    <div className="portfolio-thumb portfolio-thumb--accent portfolio-thumb--note">
                      <span className="portfolio-thumb__label">Micro-interactions</span>
                    </div>
                  </div>
                  <figcaption>Responsive experience system</figcaption>
                </figure>
                <header>
                  <h3>Experience Showcase</h3>
                  <span className="tag">UX Systems</span>
                </header>
                <p>Interactive library highlighting the visual form system, progressive disclosure, and mobile behaviors we deploy across public sector and mobility clients.</p>
                <a
                  className="arrow-link"
                  href="https://nice-tree-0c9142000.3.azurestaticapps.net"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore demo
                </a>
              </article>
              <article className="card portfolio-card">
                <figure className="portfolio-figure portfolio-figure--gradient">
                  <figcaption>Sovereign GovCloud Toolkit</figcaption>
                </figure>
                <header>
                  <h3>Sovereign GovCloud Toolkit</h3>
                  <span className="tag">Accelerator</span>
                </header>
                <p>Pre-hardened templates enabling compliant deployments across VIstalabs racks, GSC, and Azure in under two weeks.</p>
                <span className="inline-note">Available for qualified public sector partners</span>
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

        <section id="contact" className="section cta" data-reveal>
          <div className="container cta-layout">
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
