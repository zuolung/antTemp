export const queryToObj = (value = '') => {
  const params = {}
  if (value) {
    const curStr: string[] = value.split('&')
    for (let i = 0; i < curStr.length; i++) {
      const item: any = curStr[i]?.split('=')
      params[item[0]] = item[1] ? deCodeUrlData(item[1]) : undefined
    }
  }
  return params
}

function deCodeUrlData(d: any) {
  const data = decodeURIComponent(d)
  if (typeof data === 'object') {
    return JSON.parse(d)
  } else {
    return d
  }
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
    return encodeURIComponent(JSON.stringify(d))
  } else {
    return d
  }
}
