//movie.js
//获取应用实例
var app = getApp()
import api from '../../utils/api.js'
app.aldstat.sendEvent("注册")
// import {common} from '../../utils/common.js'

import theaters from './theaters.js'
Page({
  data: {
    in_theaters: [],
    inputValue: '',
    focus: false
  },
  onShareAppMessage: function () {
    return {
      title: '精彩的电影世界',
      desc: '电影',
      path: '/movie/movie'
    }
  },
  onLoad () {
    console.log('load')
    wx.setNavigationBarTitle({
      title: '热映电影',
      success: function(res) {
        // success
      }
    })
    api.getTheaters((data) => {
      // console.log('获取回来的数据：', res.data)
      this.setData({
        in_theaters: data
      }, () => {
        console.log('complete: complete')
        this.setData({
          in_theaters: theaters
        })
      })
    })
  },
  onReady () {
  },
  onPullDownRefresh () {
    console.log('下拉刷新了！！')
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })

    setTimeout(()=>{
      wx.hideToast()
      wx.stopPullDownRefresh()
    }, 3000)

  },
  onReachBottom () {
    console.log('上拉加载更多了')
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  searchMovie () {
    // 跳转到搜索页面
    if (this.data.inputValue.trim().length === 0) {
      wx.showToast({
        title: '关键词不能为空！',
        duration: 2000
      })
      this.setData({focus: true})
      return
    }
    wx.hideKeyboard()
    api.go('./search', {key: this.data.inputValue})
    // wx.navigateTo({
    //   url: './search?key='+ this.data.inputValue
    // })
  },
  goMovieDetail (event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: './subject?id='+ id
    })
  }
})
