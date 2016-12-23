const HOST = 'https://api.douban.com'
export default {
  searchMovie (keyword, success, error) {
    wx.request({
      url: HOST + '/v2/movie/search',
      data: {
        q: keyword
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
  }

}
