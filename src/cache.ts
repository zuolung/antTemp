// 和UI无关的全局数据存储在这里，和UI相关的全局数据存储在store.ts文件中
import Cache from '@antmjs/cache/dist/h5'

const { cacheGetSync, cacheSetSync } = Cache({
  ram: {},
  loc: {
    token: '',
    userId: '',
  },
})

export { cacheGetSync, cacheSetSync }
