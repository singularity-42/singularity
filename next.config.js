/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['cdninstagram.com', 'singularity.2n40.eu'],
    },  
}

if (process.env.NODE_ENV !== 'production') nextConfig.images.domains.push('localhost')

module.exports = nextConfig
