/** @type {import('tailwindcss').Config} */
module.exports = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
   images: {
    domains: ['localhost'],
  },
};