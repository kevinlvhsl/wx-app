let col1H = 0;
let col2H = 0;
let col3H = 0;
let ww = 320;
let loading = false;  //限制连续上拉加载

const baseOption = {
    transformOrigin: "50% 50%",
    duration: 800,
    timingFunction: "ease",
    delay: 10
}
// 标记手指滑动开始和结束坐标
let startX = 0
let endX = 0

Page({
    data: {
        scrollH: 0,
        miniWidth: 0,
        loadingCount: 0,
        images: [],
        col1: [],
        col2: [],
        col3: [],
        page: 1,
        // largeImg: {
        //     src: '',
        //     height: 0
        // },
        largeAnimation: {},
        imgAnimations: {},
        currentCols: [],
        currentCol: 1,              // 当前点击的列是第几列
        currentIndex: 0,           // 当前大图是该列第几个
    },

    onLoad: function () {
        wx.getSystemInfo({
            success: (res) => {
                ww = res.windowWidth;
                let wh = res.windowHeight;
                // let miniWidth = ww * 0.48;
                let miniWidth = ww * 0.31;
                let scrollH = wh;

                this.setData({
                    scrollH: scrollH,
                    miniWidth: miniWidth
                });

                this.loadImages();
            }
        })
    },
    showLargeImage (e) {
        let index = e.currentTarget.dataset.index
        let col = e.currentTarget.dataset.col
        // 标记当前点击的是哪一列 和第几张
        this.setData({
            currentCol: col,
            currentIndex: index,
            currentCols: this.data['col' + col]
        })
        this.setAnimate(true)
    },
    changeImgIndex (e) {
        console.log('changeImgIndex::', e)
        this.setData({
            currentIndex: e.detail.current
        })
    },
    // showLargeImage2 (e) {
    //     let index = e.currentTarget.dataset.index
    //     let col = e.currentTarget.dataset.col
    //     // 标记当前点击的是哪一列
    //     this.setData({
    //         currentCol: col,
    //         currentIndex: index
    //     })
    //     let currImg = this.getItemsData(col, index)
    //     this.makeLargeImage(currImg)
    //     this.setAnimate(true)
    // },
    // makeLargeImage (imgInfo) {
    //     let src = imgInfo.img
    //     let h = imgInfo.oH              //图片原始高度
    //     let w = imgInfo.oW              //图片原始宽度
    //     let scale = ww / w              //比例计算
    //     let currHeight = h * scale      //自适应高度
    //     this.setData({
    //         largeImg: Object.assign(this.data.largeImg, {src, height: currHeight })
    //     })
    // },
    // getItemsData (col, index) {
    //     let items = this.data['col' + col]
    //     return items[index]
    // },
    // touchStart (e) {
    //     console.log('start:', e)
    //     startX = e.touches[0].pageX
    // },
    // touchMove (e) {
    //     console.log('move:', e)
    //     endX = e.touches[0].pageX
    // },
    // touchEnd (e) {
    //     console.log('end:', e)
    //     endX = e.changedTouches[0].pageX
    //     let deltaX = startX - endX
    //     if (Math.abs(deltaX) > 20) {
    //         // 向右滑动 index--
    //         if (deltaX < 0) {
    //             if (this.data.currentIndex > 0) {
    //                 let prevIndex = this.data.currentIndex - 1
    //                 let curImg = this.getItemsData(this.data.currentCol, prevIndex)
    //                 this.setData({
    //                     currentIndex: prevIndex
    //                 })
    //                 this.makeLargeImage(curImg)
    //             }
    //         } else {
    //             // 向←左滑动 index++
    //             let curCol = this.data['col' + this.data.currentCol]
    //             if (this.data.currentIndex < curCol.length - 1 ) {
    //                 let nextIndex = this.data.currentIndex + 1
    //                 let curImg = this.getItemsData(this.data.currentCol, nextIndex)
    //                 this.setData({
    //                     currentIndex: nextIndex
    //                 })
    //                 this.makeLargeImage(curImg)
    //             }

    //         }
    //     }
    // },
    closePop () {
        this.setAnimate()
        // setTimeout(() => {
        //     this.setData({
        //         largeImg: Object.assign(this.data.largeImg, {src: '', height: 0 })
        //     })
        // }, 1000)
    },
    setAnimate (enter) {
        if (enter) {
            console.log('animation::', this.animation)
            this.animation.opacity(1).scale(1).step()
        } else {
            this.animation.opacity(0.5).scale(.7).step()
            setTimeout(() => {
                this.setData({
                    currentCols: []
                })
            }, 800)
        }
        this.setData({
            largeAnimation: this.animation.export()
        })
    },
    reset () {
        this.animation.rotate(0, 0)
                                    .scale(0.5)
                                    .opacity(.5)
                                    // .translateY('-50%')
                                    .skew(0, 0)
                                    .step({ duration: 1000 })
        this.setData({ largeAnimation: this.animation.export() })
    },
    onImageLoad: function (e) {
        let imageId = e.currentTarget.id;
        let oImgW = e.detail.width;         //图片原始宽度
        let oImgH = e.detail.height;        //图片原始高度
        let miniWidth = this.data.miniWidth;  //小图片时图片设置的宽度
        let scale = miniWidth / oImgW;        //比例计算
        let scale2 = ww / oImgW ;            //大图比例计算
        let miniHeight = oImgH * scale;      //小图自适应高度
        let largeHeight = oImgH * scale2;      //大图自适应高度

        let images = this.data.images;
        let imageObj = null;

        for (let i = 0; i < images.length; i++) {
            let img = images[i];
            if (img.id === imageId) {
                imageObj = img;
                break;
            }
        }

        if(imageObj) {
            imageObj.miniH = miniHeight;
            imageObj.largeH = largeHeight;
            imageObj.oW = oImgW
            imageObj.oH = oImgH
            if (imageObj.oH > imageObj.oW) {
                imageObj.vertical = true
            }
        }

        let loadingCount = this.data.loadingCount - 1;
        let col1 = this.data.col1;
        let col2 = this.data.col2;
        let col3 = this.data.col3;

        if (col1H <= col2H && col1H <= col3H) {
            col1H += miniHeight
            col1.push(imageObj)
        } else if(col2H <= col1H && col2H <= col3H) {
            col2H += miniHeight
            col2.push(imageObj)
        } else {
            col3H += miniHeight
            col3.push(imageObj)
        }

        let data = {
            loadingCount: loadingCount,
            col1: col1,
            col2: col2,
            col3: col3
        };

        if (!loadingCount) {
            data.images = [];
        }

        this.setData(data)
        // 给每一个图片添加动画
        this.changeAnimateProps(imageId, 0.85, 0.5)
        setTimeout(() => {
            this.changeAnimateProps(imageId, 1, 1)
        }, 30)
    },
    changeAnimateProps (imgId, sc = 1, op = 1) {
        let anim = wx.createAnimation(baseOption)
        anim.scale(sc).opacity(op).step()
        this.data.imgAnimations[imgId] = anim.export()
        this.setData({
            imgAnimations: this.data.imgAnimations
        })
    },
    loadImages: function () {
        if (loading) return
        loading = true
        var that = this
        wx.showToast({
        title: '拼命加载中...',
        icon: 'loading',
        duration: 4000
        })
        wx.request({
            url:'https://api.getweapp.com/vendor/tngou/tnfs/api/list?page='+this.data.page,
            success: function(res) {
                wx.hideToast()
                loading = false
                that.setData({
                    loadingCount: res.data.tngou.length,
                    images: res.data.tngou,
                    page: that.data.page+1
                })
            }, fail : function () {
                loading = false
            }
        })

    },
    onReady () {
        this.animation = wx.createAnimation(baseOption)
        this.reset()
    }
})
