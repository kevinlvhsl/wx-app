const HOST = 'https://api.douban.com'
export default {
  go(path, params) {
    const url = path + '?' + Object.keys(params).map(k=>k + '=' + params[k])
    if (getCurrentPages().length >= 5) {
      wx.redirectTo({url})
    } else {
      wx.navigateTo({url})
    }
  },
  searchMovie (keyword, start = 0, success) {
    wx.request({
      url: HOST + '/v2/movie/search',
      data: {
        q: encodeURI(keyword),
        start: start
      },
      method: 'GET',
      header: {
          'Content-Type': 'json'
      },
      success: (res) => {
        success && success(res.data)
      },
      fail: (err) => {
        console.error('接口in_theaters 错误了', err)
        error && error()
      }
    })
  },
  getTheaters (success, error) {
    wx.request({
      url: HOST + '/v2/movie/in_theaters',
      data: {
        start: 0,
        count: 9
      },
      method: 'GET',
      header: {
          'Content-Type': 'json'
      },
      success: (res) => {
        success && success(res.data)
      },
      fail: (err) => {
        console.error('接口in_theaters 错误了', err)
        error && error()
      }
    })
  },
  findMovieById (id, success) {
    wx.request({
        url: HOST + `/v2/movie/subject/${id}`,
        method: 'GET',
        header: {
            'Content-Type': 'json'
        },
        success: (res) => {
          success && success(res.data)
        },
        fail: (err) => {
          console.error('接口 subject 错误了', err)
        }
      })
    // return new Promise((resolve, reject) => {
    //   wx.request({
    //     url: HOST + '/movie/subject/${id}',
    //     success: function(res) {
    //       console.log("success")
    //       resolve(res)
    //     },
    //     fail: function (res) {
    //       reject(res)
    //       console.log("failed")
    //     }
    //   })
    // })
  },
  getCelebrityById (id, success, error) {
    wx.request({
      url: HOST + `/v2/movie/celebrity/${id}`,
      method: 'GET',
      header: {
          'Content-Type': 'json'
      },
      success: (res) => {
        success && success(res.data)
      },
      fail: (err) => {
        console.error('接口 subject 错误了', err)
      }
    })
  }

}
