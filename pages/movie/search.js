//search.js
//获取应用实例
var app = getApp()

import api from '../../utils/api.js'

Page({
  data: {
    movies: [],
    searching: true,
    keyword: '',
    focus: false
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
    wx.showNavigationBarLoading()
    api.searchMovie(option.key, (data) => {
      console.log(data)
      this.setData({
        searchs: data,
        searching: false
      })
      wx.hideNavigationBarLoading()
    }, (res) => {
      wx.hideNavigationBarLoading()
      console.error('err:', res)
    })
  },
  bindKeyInput: function(e) {
      console.log('输入了', e.detail.value)

    this.setData({
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
  searchMovie () {
    if (e.detail.value.trim().length === 0) {
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
    api.searchMovie(this.data.keyword, (data) => {
      console.log(data)
      this.setData({
        searchs: data,
        searching: false
      })
      wx.hideNavigationBarLoading()
    }, (res) => {
      console.error('err:', res)
      wx.hideNavigationBarLoading()
    })
  },
  onReady () {

  }
})
