//search.js
//获取应用实例
var app = getApp()

import api from '../../utils/api.js'

Page({
  data: {
    movies: [],
    searching: true,
    keyword: ''
  },
  onLoad (option) {
    console.log(option.key)
    this.setData({
      keyword: option.key
    })
    api.searchMovie(option.key, (data) => {
      console.log(data)
      this.setData({
        searchs: data,
        searching: false
      })
    }, (res) => {
      console.error('err:', res)
    })
  },
  bindKeyInput: function(e) {
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
    api.searchMovie(this.keyword, (data) => {
      console.log(data)
      this.setData({
        searchs: data
      })
    }, (res) => {
      console.error('err:', res)
    })
  },
  onReady () {

  }
})
