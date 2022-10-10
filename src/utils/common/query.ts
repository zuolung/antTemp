export const queryToObj = (value = '') => {
  const params = {}
  if (value) {
    const curStr: string[] = value.split('&')
    for (let i = 0; i < curStr.length; i++) {
      const item: any = curStr[i]?.split('=')
      params[item[0]] = item[1]
    }
  }
  return params
}
