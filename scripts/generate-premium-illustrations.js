const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public', 'illustrations');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Common SVG definitions for a premium glassmorphic/glowing aesthetic
const commonDefs = `
  <defs>
    <!-- Gradients -->
    <linearGradient id="primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#a1a1aa" stop-opacity="0.2"/>
    </linearGradient>
    <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0066ff" stop-opacity="0.2"/>
    </linearGradient>
    <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02"/>
    </linearGradient>
    <linearGradient id="glass-border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0"/>
    </linearGradient>

    <!-- Filters -->
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
      <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
    </filter>
  </defs>
`;

// Helper to draw a glowing node
const drawNode = (cx, cy, r, color = "#00e5ff", delay = "0s") => `
  <g transform="translate(${cx}, ${cy})">
    <circle cx="0" cy="0" r="${r * 2.5}" fill="${color}" opacity="0.15" filter="url(#glow)">
        <animate attributeName="opacity" values="0.15;0.35;0.15" dur="4s" begin="${delay}" repeatCount="indefinite" />
    </circle>
    <circle cx="0" cy="0" r="${r}" fill="${color}" opacity="0.8">
        <animate attributeName="r" values="${r};${r * 1.2};${r}" dur="4s" begin="${delay}" repeatCount="indefinite" />
    </circle>
  </g>
`;

// Hero Graphic (Abstract floating architecture/dashboard shapes)
const buildHeroGraphic = () => {
    return `
    <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      ${commonDefs}
      
      <!-- Background ambient glow -->
      <circle cx="400" cy="300" r="250" fill="#00e5ff" opacity="0.05" filter="url(#glow-strong)" />
      <circle cx="550" cy="200" r="200" fill="#7800ff" opacity="0.04" filter="url(#glow-strong)" />

      <!-- Back floating element -->
      <g transform="translate(150, 150) rotate(-5)" filter="url(#glass-blur)">
        <rect x="0" y="0" width="300" height="200" rx="20" fill="url(#glass-grad)" stroke="url(#glass-border)" stroke-width="1.5" opacity="0.6"/>
        <line x1="40" y1="50" x2="200" y2="50" stroke="#ffffff" stroke-opacity="0.2" stroke-width="4" stroke-linecap="round" />
        <line x1="40" y1="80" x2="260" y2="80" stroke="#ffffff" stroke-opacity="0.1" stroke-width="4" stroke-linecap="round" />
        <line x1="40" y1="110" x2="180" y2="110" stroke="#ffffff" stroke-opacity="0.1" stroke-width="4" stroke-linecap="round" />
      </g>

      <!-- Connecting lines -->
      <path d="M 350 250 Q 500 150 600 280 T 650 450" fill="none" stroke="url(#accent-grad)" stroke-width="2" stroke-dasharray="4 8" opacity="0.6" filter="url(#glow)">
        <animate attributeName="stroke-dashoffset" from="120" to="0" dur="20s" linear infinite />
      </path>

      <!-- Main foreground floating element -->
      <g transform="translate(250, 220) rotate(2)" filter="url(#glass-blur)">
        <rect x="0" y="0" width="380" height="260" rx="24" fill="url(#glass-grad)" stroke="url(#glass-border)" stroke-width="1.5" />
        
        <!-- Abstract UI inside main card -->
        <rect x="30" y="30" width="80" height="80" rx="16" fill="url(#accent-grad)" opacity="0.2" />
        <circle cx="70" cy="70" r="20" fill="url(#primary-grad)" />
        
        <rect x="130" y="40" width="180" height="12" rx="6" fill="url(#primary-grad)" opacity="0.8" />
        <rect x="130" y="70" width="140" height="8" rx="4" fill="#ffffff" opacity="0.3" />
        <rect x="130" y="90" width="200" height="8" rx="4" fill="#ffffff" opacity="0.1" />

        <!-- Chart representation -->
        <g transform="translate(30, 140)">
           <path d="M 0 80 L 40 50 L 80 65 L 120 30 L 160 45 L 200 10 L 240 25 L 280 0 L 320 15" fill="none" stroke="url(#accent-grad)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
           <path d="M 0 80 L 40 50 L 80 65 L 120 30 L 160 45 L 200 10 L 240 25 L 280 0 L 320 15 L 320 90 L 0 90 Z" fill="url(#accent-grad)" opacity="0.1"/>
        </g>
      </g>

      <!-- Floating Nodes -->
      ${drawNode(120, 380, 6, "#00e5ff", "0s")}
      ${drawNode(650, 180, 8, "#ffffff", "1s")}
      ${drawNode(620, 480, 5, "#00e5ff", "2s")}
      ${drawNode(200, 120, 4, "#ffffff", "1.5s")}

    </svg>
  `;
};

