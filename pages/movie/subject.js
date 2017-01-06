//movie.js
//获取应用实例
var app = getApp()

import api from '../../utils/api.js'

import theaters from './theaters.js'

console.log(api)
Page({
    data: {
        movie: '',
        meta: ''
    },
    onShareAppMessage: function () {
        return {
            title: '精彩的电影世界',
            desc: '电影',
            path: '/movie/subject'
        }
    },
    onLoad (option) {
        const id = option.id
        console.log(id)
        wx.setNavigationBarTitle({
            title: '电影详情',
            success: function(res) {
                // success
            }
        })
        // 做缓存，已经加载过的电影，先看缓存中有没有，如有则直接用缓存，没有则加载后缓存
        const subjects = wx.getStorageSync('subjects') || {}
        if (subjects[id]) {
            this.setData({
                movie: subjects[id],
                meta: this.getMeta(subjects[id])
            })
        } else {
            wx.showNavigationBarLoading()
            api.findMovieById(id, (data) => {
                console.log(data)
                this.setData({
                    movie: data,
                    meta: this.getMeta(data)
                })
                subjects[id] = data
                wx.setStorageSync('subjects', subjects)
                wx.hideNavigationBarLoading()
            }, (res) => {
                console.error('err:', res)
                wx.hideNavigationBarLoading()
            })

        }
        // theaters.subjects.forEach((item) => {
        //   if (item.id === option.id) {
        //     this.setData({
        //       movie: item,
        //       meta: this.getMeta(item)
        //     })
        //     return
        //   }
        // })

    },
    getMeta (item) {
        var cast = item.casts.reduce((name,value) => {
            return name ? name +' / '+ value.name : value.name
        }, '')
        return item.countries.join(' / ') + ' / ' + item.genres.join(' / ') + ' / ' + item.directors[0].name +'(导演) / '
        // + cast
    },
    showStarDetail (e) {
            console.log('star id:', e.currentTarget.dataset.id)
            app.go('./celebrity', {id: e.currentTarget.dataset.id})
    },
    onReady () {

    }
})
