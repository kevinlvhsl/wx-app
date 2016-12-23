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
        console.log('画布开始画图')
    },
    onUnload: function () {
        clearInterval(this.interval)
    },
    onReady () {
        this.run()
        this.interval = setInterval(this.run, 1000)
    },
    run () {
        let context = wx.createContext()
        const r = 300 / 2
        let self = this
        function drawBackground () {
            context.save()
            context.setLineWidth(10)
            context.translate(r, r)
            context.beginPath()
            context.setLineWidth(10)
            context.arc(0, 0, r - 5, 0, 2 * Math.PI, false)
            context.closePath()
            context.stroke()
            const numbers = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2]
            context.beginPath()
            context.setFontSize(18)
            context.textAlign = 'center'
            context.textBaseline = 'middle'
            numbers.forEach((number, index) => {
                let rad = 2 * Math.PI / 12 * index          // 当前数字所对应的弧度
                let x = Math.cos(rad) * (r - 30) - 10
                let y = Math.sin(rad) * (r - 30) + 5
                context.fillText(number, x, y)
            })
            context.stroke()

            for (let i = 0; i < 60; i ++) {
                let rad = 2 * Math.PI / 60 * i          // 当前数字所对应的弧度
                let x = Math.cos(rad) * (r - 15)
                let y = Math.sin(rad) * (r - 15)
                let dotR = 2
                context.beginPath()
                if (i % 5 === 0) {
                    dotR = 3
                    context.setFillStyle("#000000")
                    context.arc(x, y, dotR, 0, 2 * Math.PI, false)
                } else {
                    dotR = 2
                    context.setFillStyle("#cccccc")
                    context.arc(x, y, dotR, 0, 2 * Math.PI, false)
                }
                context.fill()
            }
        }
        function drawDot () {
            context.beginPath()
            context.setLineWidth(3)
            context.setFillStyle("#ff1e1e")
            context.arc(0, 0, 4, 0, 2 * Math.PI, false)
            context.fill()
        }
        function drawHours (hour) {
            context.save()
            context.setStrokeStyle("#000000")
            let rad = 2 * Math.PI / 12 * hour
            context.beginPath()
            context.setLineWidth(6)
            context.rotate(rad)
            context.setLineCap('round')
            context.moveTo(0, 10)
            context.lineTo(0, -r / 2)
            context.stroke()
            context.restore()
        }
        function drawMins (min) {
            context.save()
            context.setStrokeStyle("#1a486a")
            let rad = 2 * Math.PI / 60 * min
            context.beginPath()
            context.setLineWidth(4)
            context.rotate(rad)
            context.setLineCap('round')
            context.moveTo(0, 10)
            context.lineTo(0, -r * 0.7)
            context.stroke()
            context.restore()
        }
        function drawSeconds (sec) {
            context.save()
            context.setStrokeStyle("#ff1e1e")
            let rad = 2 * Math.PI / 60 * sec
            context.beginPath()
            context.setLineWidth(2)
            context.rotate(rad)
            context.setLineCap('round')
            context.moveTo(0, 16)
            context.lineTo(0, -r * 0.8)
            context.stroke()
            context.restore()
        }
        function draw () {
            context.clearRect(0, 0, 300, 300)
            let now = new Date()
            let hour = now.getHours()
            let min = now.getMinutes()
            let sec = now.getSeconds()
            self.setData({
                currentTime: `北京时间:${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${hour}点${min}分${sec}秒`
            })
            drawBackground()
            drawHours(hour + (min / 60))
            drawMins(min)
            drawSeconds(sec)
            drawDot()
            context.restore()
        }
        draw()
        wx.drawCanvas({
            canvasId: 'clockCanvas',
            actions: context.getActions()
        })
    }
})