// Service: Product Engineering
const buildEngineeringGraphic = () => {
    return `
      <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        ${commonDefs}
        <g transform="translate(50, 50)">
            <rect x="60" y="0" width="180" height="80" rx="12" fill="url(#glass-grad)" stroke="url(#glass-border)" stroke-width="1"/>
            <rect x="40" y="40" width="160" height="60" rx="12" fill="url(#glass-grad)" stroke="url(#glass-border)" stroke-width="1"/>
            <rect x="20" y="80" width="220" height="100" rx="16" fill="url(#glass-grad)" stroke="url(#accent-grad)" stroke-width="1.5" filter="url(#glow)"/>
            
            <line x1="50" y1="110" x2="160" y2="110" stroke="url(#primary-grad)" stroke-width="6" stroke-linecap="round" />
            <line x1="50" y1="140" x2="200" y2="140" stroke="#ffffff" stroke-opacity="0.3" stroke-width="4" stroke-linecap="round" />
            <line x1="50" y1="160" x2="140" y2="160" stroke="#ffffff" stroke-opacity="0.1" stroke-width="4" stroke-linecap="round" />
        </g>
      </svg>
    `;
};

// Service: Growth & SEO
const buildGrowthGraphic = () => {
    return `
      <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        ${commonDefs}
        <g transform="translate(50, 80)">
            <path d="M 20 150 Q 100 140 150 80 T 280 10" fill="none" stroke="url(#accent-grad)" stroke-width="8" stroke-linecap="round" filter="url(#glow)"/>
            ${drawNode(20, 150, 5, "#ffffff", "0s")}
            ${drawNode(150, 80, 6, "#ffffff", "1s")}
            ${drawNode(280, 10, 8, "#00e5ff", "0s")}
            
            <rect x="20" y="100" width="20" height="60" rx="4" fill="url(#primary-grad)" opacity="0.2"/>
            <rect x="80" y="80" width="20" height="80" rx="4" fill="url(#primary-grad)" opacity="0.3"/>
            <rect x="140" y="110" width="20" height="50" rx="4" fill="url(#primary-grad)" opacity="0.4"/>
            <rect x="200" y="40" width="20" height="120" rx="4" fill="url(#primary-grad)" opacity="0.6"/>
            <rect x="260" y="20" width="20" height="140" rx="4" fill="url(#accent-grad)" opacity="0.8"/>
        </g>
      </svg>
    `;
};

// Service: Infrastructure
const buildInfraGraphic = () => {
    return `
      <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        ${commonDefs}
        <g transform="translate(60, 40)">
            <!-- Server Stack -->
            <rect x="0" y="0" width="240" height="40" rx="8" fill="url(#glass-grad)" stroke="url(#glass-border)" stroke-width="1"/>
            <circle cx="20" cy="20" r="4" fill="#00e5ff" filter="url(#glow)"/>
            <line x1="40" y1="20" x2="80" y2="20" stroke="#ffffff" stroke-opacity="0.2" stroke-width="4" stroke-linecap="round" />

            <rect x="0" y="60" width="240" height="40" rx="8" fill="url(#glass-grad)" stroke="url(#glass-border)" stroke-width="1"/>
            <circle cx="20" cy="80" r="4" fill="#ff00e5" filter="url(#glow)"/>
            <line x1="40" y1="80" x2="100" y2="80" stroke="#ffffff" stroke-opacity="0.2" stroke-width="4" stroke-linecap="round" />

            <rect x="0" y="120" width="240" height="40" rx="8" fill="url(#glass-grad)" stroke="url(#accent-grad)" stroke-width="1"/>
            <circle cx="20" cy="140" r="4" fill="#00e5ff" filter="url(#glow)">
                 <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="40" cy="140" r="4" fill="#00e5ff" filter="url(#glow)">
                 <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" begin="0.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="60" cy="140" r="4" fill="#00e5ff" filter="url(#glow)">
                 <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" begin="1s" repeatCount="indefinite" />
            </circle>
            <line x1="90" y1="140" x2="200" y2="140" stroke="url(#primary-grad)" stroke-width="4" stroke-linecap="round" />
            
            <!-- Connectivity Lines -->
            <path d="M 120 40 L 120 60 M 120 100 L 120 120" stroke="url(#glass-border)" stroke-width="2" stroke-dasharray="2 4"/>
        </g>
      </svg>
    `;
};


fs.writeFileSync(path.join(publicDir, 'hero-graphic.svg'), buildHeroGraphic());
fs.writeFileSync(path.join(publicDir, 'service-engineering.svg'), buildEngineeringGraphic());
fs.writeFileSync(path.join(publicDir, 'service-growth.svg'), buildGrowthGraphic());
fs.writeFileSync(path.join(publicDir, 'service-infra.svg'), buildInfraGraphic());

console.log('✅ Premium SVG illustrations generated in public/illustrations');
