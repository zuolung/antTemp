module.exports = {
  // https://www.npmjs.com/package/@antmjs/api
  api: {
    title: 'antTemp-接口文档',
    buildPort: 8981,
    action: {
      dirPath: '../actions',
      createDefaultModel: function ({
        requestImport = "import { createFetch } from '@/utils/request'",
        requestFnName = 'createFetch',
        fileName = 'a',
        data = {},
      }) {
        const packages = []
        let requestActionsStr = ''
        // 根据data拼接多个业务请求方法
        for (const key in data) {
          const item = data[key]
          // 需要判断item.description && item.url
          if (key !== 'Record<string,any>' && item.description && item.url) {
            const item = data[key]
            packages.push(key)
            requestActionsStr += `
            // ${item.description}
            export const ${key}${fileName?.replace(/^\S/, function (s) {
              return s.toUpperCase()
            })} = ${requestFnName}<${key}['request'], ${key}['response']>('${
              item.url
            }', '${item.method}');
            `
          }
        }

        const packagesStr = packages.join(',')

        return `
          // @ts-nocheck
          ${requestImport}
          import type { ${packagesStr} } from '../types/${fileName}';
      
          ${requestActionsStr}
          `
      },
    },
    mock: {
      port: 9999,
    },
  },
}
