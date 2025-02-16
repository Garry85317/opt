const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const url_api = process.env.NEXT_PUBLIC_API_URL;
const url_web = process.env.NEXT_PUBLIC_APP_URL;

const cspHeader = `
  default-src 'self'; 
  script-src ${url_web} https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://api.ipify.org https://static.zdassets.com https://*.zendesk.com 'unsafe-inline' blob: data: 'self' 'unsafe-eval';
  img-src ${url_web} https://static.zdassets.com https://v2assets.zopim.io https://*.zendesk.com https://myaccount.optoma.com 'unsafe-inline' blob: data: 'self';
  object-src data: blob: 'self';
  font-src data: blob: 'self';
  style-src ${url_web} 'unsafe-inline' data: blob: 'self';
  connect-src https://www.cloudflare.com ${url_api} ${url_web} https://www.google-analytics.com https://ekr.zdassets.com https://*.zendesk.com https://zendesk-eu.my.sentry.io ws: wss: 'self'; 
  frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/ data: 'unsafe-inline' 'unsafe-eval' 'self';
  media-src https://static.zdassets.com 'self';
`;

const config = {
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: true,
  },
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "x-frame-options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "autoplay=*, fullscreen=*, microphone=*",
          },
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ]
  },
  exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    return {
      '/maintenance': { page: '/maintenance' },
    };
  },
};

module.exports = withBundleAnalyzer(config);