// 和UI无关的全局数据存储在这里，和UI相关的全局数据存储在store.ts文件中
import Cache from '@antmjs/cache'

const {
  cacheGetSync,
  cacheGet,
  cacheSetSync,
  cacheSet,
  cacheRemoveSync,
  cacheRemove,
} = Cache({
  ram: {},
  loc: {
    token: '',
    userId: '',
  },
})

export {
  cacheGetSync,
  cacheGet,
  cacheSetSync,
  cacheSet,
  cacheRemoveSync,
  cacheRemove,
}
