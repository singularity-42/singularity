/** @type {import('next').NextConfig} */
const nextConfig = {
// add cdninstagram.com add allowd for images
    images: {
        domains: ['cdninstagram.com', 'localhost'],
    },  

}

module.exports = nextConfig
