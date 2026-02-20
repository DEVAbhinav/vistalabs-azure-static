const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/portfolio');

// Ensure directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const commonDefs = `
  <defs>
    <linearGradient id="grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#081127" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3aa0ff" />
      <stop offset="100%" stop-color="#0f8ff8" />
    </linearGradient>
    <linearGradient id="grad-accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#59f3ff" />
      <stop offset="100%" stop-color="#0ea5e9" />
    </linearGradient>
    <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc" />
      <stop offset="100%" stop-color="#7c3aed" />
    </linearGradient>
    <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="glow-sm">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
`;

// Helper to draw subtle grid
const drawGrid = () => {
  let lines = '';
  for (let i = 0; i <= 800; i += 40) {
    lines += `<line x1="${i}" y1="0" x2="${i}" y2="450" stroke="rgba(255,255,255,0.015)" stroke-width="1"/>`;
  }
  for (let i = 0; i <= 450; i += 40) {
    lines += `<line x1="0" y1="${i}" x2="800" y2="${i}" stroke="rgba(255,255,255,0.015)" stroke-width="1"/>`;
  }
  return lines;
};

// Helper to draw random dots for "tech" feel
const drawDots = () => {
  let dots = '';
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 800;
    const y = Math.random() * 450;
    const r = Math.random() * 1.5 + 0.5;
    dots += `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(89, 243, 255, ${Math.random() * 0.5 + 0.1})"/>`;
  }
  return dots;
};

function buildSvg(content) {
  return `<svg width="800" height="450" viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    ${commonDefs}
    <!-- Base dark background with slight radial highlight -->
    <rect width="800" height="450" fill="url(#grad-bg)" />
    <circle cx="400" cy="225" r="300" fill="url(#grad-primary)" opacity="0.05" filter="url(#glow)"/>
    ${drawGrid()}
    ${drawDots()}
    <!-- Specific Content -->
    ${content}
  </svg>`;
}

const svgs = {};

svgs['sams.svg'] = buildSvg(`
  <rect x="40" y="40" width="180" height="370" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)"/>
  <rect x="60" y="70" width="140" height="24" rx="6" fill="url(#grad-primary)" opacity="0.85" filter="url(#glow-sm)"/>
  <rect x="60" y="120" width="100" height="12" rx="4" fill="rgba(255,255,255,0.1)"/>
  <rect x="60" y="150" width="120" height="12" rx="4" fill="rgba(255,255,255,0.1)"/>
  <rect x="60" y="180" width="90" height="12" rx="4" fill="rgba(255,255,255,0.1)"/>

  <rect x="240" y="40" width="520" height="200" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
  <path d="M 240 240 Q 400 300 500 150 T 760 120 L 760 240 L 240 240 Z" fill="url(#grad-accent)" opacity="0.1"/>
  <path d="M 240 200 Q 400 300 500 150 T 760 120" fill="none" stroke="url(#grad-accent)" stroke-width="4" filter="url(#glow)"/>
  <circle cx="500" cy="150" r="6" fill="#fff" filter="url(#glow-sm)"/>
  <circle cx="760" cy="120" r="6" fill="#fff" filter="url(#glow-sm)"/>

  <rect x="240" y="260" width="250" height="150" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)"/>
  <circle cx="365" cy="335" r="45" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="12"/>
  <circle cx="365" cy="335" r="45" fill="none" stroke="url(#grad-primary)" stroke-width="12" stroke-dasharray="200 400" filter="url(#glow)"/>

  <rect x="510" y="260" width="250" height="150" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)"/>
  <rect x="540" y="290" width="190" height="12" rx="4" fill="rgba(255,255,255,0.1)"/>
  <rect x="540" y="325" width="150" height="12" rx="4" fill="rgba(255,255,255,0.1)"/>
  <rect x="540" y="360" width="170" height="12" rx="4" fill="rgba(255,255,255,0.1)"/>
`);

