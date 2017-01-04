const peopleId = getApp().globalData.peopleId

class Socket {
  // 构造方法
  constrctor (host) {
    this.host = host
    this.connected = false
    wx.connectSocket({
      url: this.host
    })

    wx.onSocketOpen((res) => {
      console.log('webSocket 连接已经打开！', res)

      this.connected = true
      wx.sendSocketMessage({
        data: JSON.stringify({
          peopleId,
          cmd: 'JOIN',
          roomId: '1000'
        })
      })
    })

    wx.onSocketError((res) => {
      console.log('webSocket 连接关闭！', res)
      this.connected = false
      wx.connectSocket({
        url: this.host
      })
    })

  }

  // 实例方法
  sendMessage (data) {
    if (!this.connected) {
      console.log('没有连接， 暂时不做处理！')
      reutrn
    }
    wx.sendSocketMessage({
      data: JSON.stringify(data)
    })
  }
  // 收到消息
  onMessage (cb) {
    if (typeof cb !== 'function') reutrn
    //监听服务器消息
    wx.onSocketMessage((res) => {
      const data = JSON.parse(res.data)
      cb(data)
    })
  }

}

const socket = new Socket('wss://socket.getweapp.com')
export default socket
