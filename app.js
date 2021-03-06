var aldstat = require("./utils/ald-stat.js")
//app.js
App({
    globalData: {
        name: 'kevin',
        age: 26,
        userInfo: null,
        peopleId: new Date().getTime(),
        systemInfo: {},
        playingSongId: '877578',
        lastPlayMusic: wx.getStorageSync('lastPlayMusic') || ''
    },
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        // var logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)
        wx.getSystemInfo({
            success: (res) => {
                this.globalData.systemInfo = res
            }
        })
        // 这里是发起微信登录请求
        wx.login({
            success: function(res) {
                if (res.code) {
                    console.log('code::', res.code)
                    //发起网络请求
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });

    },
    getUserInfo:function(cb){
        var that = this
        if(this.globalData.userInfo){
            typeof cb == "function" && cb(this.globalData.userInfo)
        }else{
            //调用登录接口
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    go(path, params={}, cb) {
        const url = path + '?' + Object.keys(params).map(k=>k + '=' + params[k])
        if (getCurrentPages().length >= 5) {
            wx.redirectTo({
                url,
                success: () => {
                    cb && cb()
                },
                fail: (res) => {
                    console.error('redirectTo 错误', res)
                }
            })
        } else {
            wx.navigateTo({
            url,
            success: () => {
                cb && cb()
            },
            fail: (res) => {
                console.error('navigateTo 错误', res)
            }
        })
        }
    },
})
