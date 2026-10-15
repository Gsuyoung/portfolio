// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Vercel 정식 주소. 링크 미리보기(og:image)와 canonical 주소에 쓰입니다.
  site: "https://portfolio-wine-mu-78.vercel.app",
  vite: {
    plugins: [tailwindcss()]
  }
});