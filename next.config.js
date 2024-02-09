/** @type {import('next').NextConfig} */
const nextConfig = {
// add cdninstagram.com add allowd for images
    images: {
        domains: ['cdninstagram.com', 'singularity.2n40.eu'],
    },  

}

module.exports = nextConfig
