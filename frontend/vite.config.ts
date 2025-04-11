import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'vite-plugin-md'
import { resolve } from 'path'
import fs from 'fs'



// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };


  return {
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/], // .mdファイルもVueコンポーネントとして扱う
      }),
      Markdown({
        // ここでMarkdownプラグインの設定をカスタマイズ
        markdownItOptions: {
          html: true,
          linkify: true,
          typographer: true,
        },
        // Markdownを前処理
        markdownItSetup(md) {
          // 必要に応じてMarkdown-itプラグインを追加
        },
        // Markdownコンポーネント変換オプション
        transforms: {
          // コンテンツをラップして即時利用可能なコンポーネントにする
          before: (code) => `<template><div class="markdown-content">${code}</div></template>`,
        }
      }),
      // カスタムプラグイン: ビルド後にMDファイルを適切な場所にコピー
      {
        name: 'copy-markdown-files',
        closeBundle() {
          const srcDir = resolve(__dirname, 'src/md');
          const destDir = resolve(__dirname, '../server/static/md');

          // 出力ディレクトリが存在しない場合は作成
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }

          // MDファイルをコピー
          const mdFiles = fs.readdirSync(srcDir).filter(file => file.endsWith('.md'));
          for (const file of mdFiles) {
            fs.copyFileSync(
              resolve(srcDir, file),
              resolve(destDir, file)
            );
            console.log(`Copied: ${file} to /md/`);
          }
        }
      }
    ],
    server: {
      port: 8000
    },
    build: {
      outDir: '../server/static',
      // 静的アセットとしてのMDファイルを処理
      assetsInlineLimit: 0, // すべてのアセットをインライン化しない
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'vue': 'vue/dist/vue.esm-bundler.js',
        // MDファイルへのエイリアスパスを修正
        '@md': fileURLToPath(new URL('./src/md', import.meta.url)),
      },
    },
    // publicDir設定を追加
    publicDir: 'public',
    optimizeDeps: {
      include: ['./src/md/*.md'],
    },
    define: {
      VITE_PRODUCTION: JSON.stringify(process.env.VITE_PRODUCTION === 'true' ? true : false),
      VITE_TEST_WITH_SERVER: JSON.stringify(process.env.VITE_TEST_WITH_SERVER === 'true' ? true : false),
      VITE_SITE_NAME: JSON.stringify(process.env.VITE_SITE_NAME),
      VITE_DEV_KEY_ID: JSON.stringify(process.env.VITE_DEV_KEY_ID),
      VITE_DEV_KEY_SECRET: JSON.stringify(process.env.VITE_DEV_KEY_SECRET),
      VITE_API_URL: JSON.stringify(process.env.VITE_API_URL),
      VITE_API_URL_RETURN_CODE_DATA: JSON.stringify(process.env.VITE_API_URL_RETURN_CODE_DATA),
      VITE_JWT_TOKEN: JSON.stringify(process.env.VITE_JWT_TOKEN),
      VITE_DEV_TOKEN: JSON.stringify(process.env.VITE_DEV_TOKEN),
      VITE_FETCH_JWT_URL: JSON.stringify(process.env.VITE_FETCH_JWT_URL),
      VITE_FIREBASE_API_KEY: JSON.stringify(process.env.VITE_FIREBASE_API_KEY),
      VITE_AUTH_ADMIN: JSON.stringify(process.env.VITE_AUTH_ADMIN),
      VITE_PROJECT_ID: JSON.stringify(process.env.VITE_PROJECT_ID),
      VITE_STORAGE_BUCKET: JSON.stringify(process.env.VITE_STORAGE_BUCKET),
      VITE_MESSAGING_SENDER_ID: JSON.stringify(process.env.VITE_MESSAGING_SENDER_ID),
      VITE_APP_ID: JSON.stringify(process.env.VITE_APP_ID),
      VITE_MEASUREMENT_ID: JSON.stringify(process.env.VITE_MEASUREMENT_ID),
      VITE_SIGNUP_URL: JSON.stringify(process.env.VITE_SIGNUP_URL),
    }
  }
})