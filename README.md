# VIstalabs - Top Tier Tech Consultancy

## About
VIstalabs is a top-tier tech consultancy where engineers from Microsoft and Amazon work part-time to provide world-class technology solutions to local businesses and government institutions.

## Services
- **Tech Design & Architecture** - Scalable system design and planning
- **Development** - Full-stack development with modern frameworks
- **Cloud Hosting** - Deployment on Azure with optimal performance
- **Testing & QA** - Comprehensive testing and quality assurance
- **Maintenance & Support** - Ongoing support and maintenance
- **Server Management** - Complete infrastructure management

## Leadership Team
- **Abhinav Pandey** - Owner & CEO
- **Paanshul** - Tech Lead
- **Jainender** - Infrastructure Head

## Portfolio
- [Subahebanaras.net](https://subahebanaras.net)
- [Kashitaxi.in](https://kashitaxi.in)

## Deployment
This site is deployed to the VIstalabs managed edge, presently backed by Azure Static Web Apps and GitHub Actions automation.

### Deploy to VIstalabs managed edge (Azure Static Web Apps)

1. Create an Azure Static Web App in the Azure Portal
2. Connect your GitHub repository
3. Azure will automatically add the deployment token to your repository secrets
4. Push to the `master` branch to trigger deployment

### Local Development

```bash
npm install
npm run dev
```

Visit `http://127.0.0.1:4173` in your browser. Run the Playwright regression suite with `npm test`. After `npm run build`, inspect the static export with `npm run preview`.

### Asset Optimization

Use `npm run optimize:images` whenever you add images to `public/portfolio` to generate compressed PNGs and WebP variants automatically.

### Booking Form API

The booking form posts to `api/bookings`, an Azure Function that sends emails through Resend. Configure the following secrets in your hosting environment:

```
RESEND_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev # optional, defaults to this trial address
RESEND_TO_EMAIL=abhinavpandey.1996@gmail.com
RESEND_CC_EMAIL=britz.listen@gmail.com
```

For local Azure Functions development add these keys to `api/local.settings.json` (ignored in Git).

## Technology Stack
- Next.js 14 with the App Router
- React 18
- VIstalabs managed edge across Azure and GSC regions
- Playwright for automated QA and visual baselines
- GitHub Actions for CI/CD
- Azure Functions + Resend for booking notifications

## License
© 2025 VIstalabs. All rights reserved.