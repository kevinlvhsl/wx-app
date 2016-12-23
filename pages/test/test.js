//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    src: '',
    danmuList: [
      {
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
      }
    ],
  },
  //事件处理函数
  tapBack: function() {
    wx.navigateTo({
      url: '../index/index'
    })
  },
    //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
    let self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        self.tempFilePaths = res.tempFilePaths[0]
        console.log(self.tempFilePaths)
      }
    })
  },
    showActionSheet () {
    wx.showActionSheet({
      itemList: ['A', '日历', 'C'],
      success: function(res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          switch(res.tapIndex) {
            case 0:
              console.log(0, 'a')
              break
            case 1:
              console.log(1, '查看canvas时钟')
              wx.navigateTo({
                url: '../clock/clock'
              })
              break
            case 2:
              console.log(2, 'c')
              break
          }
        }
      }
    })
  },
  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
    wx.getLocation({
  type: 'gcj02', //返回可以用于wx.openLocation的经纬度
  success: function(res) {
    var latitude = res.latitude
    var longitude = res.longitude
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 28
    })
  }
})
  },
  inputValue: '',
  bindInputBlur: function(e) {
    this.inputValue = e.detail.value
  },
    bindButtonTap: function() {
        var that = this
        wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: ['front','back'],
            success: function(res) {
                that.setData({
                    src: res.tempFilePath
                })
            }
        })
    },
  bindSendDanmu: function () {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
    this.inputValue = ''
  },
    videoErrorCallback: function(e) {
      console.log('视频错误信息:')
      console.log(e.detail.errMsg)
    }
})
function getRandomColor () {
  let rgb = []
  for (let i = 0 ; i < 3; ++i){
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
