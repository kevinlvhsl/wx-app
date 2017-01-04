var aldstat = require("./utils/ald-stat.js")
//app.js
App({
  globalData: {
    name: 'kevin',
    age: 26,
    userInfo: null,
    peopleId: 0
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

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
  }
})
