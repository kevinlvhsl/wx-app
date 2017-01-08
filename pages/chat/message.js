const app = getApp()

import socket from '../../utils/socket'
import { handleContent } from '../../utils/util.js'

Page({
    data: {
        messages: [],
        msg: '',
        title: '聊天室',
        more: 'ion-ios-plus-outline',
        winHeight: 0,           // 窗口高度px
        winWidth: 0,           // 窗口宽度px
        userInfo: {},
        animation: {},          // 面板动画
        tap: 'OFF',             // ON:表示打开了下面的面板  OFF:没打开表情面板
        moreBox: false,         // 定位图片等功能面板是否显示
        emotionBox: false,      // 表情功能面板是否显示
        emotions: [],           // 表情列表
        position: {},           // 当前查看位置
        largeMapShow: false,    // 是否显示大体地图
        largeImg: {             // 大图查看
            src: '',
            height: 0
        },
        isVoice: false,         // 是否显示录音输入
        voicePath: '',          // 录音后的文件url
        recording: false,       // 录音中
        voicePlaying: false
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
                    winHeight: res.windowHeight,
                    winWidth: res.windowWidth
                })
            }
        })
        // 初始化 表情
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
            if (data.type === 'map') {
                let obj = JSON.parse(data.content)
                data.latitude = obj.latitude
                data.longitude = obj.longitude
                data.markers = obj.markers
            }
            data.contents = handleContent(data.content)
            messages.push(data)
            this.setData({
                messages
            })
        })
    },
    switchType () {
        let type = this.data.isVoice
        this.setData({
            isVoice: !type
        })
    },
    handleContent (content) {
        let contents = []
        let t = ''
        let lastToken = ''
        // 遍历内容中是否有表情符号， 当前字符是否是 '[' 如果是，则寻找下一 ']' 中间的内容则匹配一个表情
        for (let i = 0; i < content.length; i++) {
            if (lastToken === '' && content[i] == '[') {
                if (t) {
                    contents.push({
                        type: 'text',
                        text: t
                    })
                }
                t = ''
                lastToken = '['
            } else if (content[i] === ']' && lastToken === '[') { // 完整匹配了一个表情
                contents.push({
                    type: 'image',
                    url: `../../media/face-icons-flat/${t}.png`
                })
                t = ''
                lastToken = ''
            } else { // 如果已经开始匹配表情符号，将当前字符内容临时保存在t中
                t += content[i]
            }
        }
        if (t) { // 最后面
            contents.push({
                type: 'text',
                text: t
            })
        }
        return contents
    },
    inputMsg (e) {
        let msg = e.detail.value.trim()
        this.setData({
            msg,
            more: (msg) ? 'ion-ios-send' : 'ion-ios-plus-outline'
        })
    },
    chooseEmotion (e) {
        let name = e.currentTarget.dataset.name
        this.setData({
            msg: `${this.data.msg}[${name}]`,
            more: 'ion-ios-send'
        })
    },
    chooseImg () {
        wx.chooseImage({
            count: 1,
            sizeType: 'compressed',
            success: (res) => {
                console.log(res)
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                // 发送一条图片信息
                socket.sendMessage({
                    cmd: 'MESSAGE',
                    peopleId: app.globalData.peopleId,
                    type: 'image',
                    url: tempFilePaths[0],
                    roomId: '1000',
                    content: tempFilePaths[0],
                    avatar: this.data.userInfo.avatarUrl || 'http://oh39r65yn.bkt.clouddn.com/5030aff5074dd.jpg',
                    name: 'life'
                })
            },
            complete: () => {
                this.toggleScroll( () => {
                    this.setData({
                        moreBox: false,
                        emotionBox: false
                    })
                })
            }
        })
    },
    getlocat () {
        wx.getLocation({
          type: 'gcj02',
          success : (res) => {
              //维度
            let latitude = res.latitude
            //经度
            let longitude = res.longitude
            //速度
            let speed = res.speed
            //位置精度
            let accuracy = res.accuracy
            let markers = [{
                width: 32,
                height: 32,
                latitude,
                longitude,
                iconPath: '../../media/pos.png'
            }]
            let mapObj = {
                latitude,
                longitude,
                markers
            }
            let mapJson = JSON.stringify(mapObj)
            socket.sendMessage({
                cmd: 'MESSAGE',
                peopleId: app.globalData.peopleId,
                type: 'map',
                roomId: '1000',
                content: mapJson,
                avatar: this.data.userInfo.avatarUrl || 'http://oh39r65yn.bkt.clouddn.com/5030aff5074dd.jpg',
                name: 'life'
            })
            this.toggleScroll()
          }
        })
    },
    showLargeMap (e) {
        let info = e.currentTarget.dataset.info
        this.setData({
            largeMapShow: true,
            position: JSON.parse(info)
        })
    },
    closeLargeMap () {
        this.setData({
            largeMapShow: false
        })
    },
    showLargeImage (e) {
        let src = e.currentTarget.dataset.src
        let height = e.currentTarget.dataset.height        //图片原始高度
        let width = e.currentTarget.dataset.width          //图片原始宽度
        let scale = this.data.winWidth / width             //比例计算
        let currHeight = height * scale                    //自适应高度
        this.setData({
            largeImg: Object.assign(this.data.largeImg, {src, height: currHeight })
        })
        // this.setAnimate(true)
    },
    closePop () {
        // this.setAnimate()
        setTimeout(() => {
            this.setData({
                largeImg: Object.assign(this.data.largeImg, {src: '', height: 0 })
            })
        }, 1000)
    },
    setAnimate (enter) {
        if (enter) {
            console.log('animation::', this.animation)
            this.animation.opacity(1).scale(1).step()
        } else {
            this.animation.opacity(0.5).scale(.7).step()
        }
        this.setData({
            largeAnimation: this.animation.export()
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
                more: 'ion-ios-plus-outline',
                moreBox: false,
                emotionBox: false
            })
            // 如果当前是有面板打开 则关闭
            if (this.data.tap === 'ON') {
                this.toggleScroll()
            }
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
    },
    startRecord () {
        console.log('开始录音')
        this.setData({recording: true})
        wx.startRecord({
            success: (res) => {
                var tempFilePath = res.tempFilePath
                console.log(tempFilePath)
                console.log('录音成功')
                this.setData({
                    voicePath: tempFilePath
                })
                socket.sendMessage({
                    cmd: 'MESSAGE',
                    peopleId: app.globalData.peopleId,
                    type: 'voice',
                    url: tempFilePath,
                    roomId: '1000',
                    content: tempFilePath,
                    avatar: this.data.userInfo.avatarUrl || 'http://oh39r65yn.bkt.clouddn.com/5030aff5074dd.jpg',
                    name: 'life'
                })
            },
            fail: (res) => {
                //录音失败
            }
        })
        setTimeout(() => {
            //结束录音
            console.log('结束录音')
            this.endRecord()
        }, 10000)
    },
    endRecord () {
        wx.stopRecord()
        this.setData({recording: false})
    },
    playVoice (e) {
        let path = e.currentTarget.dataset.src
        // wx.showToast({
        //     title: path,
        //     icon: 'waiting_circle',
        //     duration: 4000
        // })
        if (this.data.voicePlaying) {
            this.stopVoice()
            return
        }
        this.setData({
            voicePlaying: true
        })
        wx.playVoice({
          filePath: path,
          complete: () => {
            this.stopVoice()
          }
        })
    },
    stopVoice() {
        wx.stopVoice()
        this.setData({
            voicePlaying: false
        })
    }


})