svgs['library-saas.svg'] = buildSvg(`
  <!-- Search Header -->
  <rect x="50" y="50" width="700" height="60" rx="30" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)"/>
  <circle cx="90" cy="80" r="10" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="3"/>
  <line x1="97" y1="87" x2="105" y2="95" stroke="rgba(255,255,255,0.4)" stroke-width="3" stroke-linecap="round"/>
  <rect x="130" y="74" width="200" height="12" rx="6" fill="rgba(255,255,255,0.15)"/>

  <!-- Book Grid -->
  <g transform="translate(50, 150)">
    <rect x="0" y="0" width="160" height="240" rx="12" fill="url(#grad-emerald)" opacity="0.8" filter="url(#glow)"/>
    <rect x="0" y="0" width="160" height="240" rx="12" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)"/>
    <rect x="20" y="40" width="120" height="16" rx="4" fill="#fff" opacity="0.9"/>
    <rect x="20" y="70" width="80" height="10" rx="5" fill="#fff" opacity="0.6"/>
    
    <rect x="180" y="0" width="160" height="240" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
    <rect x="200" y="40" width="120" height="16" rx="4" fill="rgba(255,255,255,0.2)"/>
    <rect x="200" y="70" width="80" height="10" rx="5" fill="rgba(255,255,255,0.1)"/>

    <rect x="360" y="0" width="160" height="240" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
    <rect x="380" y="40" width="120" height="16" rx="4" fill="rgba(255,255,255,0.2)"/>
    
    <rect x="540" y="0" width="160" height="240" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
    <rect x="560" y="40" width="120" height="16" rx="4" fill="rgba(255,255,255,0.2)"/>
  </g>
`);

svgs['gaadi-diary.svg'] = buildSvg(`
  <!-- Map abstract -->
  <path d="M 100 350 C 200 300, 300 400, 450 250 S 600 150, 750 200" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="12" stroke-linecap="round"/>
  <path d="M 100 350 C 200 300, 300 400, 450 250 S 600 150, 750 200" fill="none" stroke="url(#grad-primary)" stroke-width="4" stroke-linecap="round" filter="url(#glow)"/>
  
  <!-- Location markers -->
  <circle cx="100" cy="350" r="10" fill="#fff" filter="url(#glow-sm)"/>
  <circle cx="450" cy="250" r="14" fill="url(#grad-accent)" filter="url(#glow)"/>
  <circle cx="450" cy="250" r="6" fill="#020617"/>
  <circle cx="750" cy="200" r="10" fill="#fff" filter="url(#glow-sm)"/>

  <!-- UI floating over map -->
  <rect x="40" y="40" width="300" height="160" rx="16" fill="rgba(13, 19, 33, 0.85)" stroke="rgba(255,255,255,0.1)" filter="drop-shadow(0 20px 40px rgba(0,0,0,0.5))"/>
  <rect x="70" y="70" width="50" height="50" rx="12" fill="url(#grad-primary)" opacity="0.9"/>
  <rect x="140" y="80" width="150" height="14" rx="7" fill="rgba(255,255,255,0.8)"/>
  <rect x="140" y="105" width="100" height="10" rx="5" fill="rgba(255,255,255,0.4)"/>
  <line x1="70" y1="150" x2="310" y2="150" stroke="rgba(255,255,255,0.1)"/>
  <rect x="70" y="170" width="80" height="10" rx="5" fill="url(#grad-accent)"/>

  <rect x="580" y="40" width="180" height="100" rx="16" fill="rgba(13, 19, 33, 0.85)" stroke="rgba(255,255,255,0.1)"/>
  <rect x="610" y="65" width="120" height="10" rx="5" fill="rgba(255,255,255,0.6)"/>
  <rect x="610" y="95" width="80" height="14" rx="7" fill="url(#grad-accent)"/>
`);

