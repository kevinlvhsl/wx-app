## 一个自己折腾的小程序
+ 电影资讯模块(豆瓣)
+ 音乐模块(百度音乐)
+ 聊天室(socket)
+ 图片墙瀑布流
+ canvas时钟

> 对应页面
+ index  // 首页
+ logs  // 日志
+ clock // 一个canvas时钟
+ belle // 美女瀑布流 点击查看大图和切换下一张
+ chat  // 聊天室
    + index //聊天室列表页
    + message 房间
+ movie //这里采用豆瓣的api
    + index //电影列表首页
    + subject //电影详情
    + search //电影搜索
    + celebrity //获取影人信息
+ music 
    + index // 音乐首页
    + playing // 播放音乐到背景音乐
    
### API 开源介绍
> https://api.douban.com
    > /v2/movie/in_theaters  正在上映的电影
    > /v2/movie/coming_soon  即将上映的电影
    > /v2/movie/search       搜索
    > /v2/movie/subject      电影详情
    > /v2/movie/celebrity      影人信息

> https://api.getweapp.com  getweapp 提供的api
> wss://socket.getweapp.com  getweapp 提供的socket api
> https://www.1217.com      1217提供的图片资源

### 百度音乐
> https://api.getweapp.com/thirdparty/baidu/ting
百度音乐全接口 会利用使用接口找歌简单又快捷
: 转自 [http://67zixue.com/home/article/detail/id/22.html](http://67zixue.com/home/article/detail/id/22.html)

> `http://tingapi.ting.baidu.com/v1/restserver/ting`

> 获取方式：GET
 参数：format=json或xml&calback=&from=webapp_music&method=以下不同的参数获得不同的数据

-- PS：format根据开发需要可选择json或xmml，其他参数对应填入，calback是等于空的。

+ 一、获取列表

> 例：method=baidu.ting.billboard.billList&type=1&size=10&offset=0
参数： type = 1-新歌榜,2-热歌榜,11-摇滚榜,12-爵士,16-流行,21-欧美金曲榜,22-经典老歌榜,23-情歌对唱榜,24-影视金曲榜,25-网络歌曲榜
size = 10 //返回条目数量
offset = 0 //获取偏移

+ 二、貌似是推广（无用）

> 例：method=baidu.ting.adv.showlist&_=1430215999
参数：_ = 1430215999//时间戳

+ 三、搜索

> 例：method=baidu.ting.search.catalogSug&query=海阔天空
参数：query = '' //搜索关键字

+ 四、播放

> 例：method=baidu.ting.song.play&songid=877578
  例：method=baidu.ting.song.playAAC&songid=877578
  参数：songid = 877578 //歌曲id

+ 五、LRC歌词

> 例：method=baidu.ting.song.lry&songid=877578
 参数：songid = 877578 //歌曲id

+ 六、推荐列表

> 例：method=baidu.ting.song.getRecommandSongList&song_id=877578&num=5
 参数： song_id = 877578
 num = 5//返回条目数量

+ 七、下载

> 例：method=baidu.ting.song.downWeb&songid=877578&bit=24&_t=1393123213
 参数： songid = 877578//歌曲id
 bit = 24, 64, 128, 192, 256, 320 ,flac//码率
 _t = 1430215999,, //时间戳

+ 八、获取歌手信息

> 例：method=baidu.ting.artist.getInfo&tinguid=877578
 参数： tinguid = 877578 //歌手ting id

+ 九、获取歌手歌曲列表

> 例：method=baidu.ting.artist.getSongList&tinguid=877578&limits=6&use_cluster=1&order=2
 参数： tinguid = 877578//歌手ting id
 limits = 6//返回条目数量

--- 在此感谢[getWeApp](https://www.getweapp.com/)提供整合接口资源
