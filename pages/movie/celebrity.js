//movie.js
//获取应用实例
var app = getApp()

import api from '../../utils/api.js'


console.log(api)
Page({
  data: {
    star: ''
  },
  onShareAppMessage: function () {
    return {
      title: '精彩的电影世界',
      desc: '电影',
      path: '/movie/movie'
    }
  },
  onLoad (option) {
    const id = option.id
    console.log(id)
    wx.setNavigationBarTitle({
      title: '影人介绍',
      success: function(res) {
        // success
      }
    })
    // 做缓存，已经加载过的电影，先看缓存中有没有，如有则直接用缓存，没有则加载后缓存
    const celebritys = wx.getStorageSync('celebrity') || {}
    if (celebritys[id]) {
      this.setData({
        star: celebritys[id]
      })
    } else {
      wx.showNavigationBarLoading()
      api.getCelebrityById(id, (data) => {
        console.log(data)
        this.setData({
          star: data
        })
        celebritys[id] = data
        wx.setStorageSync('celebritys', celebritys)
        wx.hideNavigationBarLoading()
      }, (res) => {
        console.error('err:', res)
        wx.hideNavigationBarLoading()
      })

    }


  },
  onReady () {

  }
})