svgs['vibevoice.svg'] = buildSvg(`
  <!-- Glowing central orb -->
  <circle cx="400" cy="225" r="120" fill="url(#grad-purple)" opacity="0.3" filter="url(#glow)"/>
  <circle cx="400" cy="225" r="80" fill="url(#grad-accent)" opacity="0.5" filter="url(#glow)"/>

  <!-- Soundwaves -->
  <g stroke="url(#grad-primary)" stroke-linecap="round" filter="url(#glow-sm)">
    <line x1="100" y1="225" x2="100" y2="225" stroke-width="12"/>
    <line x1="140" y1="180" x2="140" y2="270" stroke-width="12"/>
    <line x1="180" y1="140" x2="180" y2="310" stroke-width="12"/>
    <line x1="220" y1="80" x2="220" y2="370" stroke-width="12" stroke="url(#grad-accent)"/>
    <line x1="260" y1="120" x2="260" y2="330" stroke-width="12"/>
    <line x1="300" y1="160" x2="300" y2="290" stroke-width="12"/>
    <line x1="340" y1="200" x2="340" y2="250" stroke-width="12" />
    
    <!-- Mirror side -->
    <line x1="460" y1="190" x2="460" y2="260" stroke-width="12"/>
    <line x1="500" y1="140" x2="500" y2="310" stroke-width="12"/>
    <line x1="540" y1="90" x2="540" y2="360" stroke-width="12" stroke="url(#grad-accent)"/>
    <line x1="580" y1="150" x2="580" y2="300" stroke-width="12"/>
    <line x1="620" y1="190" x2="620" y2="260" stroke-width="12"/>
    <line x1="660" y1="210" x2="660" y2="240" stroke-width="12"/>
    <line x1="700" y1="225" x2="700" y2="225" stroke-width="12"/>
  </g>
`);

svgs['bharat-tourism.svg'] = buildSvg(`
  <defs>
    <linearGradient id="grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>
  </defs>
  
  <!-- Hero Section Abstract -->
  <rect x="40" y="40" width="720" height="220" rx="20" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)"/>
  <rect x="40" y="40" width="720" height="220" rx="20" fill="url(#grad-gold)" opacity="0.1" filter="url(#glow)"/>
  <circle cx="400" cy="150" r="100" fill="url(#grad-gold)" opacity="0.2" filter="url(#glow)"/>
  <path d="M 350 260 L 400 120 L 450 260 Z" fill="rgba(255,255,255,0.1)"/>
  
  <rect x="300" y="120" width="200" height="24" rx="12" fill="#fff" opacity="0.9"/>
  <rect x="350" y="160" width="100" height="12" rx="6" fill="rgba(255,255,255,0.6)"/>
  
  <!-- Cards -->
  <rect x="40" y="280" width="220" height="130" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
  <rect x="60" y="300" width="80" height="80" rx="12" fill="url(#grad-gold)" opacity="0.8"/>
  <rect x="160" y="320" width="80" height="10" rx="5" fill="rgba(255,255,255,0.4)"/>
  <rect x="160" y="340" width="60" height="10" rx="5" fill="rgba(255,255,255,0.2)"/>

  <rect x="290" y="280" width="220" height="130" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
  <rect x="310" y="300" width="80" height="80" rx="12" fill="url(#grad-primary)" opacity="0.8"/>
  
  <rect x="540" y="280" width="220" height="130" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
  <rect x="560" y="300" width="80" height="80" rx="12" fill="url(#grad-accent)" opacity="0.8"/>
`);

