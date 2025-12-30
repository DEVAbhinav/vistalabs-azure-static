# School Solutions Dashboard

This directory contains landing pages and interactive tools for school-focused offerings.

## Files

### cbse-compliance-dashboard.html
**URL:** `/school/cbse-compliance-dashboard.html` or `/school/cbse-compliance-dashboard`

Interactive dashboard for CBSE schools to audit their compliance readiness for:
- CBSE Circular 10/2023 (Digital Infrastructure)
- SAFAL 2025 (Digital Assessment)
- AI Curriculum 2026

**Features:**
- Real-time compliance scoring with interactive checklists
- ROI calculator for manual vs. automated processes
- Service package comparison (Starter vs. Advanced)
- Timeline visualization of upcoming mandates

**Technologies:**
- TailwindCSS (via CDN)
- Chart.js for data visualization
- Vanilla JavaScript for interactivity

## Deployment

When deployed to Azure Static Web Apps, this page will be accessible at:
- **Production:** `https://vistalabs.in/school/cbse-compliance-dashboard.html`
- **Alternative:** `https://vistalabs.in/school/cbse-compliance-dashboard`

The `staticwebapp.config.json` has been configured to exclude `/school/*` from Next.js routing,
allowing these HTML files to be served directly as static assets.
