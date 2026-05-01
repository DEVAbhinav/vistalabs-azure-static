'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function OfferingHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="site-header offering-header">
      <div className="container nav-wrapper">
        <Link className="brand" href="/" aria-label="Vistalabs home">
          Vistalabs<span className="logo-dot">.</span>
        </Link>
        <button
          className={`nav-toggle offering-toggle ${isOpen ? 'is-active' : ''}`}
          type="button"
          aria-label="Toggle education navigation"
          aria-expanded={isOpen ? 'true' : 'false'}
          onClick={() => setIsOpen(open => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`offering-nav ${isOpen ? 'is-open' : ''}`}>
          <div className="offering-links">
            <Link className={`nav-link ${pathname === '/' ? 'is-active' : ''}`} href="/">
              Home
            </Link>
            <Link className={`nav-link ${pathname === '/school-erp' ? 'is-active' : ''}`} href="/school-erp">
              School ERP
            </Link>
            <Link className={`nav-link ${pathname === '/academic-offering' ? 'is-active' : ''}`} href="/academic-offering">
              Academic Offering
            </Link>
            <Link className="nav-link" href="/#contact">
              Contact
            </Link>
          </div>
          <div className="offering-actions">
            <a className="btn btn-sm btn-ghost offering-call" href="tel:+918800939951">
              Call
            </a>
            <a className="btn btn-sm btn-outline nav-cta" href="https://wa.me/918800939951" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export function OfferingFooter() {
  return (
    <footer className="footer">
      <div className="container footer-layout">
        <p>&copy; 2025 VIstalabs. Education platforms designed for schools that want clarity, control, and growth.</p>
        <Link className="arrow-link" href="/">
          Back to home
        </Link>
      </div>
    </footer>
  );
}
