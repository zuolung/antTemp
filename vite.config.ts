import { join, resolve } from 'path'
import fs from 'fs'
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'
import reactPlugin from '@vitejs/plugin-react'
import VitePluginRouters from './plugins/vite-plugin-routers'
import VitePluginStyleImport from './plugins/vite-plugin-style-import'

const CWD = process.cwd()

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    resolve: {
      alias: {
        '@': join(CWD, './src'),
      },
    },

    server: {
      host: '0.0.0.0',
    },

    build: {
      target: 'modules',
      outDir: './build',
      assetsDir: './assets',
      cssTarget: ['chrome38', 'ios10'],
      assetsInlineLimit: 50 * 1024,
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${resolve(
              'src/style/val.less',
            )}";`,
          },
          javascriptEnabled: true,
        },
      },
    },

    plugins: [
      VitePluginRouters({ watch: isDev }),
      VitePluginStyleImport({
        name: 'antd',
        createImport(component) {
          const jsStylePath = `node_modules/antd/es/${component}/style/css.js`
          const cssStylePath = `node_modules/antd/es/${component}/style/index.less`
          if (fs.existsSync(join(CWD, cssStylePath))) {
            return `import "antd/es/${component}/style/index.less"`
          } else if (fs.existsSync(join(CWD, jsStylePath))) {
            return `import "antd/es/${component}/style/css.js"`
          }
        },
      }),
      reactPlugin(),
      legacy({}),
    ],

    optimizeDeps: {
      include: ['antd'],
    },
  }
})
