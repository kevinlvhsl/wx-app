//movie.js
//获取应用实例
var app = getApp()
import api from '../../utils/api.js'
app.aldstat.sendEvent("注册")
// import common from '../common.js'

import theaters from './theaters.js'
Page({
  data: {
    movies: [],
    inputValue: '',
    focus: false,
    title: '正在上映的电影',
    total: 0,
    page: 0
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
    this.getData()
  },
  onReady () {
  },
  getData () {
    wx.showToast({
      title: '加载数据中...',
      icon: 'loading',
      duration: 5000
    })
    api.getTheaters(this.data.page, (data) => {
      let temp = this.data.movies.concat(data.subjects)
      this.setData({
        movies: temp,
        title: data.title,
        page: this.data.page + 1,
        total: data.total
      })
      wx.hideToast()
    }, () => {
        console.log('error: error')
        this.setData({
          movies: theaters.subjects
        })
    })
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
    if (this.data.movies.length < this.data.total ) {
      this.getData()
    }
  },
  bindKeyInput: function(e) {
    console.log('e:', e)
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
