<template>
  <ul class="vue-contextmenu-listWrapper" :class="'vue-contextmenuName-' + contextMenuData.menuName" ref="context">
    <li v-for="(item, index) in contextMenuData.menulists"
        class="context-menu-list" :key="index">
      <button :disabled="!item.flag" :class="!item.flag ? 'not-allowed' : 'allowed'" @click.stop="fnHandler(item, index)">
        <i :class="item.icoName"></i>
        <span id="context-menu-list-span" :class="item.flag === true ? '' : 'line-through'">{{item.btnName}}</span>
      </button>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    contextMenuData: {
      type: Object,
      requred: false,
      default () {
        return {
          menuName: null,
          axios: {
            x: null,
            y: null
          },
          menulists: [
            {
              fnHandler: 'adddata',
              icoName: 'fa fa-home fa-fw',
              btnName: 'New',
              flag: true
            },
            {
              fnHandler: 'savedata',
              icoName: 'fa fa-home fa-fw',
              btnName: 'Save',
              flag: true
            }
          ]
        }
      }
    },
    transferIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    'contextMenuData.axios' (val) {
      var x = val.x
      var y = val.y
      var _this = this
      var index = _this.transferIndex
      var menuName = 'vue-contextmenuName-' + _this.contextMenuData.menuName
      var menu = document.getElementsByClassName(menuName)[index]
      menu.style.display = 'block'
      menu.style.left = x + 'px'
      menu.style.top = y + 'px'
      this._initContextWidth()
      document.addEventListener('mouseup', function () {
        menu.style.display = 'none'
      }, false)
    }
  },
  methods: {
    fnHandler (item, index) {
      this.$emit(item.fnHandler, index)
    },
    _initContextWidth () {
      let children = this.$refs.context.children
      let maxWidth = 0
      for (let i = 0; i < children.length; i++) {
        if (children[i].offsetWidth > maxWidth) {
          maxWidth = children[i].offsetWidth
        }
      }
      for (let i = 0; i < children.length; i++) {
        children[i].style.width = maxWidth + 'px'
      }
    }
  },
  mounted () {
  }
}
</script>
<style scoped>

  .not-allowed:hover {
    cursor: not-allowed;
    background: #cccccc;
  }

  .allowed:hover{
    cursor: pointer;
    box-shadow: 0px 1px 3px rgba(34, 25, 25, 0.2);
    color: #ffffff;
    border-radius: 2px;
    background: -webkit-linear-gradient(bottom, #ffcd32, #FFBE32); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(bottom, #ffcd32, #FFBE32); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(bottom, #ffcd32, #FFBE32); /* Firefox 3.6 - 15 */
    background: linear-gradient(to bottom, #ffcd32, #FFBE32);
  }

  .line-through {
    text-decoration: line-through;
    color: grey;
    /* cursor: not-allowed; */
  }

  .vue-contextmenu-listWrapper {
    border: 1px solid gray;
    box-shadow: 2px 2px 2px #cccccc;
    overflow: hidden;
    display: none;
    position: fixed;
    /*position: absolute;*/
    z-index: 9999;
    top: 0;
    left: 0;
  }

  .vue-contextmenu-listWrapper .context-menu-list {
    height: 30px;
    border-radius: 4px;
    text-decoration: none;
    list-style: none;
    font-size: 14px;
    font-family: '微软雅黑';
    font-weight: bold;
  }

  .vue-contextmenu-listWrapper .context-menu-list > #context-menu-list-span  {
    font-size: 30px;
    font-family: '微软雅黑';
    font-weight: bold;
  }

  .vue-contextmenu-listWrapper .context-menu-list button {
    width: 100%;
    height: 100%;
    display: block;
    outline: 0;
    border: 0;
    padding: 0 10px;
  }

  .vue-contextmenu-listWrapper .context-menu-list button i,  .vue-contextmenu-listWrapper .context-menu-list button span {
    float: left;
  }

  .vue-contextmenu-listWrapper .context-menu-list button i{
    padding: 0 10px;
  }
</style>
