var app = getApp()
function formatTime(time) {
    const date = new Date(time)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

return [hour, minute, second].map(formatNumber).join(':')

    //return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}
function handleContent (content) {
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
                url: `/media/face-icons-flat/${t}.png`
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
}
module.exports = {
    formatTime,
    handleContent
}
