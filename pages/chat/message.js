const app = getApp()

import socket from '../../utils/socket'

Page({
  data: {
    msgList: [],
    msg: '',
    more: 'ion-ios-plus-outline',
    winHeight: 0,
    userInfo: {}
  },
  onLoad () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          winHeight: res.windowHeight
        })
      }
    })
    app.getUserInfo((info) => {
      console.log('info:', info)
      this.setData({
        userInfo: info
      })
    })
  },
  inputMsg (e) {
    let msg = e.detail.value.trim()
    this.setData({
      msg,
      more: (msg) ? 'ion-ios-send' : 'ion-ios-plus-outline'
    })
  },
  elseBtn () {
    if (this.data.more === 'ion-ios-send') {
      socket.sendMessage({
        cmd: 'MESSAGE',
        peopleId: app.globalData.peopleId,
        type: 'text',
        content: this.data.msg,
        avatar: this.userInfo.avatarUrl || 'http://oh39r65yn.bkt.clouddn.com/5030aff5074dd.jpg',
        name: 'life'
      })
      this.setData({
        msg: '',
        more: 'ion-ios-plus-outline'
      })
    }
  }
})
