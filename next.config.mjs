/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@prisma/client', 'bcrypt']
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.module.rules.push({
            test: /\.html$/,
            use: ['null-loader'], // Use null-loader to ignore .html files
        });
        return config;
    },
};

export default nextConfig;