svgs['sir-tarun-rupani.svg'] = buildSvg(`
  <!-- Video Player -->
  <rect x="40" y="40" width="480" height="280" rx="16" fill="#000" stroke="rgba(255,255,255,0.1)"/>
  <rect x="40" y="40" width="480" height="280" rx="16" fill="url(#grad-primary)" opacity="0.15"/>
  <circle cx="280" cy="180" r="32" fill="rgba(255,255,255,0.2)"/>
  <polygon points="270,165 298,180 270,195" fill="#fff" filter="url(#glow-sm)"/>
  <rect x="60" y="290" width="440" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
  <rect x="60" y="290" width="240" height="6" rx="3" fill="url(#grad-accent)" filter="url(#glow-sm)"/>

  <!-- Module List -->
  <rect x="540" y="40" width="220" height="370" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)"/>
  <rect x="560" y="60" width="120" height="16" rx="8" fill="rgba(255,255,255,0.8)"/>
  
  <rect x="560" y="100" width="180" height="40" rx="8" fill="rgba(255,255,255,0.08)"/>
  <rect x="560" y="150" width="180" height="40" rx="8" fill="rgba(255,255,255,0.08)"/>
  <rect x="560" y="200" width="180" height="40" rx="8" fill="url(#grad-primary)" opacity="0.4" stroke="url(#grad-accent)"/>
  <rect x="560" y="250" width="180" height="40" rx="8" fill="rgba(255,255,255,0.08)"/>
  <rect x="560" y="300" width="180" height="40" rx="8" fill="rgba(255,255,255,0.08)"/>

  <rect x="40" y="350" width="300" height="16" rx="8" fill="rgba(255,255,255,0.8)"/>
  <rect x="40" y="380" width="400" height="10" rx="5" fill="rgba(255,255,255,0.4)"/>
`);

svgs['banaras-insider.svg'] = buildSvg(`
  <!-- Hero Article -->
  <rect x="40" y="40" width="460" height="240" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
  <rect x="40" y="40" width="460" height="140" fill="url(#grad-primary)" opacity="0.3" clip-path="inset(0 0 0 0 round 16px 16px 0 0)"/>
  <rect x="70" y="200" width="280" height="16" rx="8" fill="rgba(255,255,255,0.9)"/>
  <rect x="70" y="235" width="200" height="10" rx="5" fill="rgba(255,255,255,0.4)"/>
  <rect x="70" y="255" width="160" height="10" rx="5" fill="rgba(255,255,255,0.4)"/>
  
  <!-- Side Article 1 -->
  <rect x="520" y="40" width="240" height="180" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
  <rect x="540" y="60" width="60" height="60" rx="12" fill="url(#grad-accent)" opacity="0.6"/>
  <rect x="540" y="140" width="180" height="12" rx="6" fill="rgba(255,255,255,0.7)"/>
  <rect x="540" y="165" width="120" height="10" rx="5" fill="rgba(255,255,255,0.3)"/>

  <!-- Side Article 2 -->
  <rect x="520" y="240" width="240" height="170" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
  <rect x="540" y="260" width="180" height="12" rx="6" fill="rgba(255,255,255,0.7)"/>

  <!-- Bottom Article -->
  <rect x="40" y="300" width="460" height="110" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
  <rect x="60" y="320" width="80" height="70" rx="12" fill="url(#grad-purple)" opacity="0.5"/>
  <rect x="160" y="330" width="200" height="12" rx="6" fill="rgba(255,255,255,0.7)"/>
`);

svgs['seo-tools.svg'] = buildSvg(`
  <!-- Top Stats -->
  <rect x="40" y="40" width="220" height="90" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
  <rect x="60" y="60" width="40" height="10" rx="5" fill="rgba(255,255,255,0.4)"/>
  <rect x="60" y="85" width="100" height="20" rx="10" fill="url(#grad-primary)"/>

  <rect x="290" y="40" width="220" height="90" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
  <rect x="310" y="60" width="40" height="10" rx="5" fill="rgba(255,255,255,0.4)"/>
  <rect x="310" y="85" width="80" height="20" rx="10" fill="url(#grad-accent)"/>
  
  <rect x="540" y="40" width="220" height="90" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>

  <!-- Main Chart -->
  <rect x="40" y="160" width="720" height="250" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)"/>
  <!-- Grid lines -->
  <line x1="80" y1="200" x2="720" y2="200" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4"/>
  <line x1="80" y1="270" x2="720" y2="270" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4"/>
  <line x1="80" y1="340" x2="720" y2="340" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4 4"/>
  
  <!-- Line Chart -->
  <path d="M 80 340 L 160 280 L 250 300 L 350 200 L 450 240 L 550 180 L 650 210 L 720 120" fill="none" stroke="url(#grad-accent)" stroke-width="4" filter="url(#glow)"/>
  <path d="M 80 340 L 160 280 L 250 300 L 350 200 L 450 240 L 550 180 L 650 210 L 720 120 L 720 380 L 80 380 Z" fill="url(#grad-accent)" opacity="0.1"/>
`);

