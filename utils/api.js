const HOST = 'https://api.douban.com'
export default {
    getToken (cb) {
        let now = Date.now() / 1000
        var tokenInfo = wx.getStorageSync('ACCESS_TOKEN_INFO') || {}
        debugger
        // 如果已有token并且未失效
        if (tokenInfo.access_token && tokenInfo.expires_in > now) {
            cb && cb(tokenInfo.access_token)
        } else {
            let APPID = 'wx7f34ed77698751ef',
            APPSECRET = '0546e69e53d9c06877ddeae4a8749e2c'
            wx.request({
                url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`,
                success: (res) => {
                    console.log('获取token：：：', res)
                    wx.setStorageSync('ACCESS_TOKEN_INFO', res)
                    cb && cb(res.access_token)
                }
            })
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
    getTheaters (page = 0, success, error) {
        wx.request({
            url: HOST + '/v2/movie/in_theaters',
            data: {
                start: page * 20,
                count: 20
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
