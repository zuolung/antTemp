import Trace, { EGcs, EAppType, EAppSubType } from '@antmjs/trace/dist/h5'
import { cacheGetSync } from '@/cache'

// https://github.com/AntmJS/antm/tree/main/packages/trace
const { exposure, log, monitor } = Trace(
  {
    appId: '1',
    appType: EAppType.browser,
    appSubType: EAppSubType.browser,
    // 应用内应用版本号
    appSubTypeVersion: '123',
    getUserId() {
      return new Promise((resolve) => {
        const userId = cacheGetSync('userId')
        resolve(userId || '')
      })
    },
    getGenderId() {
      return new Promise((resolve) => {
        resolve('')
      })
    },
    getLocation() {
      return new Promise((resolve) => {
        resolve({
          gcs: EGcs.gcj02,
          latitude: '',
          longitude: '',
        })
      })
    },
    request(type /** log｜monitor */, data) {
      console.info(type, data)
    },
  },
  // 默认为0。为0的话request返回的data是对象，非0的话返回数组
  { interval: 3000 },
)

export { exposure, log, monitor }
