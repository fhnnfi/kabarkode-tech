import React from 'react';

/**
 * Shell HTML web (expo-router static output). Font Inter + JetBrains Mono
 * dimuat via Google Fonts; meta dasar SEO untuk seluruh halaman.
 * `+html.tsx` merender elemen <html> langsung — inilah kontrak expo-router
 * untuk custom document.
 */
export default function Document({ children }: { children?: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#111111" />
        <meta
          name="description"
          content="KabarKode — kabar terbaru seputar dunia software engineering: programming, framework, AI, keamanan siber, dan open source."
        />
        <title>KabarKode — Kabar Terbaru Dunia Software Engineering</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: bodyReset }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const bodyReset = `
html, body { height:auto; }
body { margin:0; background-color:#F7F7F5; overflow:visible; }
#root { width:100%; min-height:100vh; }
a { text-decoration: none; }
::selection { background:#A3FF12; color:#111111; }
`;
