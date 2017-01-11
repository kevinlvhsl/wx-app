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
        isNewLoad: true,    // 是否是新的搜索（除了加载更多）
        total: 0,
        searchTitle: '',    // 搜索的标题
        historys: ['成龙', '刘德华', '香港电影', '美国大片']
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
    bindKeyInput (e) {
        console.log('输入了', e.detail.value)
        this.setData({
            isNewLoad: true,
            keyword: e.detail.value,
            searching: true
        })
    },
    clearKeyword () {
        this.setData({
            keyword: ''
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
    // 搜索历史 利用set过滤重复
    setHistroyCache (word) {
        this.data.historys.unshift(word)
        let set = new Set(this.data.historys)
        let hs = Array.from(set)
        this.setData({ historys: hs })

        wx.setStorageSync('SEARCH_HISTORYS', hs)
    },
    searchMovie () {
        debugger
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
                total: data.total,
                searchTitle: data.title
            })
            wx.hideNavigationBarLoading()
            wx.hideToast()

            this.setHistroyCache(keyword)

        }, (res) => {
            console.error('err:', res)
            wx.hideNavigationBarLoading()
        })
    },
    onReady () {

    }
})
