function go(path, params) {
    debugger
  const url = path + '?' + params.map((k, v) => k + '=' + v)
  if (getCurrentPages().length >= 5) {
    wx.redirectTo({url})
  } else {
    wx.navigateTo({url})
  }
}

module.exports = {
  go
}
