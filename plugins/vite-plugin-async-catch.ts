import type { Plugin } from 'vite'
import template from '@babel/template'
import types from '@babel/types'
import { parse } from '@babel/parser'
import tarverse from '@babel/traverse'
import generator from '@babel/generator'
import merge from 'deepmerge'

export default function VitePluginStyleImport(): Plugin {
  return {
    name: `vite:async-catch`,
    transform: async function (code) {
      const ast = parse(code, {
        sourceType: 'module',
      })

      const visitor = {
        AwaitExpression(path) {
          // 判断父路径中是否已存在try语句，若存在直接返回
          if (path.findParent((p) => p.isTryStatement())) {
            return false
          }

          // 合并插件的选项
          const options: any = mergeOptions(this.opts)

          // 获取编译目标文件的路径，如：E:\myapp\src\App.vue
          const filePath = this.filename || this.file.opts.filename || 'unknown'

          // 在排除列表的文件不编译
          if (matchesFile(options.exclude, filePath)) {
            return
          }

          // 如果设置了include，只编译include中的文件
          if (
            options.include.length &&
            !matchesFile(options.include, filePath)
          ) {
            return
          }

          // 获取当前的await节点
          let node = path.node

          // 在父路径节点中查找声明 async 函数的节点
          // async 函数分为4种情况：函数声明 || 箭头函数 || 函数表达式 || 对象的方法
          const asyncPath = path.findParent(
            (p) =>
              p.node.async &&
              (p.isFunctionDeclaration() ||
                p.isArrowFunctionExpression() ||
                p.isFunctionExpression() ||
                p.isObjectMethod()),
          )

          // 获取async的方法名
          let asyncName = ''

          let type = asyncPath.node.type

          switch (type) {
            // 1️⃣函数表达式
            // 情况1：普通函数，如const func = async function () {}
            // 情况2：箭头函数，如const func = async () => {}
            case 'FunctionExpression':
            case 'ArrowFunctionExpression':
              // 使用path.getSibling(index)来获得同级的id路径
              let identifier = asyncPath.getSibling('id')
              // 获取func方法名
              asyncName =
                identifier && identifier.node ? identifier.node.name : ''
              break

            // 2️⃣函数声明，如async function fn2() {}
            case 'FunctionDeclaration':
              asyncName = (asyncPath.node.id && asyncPath.node.id.name) || ''
              break

            // 3️⃣async函数作为对象的方法，如vue项目中，在methods中定义的方法: methods: { async func() {} }
            case 'ObjectMethod':
              asyncName = asyncPath.node.key.name || ''
              break
          }

          // 若asyncName不存在，通过argument.callee获取当前执行函数的name
          let funcName =
            asyncName ||
            (node.argument.callee && node.argument.callee.name) ||
            ''

          const temp = template(tryTemplate)

          // 给模版增加key，添加console.log打印信息
          let tempArgumentObj = {
            // 通过types.stringLiteral创建字符串字面量
            CatchError: types.stringLiteral(
              catchConsole(filePath, funcName, options.customLog),
            ),
          }

          // 通过temp创建try语句
          let tryNode = temp(tempArgumentObj)

          // 获取async节点(父节点)的函数体
          let info = asyncPath.node.body

          // 将父节点原来的函数体放到try语句中
          tryNode.block.body.push(...info.body)

          // 将父节点的内容替换成新创建的try语句
          info.body = [tryNode]
        },
      }

      tarverse(ast, {
        visitor,
      })

      return generator(ast).code
    },
  }
}

// 定义try语句模板
let tryTemplate = `
try {
} catch (e) {
console.log(CatchError,e)
}`

/*
 * catch要打印的信息
 * @param {string} filePath - 当前执行文件的路径
 * @param {string} funcName - 当前执行方法的名称
 * @param {string} customLog - 用户自定义的打印信息
 */
let catchConsole = (filePath, funcName, customLog) => `
filePath: ${filePath}
funcName: ${funcName}
${customLog}:`

// 默认配置
const defaultOptions = {
  customLog: 'Error',
  exclude: ['node_modules'],
  include: [],
}

// 判断执行的file文件 是否在 options 选项 exclude/include 内
function matchesFile(list, filename) {
  return list.find((name) => name && filename.includes(name))
}

function mergeOptions(options) {
  let { exclude, include } = options
  if (exclude) options.exclude = toArray(exclude)
  if (include) options.include = toArray(include)

  // 合并选项
  return merge.all([defaultOptions, options])
}

function toArray(value) {
  return Array.isArray(value) ? value : [value]
}
