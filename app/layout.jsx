import './globals.css';

export const metadata = {
  title: 'VIstalabs · Modern Tech Consultancy',
  description:
    'VIstalabs blends veteran engineering talent with resilient in-house infrastructure and modern cloud partners to deliver lasting digital platforms.'
};

export const viewport = {
  themeColor: '#0f8ff8'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
