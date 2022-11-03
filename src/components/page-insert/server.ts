import fs from 'fs'
import http from 'http'
import path from 'path'
import getDirTree from 'node-dir-tree'
import ejs from 'ejs'
import prettier from 'prettier'

const CWD = process.cwd()
const SERVER_PORT = 8181

const server = http.createServer(function (req, res) {
  const url = req.url
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-type', 'application/json')

  if (url === '/dir/tree') {
    const target = path.join(CWD, './src/pages')
    getDirTree(target).then((data) => {
      res.end(JSON.stringify(transformTree(data)))
    })
  }

  if (url === '/dir/update') {
    let postData = ''
    req.on('data', function (chuck) {
      postData += chuck.toString()
    })

    req.on('end', async function () {
      const reqData = JSON.parse(postData)
      const addDirPath = path.join(
        `${CWD}`,
        reqData.target,
        reqData.addDir || '',
      )
      if (!fs.existsSync(addDirPath)) {
        fs.mkdirSync(addDirPath)
      } else if (reqData.addDir) {
        return res.end(
          JSON.stringify({ success: false, message: '新建文件夹已存在' }),
        )
      }

      for (let i = 0; i < reqData.pageTypes.length; i++) {
        const targetName = reqData.pageTypes[i]
        const insertFilePath = path.join(addDirPath, `${targetName}.tsx`)
        const ejsCon = fs.readFileSync(
          path.join(__dirname, `./template/${targetName}.ejs`),
          'utf-8',
        )

        if (!fs.existsSync(insertFilePath)) {
          await fs.writeFileSync(
            insertFilePath,
            formatCode(
              ejs.render(ejsCon, {
                ...reqData,
                targetUrl: reqData.addDir
                  ? `${reqData.target.replace('/src/pages', '')}/${
                      reqData.addDir
                    }`
                  : reqData.target.replace('/src/pages', ''),
              }),
            ),
          )
        } else
          return res.end(
            JSON.stringify({
              success: false,
              message: `文件${targetName}已存在`,
            }),
          )
      }

      return res.end(
        JSON.stringify({
          success: true,
        }),
      )
    })
  }
})

server.listen(SERVER_PORT, () => {
  console.info(`page server start success: http://localhost:${SERVER_PORT}`)
})

function transformTree(data) {
  data.title = data.name
  data.key = data.path
  data.originPath = data.path
  if (!data.children) data.children = []
  if (data.children && data.children.length) {
    data.children.forEach((item) => {
      transformTree(item)
    })
  }

  return data
}

function formatCode(codeStr) {
  return prettier.format(codeStr, { semi: false, parser: 'typescript' })
}
