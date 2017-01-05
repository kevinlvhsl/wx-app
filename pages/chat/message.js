const app = getApp()

import socket from '../../utils/socket'

Page({
  data: {
    messages: [],
    msg: '',
    title: '聊天室',
    more: 'ion-ios-plus-outline',
    winHeight: 0,
    userInfo: {},
    animation: {},
    animation_2: {},
    tap: 'tapOff'
  },
  onReady(){
    // 页面渲染完成

    wx.setNavigationBarTitle({
      title: this.data.title
    })
    this.animation = wx.createAnimation();
    this.animation_2 = wx.createAnimation()
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

    // 监听房间接受消息
    socket.onMessage((data) => {
      let messages = this.data.messages
      data.me = data.peopleId === app.globalData.peopleId ? true : false
      data.contents = []
      let t = ''
      let lastToken = ''
      // 遍历内容中是否有表情符号， 当前字符是否是 '[' 如果是，则寻找下一 ']' 中间的内容则匹配一个表情
      for (let i = 0; i < data.content.length; i++) {
        if (lastToken === '' && data.content[i] == '[') {
          if (t) {
            data.contents.push({
              type: 'text',
              text: t
            })
          }
          t = ''
          lastToken = '['
        } else if (data.content[i] === ']' && lastToken === '[') { // 完整匹配了一个表情
          data.contents.push({
            type: 'image',
            url: `../../media/face-icons-flat/${t}.png`
          })
          t = ''
          lastToken = ''
        } else { // 如果已经开始匹配表情符号，将当前字符内容临时保存在t中
          t += data.content[i]
        }
      }
      if (t) { // 最后面
        data.contents.push({
          type: 'text',
          text: t
        })
      }
      messages.push(data)
      this.setData({
        messages
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
    if (this.data.more === 'ion-ios-send') { // 点击了 发送 图标
      socket.sendMessage({
        cmd: 'MESSAGE',
        peopleId: app.globalData.peopleId,
        type: 'text',
        roomId: '1000',
        content: this.data.msg,
        avatar: this.data.userInfo.avatarUrl || 'http://oh39r65yn.bkt.clouddn.com/5030aff5074dd.jpg',
        name: 'life'
      })
      console.log('发送成功：', this.data.msg)
      this.setData({
        msg: '',
        more: 'ion-ios-plus-outline'
      })
      if (this.data.tap === 'tapOff') {
        this.animation_2.height(this.data.winHeight - 50).step({duration: 500})
        this.setData({ animation_2: this.animation_2.export() })
        this.setData({
             tap:"tapOn"
        })
      }
      return
    } else { // 点击了 + 号图标

    }
  }
})
