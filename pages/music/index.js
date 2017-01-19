//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        src: '',
        interval: '',
        currentTime: ''
    },
    onLoad () {
        console.log('music页面')
    },
    onUnload: function () {
    },
    onReady () {
        // this.run()
        // this.interval = setInterval(this.run, 1000)
    }

})
