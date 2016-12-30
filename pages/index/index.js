//index.js
//获取应用实例
var app = getApp()
import test from './test.js'
Page({
	data: {
		userInfo: {},
		count: 0,
		array: ['美国', '中国', '巴西', '日本'],
		index: 0,
		isShow: false,
		color: 'red',
		scanpath: '',
		audio: {
			poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
			name: '此时此刻',
			author: '许巍',
			audioUrl: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46'
		},
		indicatorDots: true,
		autoplay: true,
		interval: 3000,
		duration: 100,
		imgUrls: [
			'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
			'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
			'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
		],
		tempFilePaths: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
	},
	onShareAppMessage: function () {
		return {
			title: 'kevin',
			desc: '这里是Kevin的分享描述',
			path: '/clock/clock'
		}
	},
	onReady () {
		// 使用 wx.createContext 获取绘图上下文 context
		// var context = wx.createContext()

		// context.setStrokeStyle("#00ff00")
		// context.setLineWidth(5)
		// context.rect(0, 0, 200, 200)
		// context.stroke()
		// context.setStrokeStyle("#ff0000")
		// context.setLineWidth(2)
		// context.moveTo(160, 100)
		// context.arc(100, 100, 60, 0, 2 * Math.PI, true)
		// context.moveTo(140, 100)
		// context.arc(100, 100, 40, 0, Math.PI, false)
		// context.moveTo(85, 80)
		// context.arc(80, 80, 5, 0, 2 * Math.PI, true)
		// context.moveTo(125, 80)
		// context.arc(120, 80, 5, 0, 2 * Math.PI, true)
		// context.stroke()

		// // 调用 wx.drawCanvas，通过 canvasId 指定在哪张画布上绘制，通过 actions 指定绘制行为
		// wx.drawCanvas({
		//   canvasId: 'firstCanvas',
		//   actions: context.getActions() // 获取绘图动作数组
		// })
	},

	audioError (err) {
		// console.error(err.detail)
		wx.showToast({
			title: err.detail.errMsg,
			icon: 'waiting_circle',
			duration: 2000
		})
	},

	//事件处理函数
	bindTextViewTap: function() {
		wx.navigateTo({
			url: '../test/test'
		})
	},
	scan () {
		wx.scanCode({
			success: (res) => {
				console.log('扫描成功', res)
				this.setData({
					scanpath: res.result
				})
				fetch(res.result).then(()=>{
					wx.showToast({
						title: '加载成功',
						icon: 'success_no_circle',
						duration: 5000
					})
				})
			}
		})
	},
	onShow () {
		this.setData({isShow: true})
		console.log('index: show')
	},
	onLoad () {
		console.log('index: onLoad', app.globalData.name)
		console.log(this.navigationBarTitleText)
		wx.showToast({
			title: '首页加载成功',
			icon: 'success_no_circle',
			duration: 2000
		})
		//调用应用实例的方法获取全局数据
		app.getUserInfo(userInfo => {
			//更新数据
			this.setData({
				userInfo:userInfo
			})
		})
		// 设备网络状况
		// wx.getNetworkType({
		//   success: function(res) {
		//     var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
		//     console.log('设备网络状态信息', networkType)
		//   }
		// })

		// 获取系统信息
		wx.getSystemInfo({
			success: function(res) {
				console.log(res.model)
				console.log(res.pixelRatio)
				console.log(res.windowWidth)
				console.log(res.windowHeight)
				console.log(res.language)
				console.log(res.version)
			}
		})

		// 获取设备位置信息
		wx.getLocation({
			type: 'wgs84',
			success: function(res) {
				console.log('设备位置信息：', res)
				var latitude = res.latitude
				var longitude = res.longitude
				var speed = res.speed
				var accuracy = res.accuracy
			}
		})
		const self = this
		fetch('https://app.intv.com.cn/yao/feature-api-util/index/incr?key=wxapp&INTV_DEBUG=1').then((response)=>{
			return response.json()
		}).then((res)=>{
			console.log('请求次数返回结果：', res)
			this.setData({
				count: res.data.wxapp
			})
		})
		// wx.request({
		//   url: 'https://app.intv.com.cn/yao/feature-api-util/index/incr?key=wxapp&INTV_DEBUG=1', //仅为示例，并非真实的接口地址
		//   data: {
		//     x: '' ,
		//     y: ''
		//   },
		//   header: {
		//       'Content-Type': 'application/json'
		//   },
		//   success: (res) => {
		//     console.log('获取回来的数据：', res.data)
		//     this.setData({
		//       count: res.data.data.wxapp
		//     })
		//   }
		// })

		// wx.request({
		//   url: app.globalData.DOUBAN_HOST + '/v2/movie/in_theaters',
		//   data: {
		//     start: 0,
		//     count: 9
		//   },
		//   header: {
		//       'Content-Type': 'application/json'
		//   },
		//   success: (res) => {
		//     console.log('获取回来的数据：', res.data)
		//     this.setData({
		//       subjects: res.data.subjects
		//     })
		//   }
		// })
	}
})
