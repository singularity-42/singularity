/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => [
        {
            source: '/:path*',
            destination: '/pages/:path*',
        },
    ],
    // allow https://i.imgur.com/
    images: {
        domains: ['i.imgur.com'],
    },
    reactStrictMode: true,
    swcMinify: true,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback.fs = false
        }
        return config
    },
}

module.exports = nextConfig
