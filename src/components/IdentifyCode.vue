<template>
 <div style="margin-top: 5px;margin-left: 10px;">
   <canvas id="canvas" :width="w + 'px'" :height="h + 'px'" @click="drawPic" style="border: 1px solid silver;"></canvas>
   <p style="font-size: 16px;color:green;"><input type="text"  v-model="text"  placeholder="请输入验证码" />
     <button @click="btnOkClick" style="padding: 0px 10px;color:#fff;background: #2b85e4;border-radius: 2px;border: 1px solid silver;line-height: 28px;">确定</button>
   <p/>
 </div>
</template>

<script>
export default {
  name: 'IdentifyCode',
  data() {
    return {
      picTxt: '',
      w: 235,
      h: 50,
      text: ''
    }
  },
  methods: {
    //生成随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    //生成随机颜色RGB分量
    randomColor(min, max) {
      var _r = this.randomNum(min, max)
      var _g = this.randomNum(min, max)
      var _b = this.randomNum(min, max)
      return 'rgb(' + _r + ',' + _g + ',' + _b + ')'
    },
    //先阻止画布默认点击发生的行为再执行drawPic()方法
    drawPic() {
      //获取到元素canvas
      var $canvas = document.getElementById('canvas')
      var _str = '0d1f2g3hAj4kBl5pCo6iDu7yEtre8wFmq9nGtdbavZWcXxWzVaUDsSRQPONMLH'//设置随机数库
      var _picTxt = ''//随机数
      var _num = 4//4个随机数字
      var _width = $canvas.width
      var _height = $canvas.height
      var ctx = $canvas.getContext('2d')//获取 context 对象
      ctx.textBaseline = 'bottom'//文字上下对齐方式--底部对齐
      ctx.fillStyle = this.randomColor(180, 240)//填充画布颜色
      ctx.fillRect(0, 0, _width, _height)//填充矩形--画画
      for (var i = 0; i < _num; i++) {
        var x = (_width - 10) / _num * i + 10
        var y = this.randomNum(_height / 2, _height)
        var deg = this.randomNum(-45, 45)
        var txt = _str[this.randomNum(0, _str.length)]
        _picTxt += txt//获取一个随机数
        ctx.fillStyle = this.randomColor(10, 100)//填充随机颜色
        ctx.font = this.randomNum(16, 40) + 'px SimHei'//设置随机数大小，字体为SimHei
        ctx.translate(x, y)//将当前xy坐标作为原始坐标
        ctx.rotate(deg * Math.PI / 180)//旋转随机角度
        ctx.fillText(txt, 0, 0)//绘制填色的文本
        ctx.rotate(-deg * Math.PI / 180)
        ctx.translate(-x, -y)
      }
      var a = 0
      while (a < _num) {
        //定义笔触颜色
        ctx.strokeStyle = this.randomColor(90, 180)
        var n = 0
        while (n < 8) {
          n++
          ctx.beginPath()
          //随机划线--4条路径
          ctx.moveTo(this.randomNum(0, _width), this.randomNum(0, _height))
          ctx.lineTo(this.randomNum(0, _width), this.randomNum(0, _height))
          ctx.stroke()
        }
        a++
      }
      a = 0
      while (a < _num * 10) {
        ctx.fillStyle = this.randomColor(0, 255)
        ctx.beginPath()
        //随机画原，填充颜色
        ctx.arc(this.randomNum(0, _width), this.randomNum(0, _height), 1, 0, 2 * Math.PI)
        ctx.fill()
        a++
      }
      this.picTxt = _picTxt//返回随机数字符串
    },
    btnOkClick () {
      if (this.text.length < 1) {
        alert('验证码不能为空！')
      } else if (this.text !== this.picTxt) {
        alert('验证错误！可重新输入或点击图片生成新的验证码，在重试！')
      } else {
        this.$emit('IdentitySuccess')
      }
    }
  },
  mounted() {
    this.drawPic()
  }
}
</script>

<style scoped>

</style>
