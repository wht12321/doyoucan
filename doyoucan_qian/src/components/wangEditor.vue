<template>
  <div>
    <div class="editor">
      <div ref="toolbar" class="toolbar">
      </div>
      <div ref="editor" class="text">
      </div>
    </div>
  </div>
</template>

<script>
import E from "../assets/wangEditor-3.1.1/release/wangEditor.js"
export default {
  name: 'wangEditor',
  data() {
    return {
      // uploadPath,
      editor: null,
      info_: null,
      isChange:false,//防止光标乱跳到最后
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear()
        this.info_ = null
      }
    },
    value: function(value) {
      if (!this.isChange) {
        this.editor.txt.html(this.value)
      }
      this.isChange= false;
    }
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted() {
    this.seteditor()
    this.editor.txt.html(this.value)
  },
  methods: {
    seteditor() {
      // http://192.168.2.125:8080/admin/storage/create
      this.editor = new E(this.$refs.toolbar, this.$refs.editor)
      this.editor.customConfig.uploadImgShowBase64 = false // base 64 存储图片
      // this.editor.customConfig.uploadImgServer = 'http://otp.cdinfotech.top/file/upload_images'// 配置服务器端地址
      this.editor.customConfig.uploadImgServer = 'http://www.doyoucan.com:3000/uploadFile'// 配置服务器端地址
      // this.editor.customConfig.uploadImgServer = 'http://127.0.0.1:3000/uploadFile'// 配置服务器端地址
      this.editor.customConfig.uploadImgHeaders = { }// 自定义 header
      this.editor.customConfig.uploadFileName = 'fileName' // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024 // 将图片大小限制为 10M
      this.editor.customConfig.uploadImgMaxLength = 1 // 限制一次最多上传 1 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

      // 配置菜单
      this.editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        // 'emoticon', // 表情
        'image', // 插入图片
        // 'video', // 插入视频
        'table', // 表格
        'code', // 插入代码
        'undo', // 撤销
        'redo', // 重复
        // 'fullscreen' // 全屏
      ]
      //配置字体颜色、背景色
      this.editor.customConfig.colors = [
          '#000000',
          '#eeece0',
          '#1c487f',
          '#4d80bf',
          '#c24f4a',
          '#8baa4a',
          '#7b5ba1',
          '#46acc8',
          '#f9963b',
          '#ffffff',
          '#ff0000',
          '#eb4310',
          '#f6941d',
          '#fbb417',
          '#ffff00',
          '#cdd541',
          '#99cc33',
          '#3f9337',
          '#219167',
          '#239676',
          '#24998d',
          '#1f9baa',
          '#0080ff',
          '#3366cc',
          '#333399',
          '#003366',
          '#800080',
          '#a1488e',
          '#c71585',
          '#bd2158'
      ]
      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功，插入图片的回调
          //result为上传图片成功的时候返回的数据，这里我打印了一下发现后台返回的是data：[{url:"路径的形式"},...]
          // console.log(result.data[0].url)
          //insertImg()为插入图片的函数
            //循环插入图片
          // for (let i = 0; i < 1; i++) {
            // console.log(result)
            // let url = "http://otp.cdinfotech.top"+result.url//用于访问图片
          let url = result.url[0];//用于访问图片
            insertImg(url)
          // }
        }
      }
      this.editor.customConfig.onchange = (html) => {
        this.isChange = true;
        this.info_ = html // 绑定当前逐渐地值
        this.$emit('change', this.info_) // 将内容同步到父组件中
      }
      // 创建富文本编辑器
      this.editor.create()
    }
  }
}
</script>

<style lang="scss" scoped>
  .editor {
    width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 0;
  }
  .toolbar {
    border: 1px solid #ccc;
  }
  .text {
    border: 1px solid #ccc;
    height: 600px;
    font-size:0.37rem;// 默认字体大小
    text-align: left;// 默认文本对齐
    color:#353535;// 默认字体颜色
    // background:rgba(255,255,255,0.5);// 默认背景颜色
    padding:0.2rem;// 默认内边距
  }
</style>