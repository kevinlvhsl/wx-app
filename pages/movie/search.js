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
        total: 0,
        historys: [
            {index: 0, text: '成龙'},
            {index: 0, text: '刘德华'},
            {index: 0, text: '香港电影'},
            {index: 0, text: '美国大片'}
        ]
    },
    onLoad (option) {
        wx.setNavigationBarTitle({
            title: '电影搜索',
            success: function(res) {
                // success
            }
        })
        console.log(option.key)
        if (option.key) {
            this.setData({
                keyword: option.key
            })
            this.searchMovie()
        }
        let hs = wx.getStorageSync("SEARCH_HISTORYS") || []
        this.setData({
            historys: hs
        })
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
    clearHistory () {
        wx.removeStorageSync("SEARCH_HISTORYS")
        this.setData({
            historys: []
        })
    },
    onReachBottom () {
        console.log('上拉加载更多了')
        if ( this.data.total - this.data.movies.length) {
            this.searchMovie()
        }
    },
    // 推荐
    searchRecommend (e) {
        let keyword = e.currentTarget.dataset.keyword
        this.setData({
            keyword,
            isNewLoad: true
        })
        this.searchMovie()
    },
    searchMovie () {
        let keyword = this.data.keyword.trim()
        if (keyword.length === 0) {
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
            // 如果搜索历史中没有， 则加入历史中
            let hs = this.data.historys
            if (hs.every((item, index) => {
                return item.text !== keyword
            })) {
                hs.unshift({text: keyword})
                this.setData({
                    historys: hs
                })
                wx.setStorageSync('SEARCH_HISTORYS', hs)
            }
        }, (res) => {
            console.error('err:', res)
            wx.hideNavigationBarLoading()
        })
    },
    onReady () {

    }
})
