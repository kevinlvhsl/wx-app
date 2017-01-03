let col1H = 0;
let col2H = 0;
let col3H = 0;
let ww = 320;
const baseOption = {
  transformOrigin: "50% 50%",
  duration: 800,
  timingFunction: "ease",
  delay: 10
}
Page({

  data: {
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    col3: [],
    page: 1,
    largeImg: {
      src: '',
      height: 0
    },
    largeAnimation: {},
    imgAnimations: {}
  },

  onLoad: function () {
    wx.getSystemInfo({
      success: (res) => {
        ww = res.windowWidth;
        let wh = res.windowHeight;
        // let imgWidth = ww * 0.48;
        let imgWidth = ww * 0.31;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });

        this.loadImages();
      }
    })
  },
  showLargeImage (e) {
    let src = e.currentTarget.dataset.src
    let height = e.currentTarget.dataset.height        //图片原始高度
    let width = e.currentTarget.dataset.width          //图片原始宽度
    let scale = ww / width                             //比例计算
    let currHeight = height * scale                    //自适应高度
    this.setData({
      largeImg: Object.assign(this.data.largeImg, {src, height: currHeight })
    })
    this.setAnimate(true)
  },
  closePop () {
    this.setAnimate()
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
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

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
      imageObj.height = imgHeight;
      imageObj.oW = oImgW
      imageObj.oH = oImgH
    }

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;
    let col3 = this.data.col3;

    if (col1H <= col2H && col1H <= col3H) {
      col1H += imgHeight
      col1.push(imageObj)
    } else if(col2H <= col1H && col2H <= col3H) {
      col2H += imgHeight
      col2.push(imageObj)
    } else {
      col3H += imgHeight
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
    var that = this
    wx.showToast({
    title: '拼命加载中...',
    icon: 'loading',
    duration: 3000
    })
    wx.request({
      url:'https://api.getweapp.com/vendor/tngou/tnfs/api/list?page='+this.data.page,
      success: function(res) {
        wx.hideToast()
        that.setData({
          loadingCount: res.data.tngou.length,
          images: res.data.tngou,
          page: that.data.page+1
        })
      }
    })

  },
  onReady () {
    this.animation = wx.createAnimation(baseOption)
    this.reset()
  }
})
