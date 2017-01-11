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
        keyword: '',
        focus: false,
        title: '正在上映的电影',
        total: 0,
        page: 0,
        defaultKeywords: [
            {index: 0, text: '成龙'},
            {index: 0, text: '刘德华'},
            {index: 0, text: '香港电影'},
            {index: 0, text: '美国大片'}
        ]
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
    goSearch: function(e) {
        this.setData({
            clicked: true
        })
        setTimeout(()=>{
            app.go('./search', {key: ''})
        }, 300)

    },
    searchMovie (e) {
        // 跳转到搜索页面
        let keyword = e.currentTarget.dataset.keyword
        app.go('./search', {key: keyword})
    },
    goMovieDetail (e) {
        const id = e.currentTarget.dataset.id
        app.go('./subject', {id})
    },
    onShow () {
        this.setData({
            clicked: false
        })
    }
})
