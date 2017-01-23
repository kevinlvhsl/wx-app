import musicApi  from '../../utils/music.js'

//获取应用实例
var app = getApp()
Page({
    data: {
        winHeight: app.globalData.systemInfo.windowHeight || 603,
        billList: [],
        musics: [],
        artist: [],
        currBar: '0'
    },
    onLoad () {
        // musicApi.search('你').then((res)=>{
        //     console.log(res)
        //     // debugger
        //     this.setData({
        //         musics: res.song,
        //         artist: res.artist
        //     })
        // },()=>{
        //     console.log('music  error')
        // })
        musicApi.getOnline().then((res)=>{
            console.log('新歌榜列表：', res)
            this.setData({
                musics: res.song_list
            })
        },()=>{
            console.log('music  error')
        })
    },
    onUnload: function () {
    },
    onReady () {
    },
    onShow () {
    },
    changeTab (e) {
        let index = e.currentTarget.dataset.index
        if (this.data.currBar === index) return
        this.setData({
            currBar: index
        })
    },
    goPlaying (e) {
        let params = { id: e.currentTarget.dataset.id }
        app.go('playing', params)
    }

})
