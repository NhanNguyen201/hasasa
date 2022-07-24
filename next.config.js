/** @type {import('next').NextConfig} */
const dotenv = require('dotenv')
dotenv.config()


module.exports =  {
  eslint: { ignoreDuringBuilds: true },
  // reactStrictMode: true,
  env: {
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_TOKEN: process.env.SANITY_TOKEN
  }
}
