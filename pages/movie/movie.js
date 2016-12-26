//movie.js
//获取应用实例
var app = getApp()
import api from '../../utils/api.js'

// import {common} from '../../utils/common.js'

import theaters from './theaters.js'
Page({
  data: {
    in_theaters: [],
    inputValue: ''
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
  serachMov () {
    debugger
    // 跳转到搜索页面
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
