let app = getApp()

import { formatTime } from '../../utils/util.js'

import socket from '../../utils/socket'

app.getUserInfo((info) => {
  console.log('info:', info)
})

Page({
  data: {
    list: []
  },
  onLoad () {
    socket.onMessage((data) => {
      console.log('收到的消息：', data)
      if (data.cmd != 'CMD' || data.subCmd != 'ROOMS') return
      data.rooms.forEach((room) => {
        room.updated = formatTime(room.updated)
      })

      if (data.cmd == 'CMD' && data.subCmd == 'ROOMS') {
        this.setData({
          list: data.rooms
        })
      }
    })
  }
})
