import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.ts'
);

const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_INTERNAL_URL ?? null;

/** @returns {import('next').RemotePattern[]} */
function getBackendCdnPatterns() {
  const patterns = [
    {
      protocol: 'http',
      hostname: 'localhost',
      pathname: '/cdn/**',
    },
    {
      protocol: 'http',
      hostname: '127.0.0.1',
      pathname: '/cdn/**',
    },
    {
      protocol: 'https',
      hostname: 'localhost',
      pathname: '/cdn/**',
    },
    {
      protocol: 'https',
      hostname: '127.0.0.1',
      pathname: '/cdn/**',
    },
  ];

  if (!configuredApiUrl) {
    return patterns;
  }

  try {
    const parsedUrl = new URL(configuredApiUrl);
    patterns.push({
      protocol: parsedUrl.protocol.replace(':', ''),
      hostname: parsedUrl.hostname,
      pathname: '/cdn/**',
      ...(parsedUrl.port ? { port: parsedUrl.port } : {}),
    });
  } catch {
    // Ignore malformed env values and keep static localhost patterns.
  }

  return patterns;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      ...getBackendCdnPatterns(),
    ],
  },
};

export default withNextIntl(nextConfig);
