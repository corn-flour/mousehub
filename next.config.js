/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    experimental: {
        serverActions: true,
    },
    modularizeImports: {
        // apparently this might help with dev server perf?
        // https://twitter.com/dobroslav_dev/status/1673361264985161733
        "lucide-react": {
            transform:
                "lucide-react/dist/esm/icons/{{lowerCase kebabCase member}}",
            skipDefaultConversion: true,
        },
    },
}

module.exports = nextConfig
