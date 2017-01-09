let app = getApp()

import { formatTime, handleContent } from '../../utils/util.js'

import socket from '../../utils/socket'

import api from '../../utils/api'

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
            if (data.cmd != 'CMD' || data.subCmd != 'ROOMS')
                return
            data.rooms.forEach((room) => {
                room.updated = formatTime(room.updated)
                room.contents = handleContent(room.text)
                if (room.text.indexOf('latitude') != -1) {
                    room.type = 'map'
                } else if (room.text.indexOf('wxfile://tmp_') != -1) {
                    room.type = 'image'
                } else {
                    room.type = 'text'
                }

            })
            if (data.cmd == 'CMD' && data.subCmd == 'ROOMS') {
                this.setData({
                    list: data.rooms
                })
            }
        })

        setTimeout(() => {
            socket.sendMessage({
                cmd: 'ROOMS'
            })
        }, 2000)

    },
    goPage (e) {
        let ds = e.currentTarget.dataset
        // let ls = this.data.list
        // ls.[ds.index] = ls.[ds.index]
        app.go('./message', {
            name: ds.name,
            id: ds.id
        })
    },
    onUnLoad () {
        wx.closeSocket()
    }
})