svgs['finance-ai.svg'] = buildSvg(`
  <!-- Left Panel: Candlesticks -->
  <rect x="40" y="40" width="460" height="370" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)"/>
  
  <!-- Candlestick 1 -->
  <line x1="100" y1="120" x2="100" y2="220" stroke="url(#grad-emerald)" stroke-width="2"/>
  <rect x="90" y="150" width="20" height="40" rx="4" fill="url(#grad-emerald)" filter="url(#glow-sm)"/>
  <!-- Candlestick 2 -->
  <line x1="160" y1="180" x2="160" y2="280" stroke="#f43f5e" stroke-width="2"/>
  <rect x="150" y="200" width="20" height="60" rx="4" fill="#f43f5e"/>
  <!-- Candlestick 3 -->
  <line x1="220" y1="100" x2="220" y2="240" stroke="url(#grad-emerald)" stroke-width="2"/>
  <rect x="210" y="120" width="20" height="80" rx="4" fill="url(#grad-emerald)" filter="url(#glow-sm)"/>
  <!-- Candlestick 4 -->
  <line x1="280" y1="80" x2="280" y2="180" stroke="url(#grad-emerald)" stroke-width="2"/>
  <rect x="270" y="90" width="20" height="50" rx="4" fill="url(#grad-emerald)" filter="url(#glow-sm)"/>
  <!-- Candlestick 5 -->
  <line x1="340" y1="140" x2="340" y2="220" stroke="#f43f5e" stroke-width="2"/>
  <rect x="330" y="150" width="20" height="40" rx="4" fill="#f43f5e"/>
  <!-- Candlestick 6 -->
  <line x1="400" y1="100" x2="400" y2="200" stroke="url(#grad-emerald)" stroke-width="2"/>
  <rect x="390" y="140" width="20" height="40" rx="4" fill="url(#grad-emerald)" filter="url(#glow-sm)"/>

  <!-- Trendline -->
  <path d="M 80 250 L 200 280 L 300 200 L 420 160" fill="none" stroke="url(#grad-primary)" stroke-width="4" stroke-dasharray="6 6" filter="url(#glow)"/>

  <!-- Right Panel: AI Nodes -->
  <rect x="520" y="40" width="240" height="370" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)"/>
  <line x1="640" y1="100" x2="580" y2="180" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <line x1="640" y1="100" x2="700" y2="180" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <line x1="580" y1="180" x2="640" y2="260" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  <line x1="700" y1="180" x2="640" y2="260" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
  
  <circle cx="640" cy="100" r="16" fill="url(#grad-accent)" filter="url(#glow)"/>
  <circle cx="580" cy="180" r="12" fill="url(#grad-primary)"/>
  <circle cx="700" cy="180" r="12" fill="url(#grad-primary)"/>
  <circle cx="640" cy="260" r="20" fill="url(#grad-purple)" filter="url(#glow)"/>

  <rect x="560" y="320" width="160" height="10" rx="5" fill="rgba(255,255,255,0.4)"/>
  <rect x="580" y="350" width="120" height="8" rx="4" fill="rgba(255,255,255,0.2)"/>
`);

// Write files
for (const [name, content] of Object.entries(svgs)) {
  fs.writeFileSync(path.join(outDir, name), content);
  console.log("Successfully wrote " + name);
}
