//movie.js
//获取应用实例
var app = getApp()
import api from '../utils/api.js'

Page({
  data: {
    movies: [],
    keyword: ''
  },
  onShareAppMessage: function () {
    return {
      title: '精彩的电影世界',
      desc: '电影',
      path: '/movie/movie'
    }
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
      keyword: e.detail.value
    })
  },
  serachMov () {
    // 跳转到搜索页面
    app.go('./search', {key: this.data.keyword})

  },
  goMovieDetail (event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: './subject?id='+ id
    })
  }
})
