function UniversalTime() {
  const now = new Date()
  const utcTimeStamp = now.toISOString()

  return utcTimeStamp
}

export default UniversalTime
