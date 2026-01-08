import { defineConfig } from 'vite';

export default defineConfig({
  // base 设为你的仓库名，确保资源加载路径正确
  base: '/QIM507/',
  build: {
    outDir: 'dist',
  }
});
