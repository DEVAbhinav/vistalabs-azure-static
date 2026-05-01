import { OfferingFooter, OfferingHeader } from '../components/OfferingChrome';

export const metadata = {
  title: 'Academic Operations Offering | VIstalabs',
  description:
    'A focused academic offering page for schools that want smoother timetables, attendance, exams, and parent visibility.'
};

const academicHighlights = [
  {
    title: 'Academic KR tracking',
    description: 'Track class-wise targets, academic progress, and performance trends in one clear leadership view.'
  },
  {
    title: 'Attendance and leave',
    description: 'Give teachers and coordinators one place to capture attendance and handle routine leave workflows.'
  },
  {
    title: 'Fees and academic visibility',
    description: 'Bring fee status and academic performance into one view so leadership can spot issues faster.'
  },
  {
    title: 'Results and performance reporting',
    description: 'Publish results, review report cards, and monitor performance trends without waiting for manual summaries.'
  }
];

const outcomes = [
  'Better visibility into academic targets, marks, attendance, and class performance',
  'Faster decisions for principals without asking teams for manual updates',
  'Stronger coordination between academic progress and fee follow-up',
  'A more measurable academic operating model across the institution'
];

function AcademicVisual() {
  return (
    <svg viewBox="0 0 720 520" className="offer-visual-svg" aria-hidden="true">
      <defs>
        <linearGradient id="academic-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.25" />
        </linearGradient>
        <filter id="academic-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="16" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect x="72" y="62" width="576" height="380" rx="34" fill="rgba(6, 15, 31, 0.92)" stroke="rgba(255,255,255,0.1)" />
      <rect x="104" y="96" width="128" height="312" rx="24" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" />
      <rect x="256" y="96" width="360" height="136" rx="24" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" />
      <rect x="256" y="254" width="168" height="154" rx="24" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" />
      <rect x="448" y="254" width="168" height="154" rx="24" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" />
      <path d="M 128 136 L 208 136" stroke="rgba(255,255,255,0.9)" strokeWidth="14" strokeLinecap="round" />
      <path d="M 128 180 L 192 180" stroke="rgba(255,255,255,0.14)" strokeWidth="10" strokeLinecap="round" />
      <path d="M 128 226 L 208 226" stroke="rgba(255,255,255,0.9)" strokeWidth="14" strokeLinecap="round" />
      <path d="M 128 270 L 182 270" stroke="rgba(255,255,255,0.14)" strokeWidth="10" strokeLinecap="round" />
      <path d="M 296 132 L 552 132" stroke="rgba(255,255,255,0.9)" strokeWidth="16" strokeLinecap="round" />
      <path d="M 296 170 L 486 170" stroke="rgba(255,255,255,0.14)" strokeWidth="12" strokeLinecap="round" />
      <path d="M 302 354 L 378 294 L 486 338 L 570 272" fill="none" stroke="url(#academic-glow)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" filter="url(#academic-shadow)" />
      <circle cx="302" cy="354" r="10" fill="#00e5ff" filter="url(#academic-shadow)" />
      <circle cx="570" cy="272" r="12" fill="#ffffff" filter="url(#academic-shadow)" />
    </svg>
  );
}

export default function AcademicOfferingPage() {
  return (
    <>
      <OfferingHeader />
      <main className="offer-page">
        <section className="offer-hero offer-hero--compact">
          <div className="container offer-hero-layout">
            <div className="offer-copy">
              <p className="eyebrow">Academic Offering</p>
              <h1>Give your academic team one workflow for timetable, attendance, exams, and parent updates.</h1>
              <p className="lede">
                A focused academic leadership layer for schools that want clearer visibility into academic progress, performance, and fee-linked student health.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="https://wa.me/918800939951?text=Hi%20VIstalabs,%20I%20want%20to%20know%20more%20about%20the%20Academic%20Offering." target="_blank" rel="noreferrer">
                  WhatsApp now
                </a>
                <a className="btn btn-ghost" href="tel:+918800939951">Call now</a>
              </div>
            </div>
            <div className="offer-visual-shell">
              <AcademicVisual />
              <div className="offer-floating-card">
                <p className="offer-floating-label">Academic operations</p>
                <strong>Academic progress, fee visibility, and leadership tracking in one view.</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Core value</p>
              <h2>Academic performance visibility that leadership can act on quickly.</h2>
            </div>
            <div className="grid offer-card-grid offer-card-grid--four">
              {academicHighlights.map(item => (
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
              <p className="eyebrow">For schools that need</p>
              <h2>Better rhythm across classes, teachers, and parents.</h2>
              <ul className="checklist">
                {outcomes.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="glass-card">
              <p className="eyebrow">Who it helps</p>
              <h2>Built for principals and academic coordinators.</h2>
              <div className="offer-proof-list">
                <div className="offer-proof-item">
                  <strong>For principals</strong>
                  <p>See academic targets, marks, attendance, and performance trends without depending on manual updates.</p>
                </div>
                <div className="offer-proof-item">
                  <strong>For coordinators</strong>
                  <p>Track progress across classes, identify weak spots early, and manage academic follow-up in one place.</p>
                </div>
                <div className="offer-proof-item">
                  <strong>For school owners</strong>
                  <p>Get a cleaner view of school performance by combining academic outcomes with fee visibility.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container offer-cta-strip">
            <div>
              <p className="eyebrow">Talk to us</p>
              <h2>Show your academic workflow in a sharper, more scalable way.</h2>
              <p className="section-lede">We can tailor the walkthrough for principal, coordinator, or school group leadership teams.</p>
            </div>
            <div className="offer-cta-actions">
              <a className="btn btn-primary" href="https://wa.me/918800939951?text=Hi%20VIstalabs,%20I%20want%20an%20Academic%20Offering%20walkthrough." target="_blank" rel="noreferrer">
                WhatsApp VIstalabs
              </a>
              <a className="btn btn-outline" href="tel:+918800939951">
                Speak with VIstalabs
              </a>
            </div>
          </div>
        </section>
      </main>
      <OfferingFooter />
    </>
  );
}
