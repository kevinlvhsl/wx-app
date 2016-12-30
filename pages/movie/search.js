//search.js
//获取应用实例
var app = getApp()

import api from '../../utils/api.js'

Page({
  data: {
    movies: [],
    searching: true,
    keyword: '',
    focus: false,
    isNewLoad: true,
    total: 0
  },
  onLoad (option) {
    wx.setNavigationBarTitle({
      title: '电影搜索',
      success: function(res) {
        // success
      }
    })
    console.log(option.key)
    this.setData({
      keyword: option.key
    })
    this.searchMovie()
  },
  bindKeyInput: function(e) {
      console.log('输入了', e.detail.value)

    this.setData({
      isNewLoad: true,
      keyword: e.detail.value,
      searching: true
    })
  },
  goMovieDetail (event) {
    const id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: './subject?id='+ id
    })
  },
  onReachBottom () {
    console.log('上拉加载更多了')
    if ( this.data.total - this.data.movies.length) {
      this.searchMovie()
    }
  },
  searchMovie () {
    if (this.data.keyword.trim().length === 0) {
      wx.showToast({
        title: '关键词不能为空！',
        duration: 2000
      })
      this.setData({focus: true})
      return
    }
    console.log('search')
    wx.hideKeyboard()
    wx.showNavigationBarLoading()
    wx.showToast({
      title: '加载数据中...',
      icon: 'loading',
      duration: 5000
    })
    api.searchMovie(this.data.keyword, Math.max(0, this.data.movies.length) , (data) => {
      console.log(data)
      const temp = this.data.isNewLoad ? data.subjects : this.data.movies.concat(data.subjects)
      this.setData({
        movies: temp,
        isNewLoad: false,
        searching: false,
        total: data.total
      })
      wx.hideNavigationBarLoading()
      wx.hideToast()
    }, (res) => {
      console.error('err:', res)
      wx.hideNavigationBarLoading()
    })
  },
  onReady () {

  }
})
