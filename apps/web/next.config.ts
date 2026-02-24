import type { NextConfig } from "next";

const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_INTERNAL_URL ?? null;

type RemotePatterns = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>;
type RemotePattern = RemotePatterns[number];

function getBackendCdnPatterns(): RemotePatterns {
  const patterns: RemotePatterns = [
    {
      protocol: "http",
      hostname: "localhost",
      pathname: "/cdn/**",
    },
    {
      protocol: "http",
      hostname: "127.0.0.1",
      pathname: "/cdn/**",
    },
    {
      protocol: "https",
      hostname: "localhost",
      pathname: "/cdn/**",
    },
    {
      protocol: "https",
      hostname: "127.0.0.1",
      pathname: "/cdn/**",
    },
  ];

  if (!configuredApiUrl) {
    return patterns;
  }

  try {
    const parsedUrl = new URL(configuredApiUrl);
    const normalizedProtocol = parsedUrl.protocol === "https:" ? "https" : "http";
    const parsedPattern: RemotePattern = {
      protocol: normalizedProtocol,
      hostname: parsedUrl.hostname,
      pathname: "/cdn/**",
      ...(parsedUrl.port ? { port: parsedUrl.port } : {}),
    };
    patterns.push(parsedPattern);
  } catch {
    // Ignore malformed URL values and keep the static localhost patterns.
  }

  return patterns;
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      ...getBackendCdnPatterns(),
    ],
  },
};

export default nextConfig;
