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
    const self = this
    console.log('theaters:::', theaters)
    api.getTheaters((data) => {
      // console.log('获取回来的数据：', res.data)
      this.setData({
        in_theaters: data
      }, () => {
        console.log('complete: complete')
        self.setData({
          in_theaters: theaters
        })
      })
    })
  },
  onReady () {
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
