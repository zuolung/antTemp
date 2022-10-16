import { join, resolve } from 'path'
import fs from 'fs'
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'
import reactPlugin from '@vitejs/plugin-react'
import VitePluginRouters from './plugins/vite-plugin-routers'
import VitePluginStyleImport from './plugins/vite-plugin-style-import'
import proxyConfig from './proxy.config'

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
      proxy: proxyConfig,
    },

    build: {
      target: 'modules',
      outDir: './build',
      assetsDir: './assets',
      cssTarget: ['chrome38', 'ios10'],
      assetsInlineLimit: 50 * 1024,
      chunkSizeWarningLimit: 500,
      sourcemap: true,
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
      legacy({}),
      reactPlugin(),
      VitePluginRouters({ watch: isDev }),
      VitePluginStyleImport({
        name: 'antd',
        createImport: createImport,
      }),
    ],

    optimizeDeps: {
      include: ['antd'],
    },
  }
})

function createImport(component_: string) {
  const component = toLine(component_)
  const jsStylePath = `node_modules/antd/es/${component}/style/css.js`
  if (fs.existsSync(join(CWD, jsStylePath))) {
    return `import "antd/es/${component}/style/index.js"`
  } else {
    return ''
  }
}

function toLine(name) {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase()
}
