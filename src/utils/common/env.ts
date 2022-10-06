export function getEnv(): string {
  if (/xxx\.com/.test(window.location.hostname)) {
    return 'real'
  }

  return 'dev'
}

export function getIsLocalDev(): boolean {
  return process.env.NODE_ENV === 'development'
}
