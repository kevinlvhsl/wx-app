const app = getApp()
import { formatTime } from '../../utils/util'
// import socket form '../../utils/socket'
app.getUserInfo((info) => {
  console.log('info:', info)
})

Page({
  data: {

  },
  onLoad () {

  }
})
