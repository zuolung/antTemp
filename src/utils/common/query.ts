export const queryToObj = (value = '') => {
  const params = {}
  if (value) {
    const curStr: string[] = value.split('&')
    for (let i = 0; i < curStr.length; i++) {
      const item: any = curStr[i]?.split('=')
      params[item[0]] = item[1]
        ? decodeURIComponent(JSON.parse(item[1]))
        : undefined
    }
  }
  return params
}

export const objToQuery = function (obj: Record<string, any>) {
  let queryStr = ''
  const keys = Object.keys(obj).filter((key) => {
    const item = obj[key]
    return item !== undefined
  })
  keys.map((key, index) => {
    const item = obj[key]
    let res = `${key}=${enCodeUrlData(item)}&`
    if (index === keys.length - 1) {
      res = `${key}=${enCodeUrlData(item)}`
    }
    queryStr += res
  })

  return queryStr
}

function enCodeUrlData(d: any) {
  if (typeof d === 'object') {
    return JSON.stringify(encodeURIComponent(d))
  } else {
    return d
  }
}
