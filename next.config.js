/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      sanityProjectId: "v03w5pfb",
      sanityToken: 'skfaMdsucxpCbQN6BBKocWGhIndnIi5BDgzT2aMqQA6j7ae17Tzs0ZeHqYeMuMJX0FCS58TRbmvBYJPpQ24U1VAvG2uYI39ihjShvDFp6xsqqfmrdQKNdaCFWeiRJBWScm9Xhkpmi5N086sjhsDTsS7yP5LwDJVsYO7FOWQ3dawz8FYrNpyd'
    },
    eslint: { ignoreDuringBuilds: true },
    reactStrictMode: true,
}

module.exports = nextConfig
