const phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/
const idCardReg =
  /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
const emailReg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/

export function isPhone(str: string): boolean {
  return phoneReg.test(str)
}

/** 中国大陆身份校验 */
export function isIdCard(str: string): boolean {
  return idCardReg.test(str)
}

export function isEmail(str: string): boolean {
  return emailReg.test(str)
}
