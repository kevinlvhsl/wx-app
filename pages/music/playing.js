import musicApi  from '../../utils/music.js'

//获取应用实例
var app = getApp()
Page({
    data: {
        winHeight: app.globalData.systemInfo.windowHeight || 603,
        musicInfo: '',
        bitrateInfo: '',
        currBar: '0',
        playing: false,
        playingMusic: ''
    },
    onLoad (options) {
        // 获取当前的背景音乐播放状态
        wx.getBackgroundAudioPlayerState({
            success: (res) => {
                this.setData({playingMusic: res})
                // let status = res.status
                // let dataUrl = res.dataUrl
                // let currentPosition = res.currentPosition
                // let duration = res.duration
                // let downloadPercent = res.downloadPercent
            },
            complete: () => {
                this.initMusic(options)
            }
        })

    },
    initMusic (options) {
        if (options && options.id != 'undefined') {
            let id = options.id || app.globalData.playingSongId
            musicApi.getDetail(id).then((res) => {
                console.log('当前播放状态', res)

                this.setData({
                    musicInfo: res.songinfo,
                    bitrateInfo: res.bitrate
                })
                setTimeout(() => {
                    this.addEvent()
                    this.play()
                }, 200)

                app.globalData.lastPlayMusic = res
            },()=>{
                console.log('music  error')
            })

        } else {
            let lastMu = app.globalData.lastPlayMusic
            if (lastMu) {
                this.setData({
                    musicInfo: lastMu.songinfo,
                    bitrateInfo: lastMu.bitrate
                })
                //播放状态（2：没有音乐在播放，1：播放中，0：暂停中）
                if (this.data.playingMusic ) {
                    this.setData({
                        playing: this.data.playingMusic.status === 1
                    })
                }
                this.addEvent()
            }
        }
    },
    pause () {
        wx.pauseBackgroundAudio()
        // this.audioCtx.pause()
        // this.setData({playing: false})
    },
    play () {
        // this.audioCtx.play()
        // this.setData({playing: true})
        wx.playBackgroundAudio({
            dataUrl: this.data.bitrateInfo.file_link,
            title: this.data.musicInfo.album_title,
            coverImgUrl: this.data.musicInfo.pic_premium
        })
    },
    onUnload () {
        wx.setStorageSync('lastPlayMusic', app.globalData.lastPlayMusic)
    },
    onReady () {
    },
    addEvent () {
        // this.audioCtx = wx.createAudioContext('audio')
        // this.audioCtx.setSrc(this.data.bitrateInfo.file_link)
        // this.audioCtx.play()
        // this.setData({playing: true})

        wx.onBackgroundAudioPlay(()=> {
            this.setData({playing: true})
        })
        wx.onBackgroundAudioPause(()=> {
            this.setData({playing: false})
        })
    },
    onHide () {
        wx.seekBackgroundAudio({
            position: 30
        })
    }

})


/**
 * 几个关于背景音乐的接口
    wx.getBackgroundAudioPlayerState({
        success: function(res) {
            var status = res.status
            var dataUrl = res.dataUrl
            var currentPosition = res.currentPosition
            var duration = res.duration
            var downloadPercent = res.downloadPercent
        }
    })
 *
 *
 *
 *
 */
