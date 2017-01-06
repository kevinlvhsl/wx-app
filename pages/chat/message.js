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
        tap: 'OFF',             // ON:表示打开了下面的面板  OFF:没打开表情面板
        moreBox: false,         // 定位图片等功能面板是否显示
        emotionBox: false,         // 表情功能面板是否显示
        emotions: []
    },
    onReady(){
        // 页面渲染完成

        wx.setNavigationBarTitle({
            title: this.data.title
        })
        // 上面的scroll-view高度变化动画
        this.animation = wx.createAnimation()
    },
    onLoad (options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    winHeight: res.windowHeight
                })
            }
        })
        let emotions = []
        for(let i = 1; i<28; i++){
            let j = i;
            if(j < 10)
                j = '00' + i
            else
                j = '0' + i
            emotions.push({
                src: `../../media/face-icons-flat/smiley_${j}.png`,
                id: i,
                name: 'smiley_' + j
            })
        }
        this.setData({
            emotions: emotions,
            title: options.name,
            userInfo: app.globalData.userInfo
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
    tapscroll () {
        // 点击了聊天区，直接关闭下面的表情面板或定位面板
        if (this.data.tap === 'ON') {
            // 如果之前面板是打开的，则展示一次动画
            this.toggleScroll(()=>{
                this.setData({
                    moreBox: false,
                    emotionBox: false
                })
            })
        }
    },
    /**
     * 切换下面面板的展示与收起  回调函数中 ture表示当前是展示，false表示不展示
     * @param  在回调函数中处理面板展示（先开始列表的动画）
     */
    toggleScroll (cb) {

        if (this.data.tap === 'OFF') {
            this.setData({tap: 'ON'})
            this.animation.height(this.data.winHeight - 200).step();
            this.setData({ animation: this.animation.export() })
            cb && cb(true)
        } else {
            this.setData({tap: 'OFF'})
            this.animation.height(this.data.winHeight - 50).step();
            this.setData({ animation: this.animation.export() })
            cb && cb(false)
        }
    },
    emotionBtn () {
        // 如果当前是图片面板打开 且 表情面板没打开 则直接切换为表情
        if (!this.data.emotionBox && this.data.moreBox) {
            this.setData({
                emotionBox: true,
                moreBox: false
            })
        } else {
            this.toggleScroll((flag)=>{
                this.setData({
                    emotionBox: flag,
                    moreBox: false
                })
            })
        }
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
            // 关闭下面操作面板
            this.toggleScroll()
            return
        } else { // 点击了 + 号图标
            // 如果当前是表情面板打开 且 图片面板没打开 则直接切换为图片面板
            if (this.data.emotionBox && !this.data.moreBox) {
                this.setData({
                    emotionBox: false,
                    moreBox: true
                })
            } else {
                this.toggleScroll((flag)=>{
                    this.setData({
                        emotionBox: false,
                        moreBox: flag
                    })
                })
            }
        }
    }
})
