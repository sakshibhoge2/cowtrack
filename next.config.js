/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname, // 👈 forces correct project root
};

module.exports = nextConfig;
