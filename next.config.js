/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	exclude: ['react-native-fs'],
};

module.exports = nextConfig;
