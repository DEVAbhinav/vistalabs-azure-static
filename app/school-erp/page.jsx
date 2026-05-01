import { OfferingFooter, OfferingHeader } from '../components/OfferingChrome';

export const metadata = {
  title: 'School ERP Solutions | VIstalabs',
  description:
    'A School ERP solution page for principals, school trusts, and leadership teams looking for one unified platform.'
};

const schoolCapabilities = [
  {
    title: 'Admissions to enrollment',
    description: 'Capture enquiries, manage applications, and convert students into active admissions without manual follow-up.'
  },
  {
    title: 'Fees and online payments',
    description: 'Track dues, collect fees online, issue receipts instantly, and give finance teams a clearer view of collections.'
  },
  {
    title: 'Attendance and academics',
    description: 'Manage timetable, attendance, homework, and daily class operations in one place for teachers and coordinators.'
  },
  {
    title: 'Exams and report cards',
    description: 'Run exams, publish results with control, and make report cards available to staff, students, and parents.'
  },
  {
    title: 'Parent communication',
    description: 'Send updates, reminders, circulars, and important notices through one connected communication layer.'
  },
  {
    title: 'Certificates and clearances',
    description: 'Handle certificates and transfer requests with approval-based workflows that reduce delays and errors.'
  }
];

const leadershipBenefits = [
  'One connected system instead of disconnected spreadsheets and apps',
  'Quick mobile access for owners and principals from anywhere',
  'Faster fee tracking and better control over collections',
  'Instant school health visibility without asking teams for updates',
  'Better parent experience through self-service access and updates',
  'Ready for single-campus schools and growing school groups'
];

const audience = ['School Trusts', 'Principals', 'Academic Leaders', 'Admin Teams', 'Finance Teams', 'Parents and Students'];

function SchoolERPVisual() {
  return (
    <svg viewBox="0 0 720 520" className="offer-visual-svg" aria-hidden="true">
      <defs>
        <linearGradient id="offer-grid" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="offer-card" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.04)" />
        </linearGradient>
        <filter id="offer-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect x="60" y="48" width="600" height="400" rx="36" fill="rgba(7, 14, 29, 0.88)" stroke="rgba(255,255,255,0.1)" />
      <rect x="96" y="92" width="168" height="112" rx="24" fill="url(#offer-card)" stroke="rgba(255,255,255,0.08)" />
      <rect x="288" y="92" width="336" height="112" rx="24" fill="url(#offer-card)" stroke="rgba(255,255,255,0.08)" />
      <rect x="96" y="228" width="248" height="176" rx="24" fill="url(#offer-card)" stroke="rgba(255,255,255,0.08)" />
      <rect x="368" y="228" width="256" height="80" rx="24" fill="url(#offer-card)" stroke="rgba(255,255,255,0.08)" />
      <rect x="368" y="324" width="256" height="80" rx="24" fill="url(#offer-card)" stroke="rgba(255,255,255,0.08)" />
      <circle cx="148" cy="132" r="26" fill="url(#offer-grid)" filter="url(#offer-glow)" />
      <path d="M 128 304 L 176 264 L 220 286 L 270 238 L 316 254" fill="none" stroke="url(#offer-grid)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter="url(#offer-glow)" />
      <path d="M 322 144 L 572 144" stroke="rgba(255,255,255,0.9)" strokeWidth="16" strokeLinecap="round" />
      <path d="M 322 176 L 524 176" stroke="rgba(255,255,255,0.18)" strokeWidth="12" strokeLinecap="round" />
      <path d="M 408 268 L 580 268" stroke="rgba(255,255,255,0.82)" strokeWidth="14" strokeLinecap="round" />
      <path d="M 408 296 L 540 296" stroke="rgba(255,255,255,0.14)" strokeWidth="10" strokeLinecap="round" />
      <path d="M 408 364 L 540 364" stroke="rgba(255,255,255,0.82)" strokeWidth="14" strokeLinecap="round" />
      <path d="M 408 392 L 500 392" stroke="rgba(255,255,255,0.14)" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}

export default function SchoolErpPage() {
  return (
    <>
      <OfferingHeader />
      <main className="offer-page">
        <section className="offer-hero">
          <div className="container offer-hero-layout">
            <div className="offer-copy">
              <p className="eyebrow">School ERP</p>
              <h1>One platform to run admissions, academics, fees, and parent communication.</h1>
              <p className="lede">
                Built for school leadership teams that want mobile access to fees, marks, attendance, and key school metrics any time without waiting for manual reports.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="https://wa.me/918800939951?text=Hi%20VIstalabs,%20I%20want%20to%20know%20more%20about%20the%20School%20ERP." target="_blank" rel="noreferrer">
                  WhatsApp now
                </a>
                <a className="btn btn-ghost" href="tel:+918800939951">Call now</a>
              </div>
              <div className="offer-chip-row" aria-label="Ideal for">
                {audience.map(item => (
                  <span key={item} className="badge">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="offer-visual-shell">
              <SchoolERPVisual />
              <div className="offer-floating-card">
                <p className="offer-floating-label">Leadership view</p>
                <strong>Fees, marks, attendance, and school health in one quick mobile view.</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Why schools buy it</p>
              <h2>Designed to solve the work schools deal with every day.</h2>
              <p className="section-lede">
                Give owners and principals one connected mobile-first view of admissions, fees, academics, and parent communication.
              </p>
            </div>
            <div className="grid offer-card-grid">
              {schoolCapabilities.map(item => (
                <article key={item.title} className="card offer-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-alt">
          <div className="container offer-grid-two">
            <div className="glass-card accent">
              <p className="eyebrow">What leadership gets</p>
              <h2>See school health on your phone without asking for data.</h2>
              <ul className="checklist">
                {leadershipBenefits.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="glass-card">
              <p className="eyebrow">Best fit</p>
              <h2>For schools ready to modernize operations.</h2>
              <div className="offer-proof-list">
                <div className="offer-proof-item">
                  <strong>For principals</strong>
                  <p>Get a quick mobile view of fees, attendance, marks, and daily school operations.</p>
                </div>
                <div className="offer-proof-item">
                  <strong>For school trusts</strong>
                  <p>Track school performance and collections across campuses without chasing separate reports.</p>
                </div>
                <div className="offer-proof-item">
                  <strong>For parents</strong>
                  <p>Offer fee payment, attendance updates, circulars, and results in one connected experience.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container offer-cta-strip">
            <div>
              <p className="eyebrow">Next step</p>
              <h2>See how the platform fits your school workflow.</h2>
              <p className="section-lede">We can walk you through admissions, finance, academics, and parent experience in one focused demo.</p>
            </div>
            <div className="offer-cta-actions">
              <a className="btn btn-primary" href="https://wa.me/918800939951?text=Hi%20VIstalabs,%20I%20want%20a%20School%20ERP%20walkthrough." target="_blank" rel="noreferrer">
                WhatsApp VIstalabs
              </a>
              <a className="btn btn-outline" href="tel:+918800939951">
                Call VIstalabs
              </a>
            </div>
          </div>
        </section>
      </main>
      <OfferingFooter />
    </>
  );
}
