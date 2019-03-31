<template>
  <div id="alarm-wrapper">
    <div class="radio-wrapper">
      <RadioGroup v-model="radioValue" @on-change="toggleRadioVal">
        <Radio size="large" label="1">
          <span :class="radioValue === '1' ? 'active' : 'negative'">所有控制箱</span>
        </Radio>
        <Radio size="large" label="0">
          <span :class="radioValue === '0' ? 'active' : 'negative'">选中控制箱</span>
        </Radio>
      </RadioGroup>
      <div class="btn-wrapper">
        <Button type="primary">刷新</Button>
        <Button type="primary">确认报警</Button>
      </div>
    </div>
    <div class="checkbox-wrapper">
      <Checkbox v-model="automaticMonitor" size="large">
        <span class="checkbox-title" :class="automaticMonitor === true ? 'active' : 'negative'">自动化监控系统</span>
      </Checkbox>
      <Checkbox v-model="entranceGuard" size="large">
        <span class="checkbox-title" :class="entranceGuard === true ? 'active' : 'negative'">门禁系统</span>
      </Checkbox>
      <Checkbox v-model="singleLight" size="large">
              <span class="checkbox-title"
                    :class="singleLight === true ? 'active' : 'negative'">单灯系统</span>
      </Checkbox>
      <Checkbox v-model="antiMonitor" size="large">
        <span class="checkbox-title" :class="antiMonitor === true ? 'active' : 'negative'">防盗监测系统</span>
      </Checkbox>
      <Checkbox v-model="leakageMonitor" size="large">
        <span class="checkbox-title" :class="leakageMonitor === true ? 'active' : 'negative'">漏电监测系统</span>
      </Checkbox>
    </div>
    <div class="alarm-grid-wrapper">
      <kendo-grid :height="fullHeight" :data-source="dataList"
                  groupable="true"
                  grouping-header="将列表头拖动到此处进行分组"
                  ref="alarmGrid"
                  :columns="columnsInfo"
                  :pageable='true'
                  page-size="10"
                  sortable="true">
      </kendo-grid>
      <Button type="primary">生成报表</Button>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
export default {
  data () {
    return {
      radioValue: '1', // 单选框状态
      automaticMonitor: true, // 自动化监测
      entranceGuard: true, // 门禁
      singleLight: true, // 单灯
      antiMonitor: true, // 防盗
      leakageMonitor: true, // 漏电
      columnsInfo: [
        {
          title: '控制箱名称',
          field: 'terminalName',
          width: 100
        },
        {
          title: '时间',
          field: 'time',
          width: 100
        },
        {
          title: '内容',
          field: 'content',
          width: 100
        },
        {
          title: '定义',
          field: 'defined',
          width: 100
        },
        {
          title: '类型',
          field: 'type',
          width: 100
        },
        {
          title: '来源',
          field: 'source',
          width: 100
        },
        {
          title: '控制箱编码',
          field: 'terminalCode',
          width: 100
        },
        {
          title: '附加对象',
          field: 'additional ',
          width: 100
        }
      ],
      dataList: [],
      fullHeight: 1000 // 表格高度
    }
  },
  watch: {
  },
  methods: {
    toggleRadioVal (val) {
      this.radioValue = val
    },
    // todo 监听浏览器窗口变化 begin
    onResize () {
      let _this = this
      window.addEventListener('resize', _this.handleResize)
    },
    handleResize (event) {
      this.fullHeight = document.documentElement.clientHeight * 80 / 100
    },
    // todo 监听浏览器变化 end
    // 添加监听事件
  },
  mounted () {
    this.fullHeight = document.documentElement.clientHeight * 80 / 100
    this.onResize()
    // $(".k-grouping-header").html("将列表头拖动到此处进行分组")
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>
<style>
  #alarm-wrapper .checkbox-wrapper {
    margin-left: 60px;
    margin-top: 20px;
    font-size: 16px;
    margin-bottom: 20px;
  }

  #alarm-wrapper .checkbox-title {
    font-size: 16px;
    display: inline-block;
    padding-left: 6px;
    user-select: none;
  }

  #alarm-wrapper .radio-wrapper {
    padding-left: 10px;
    position: relative;
  }

  #alarm-wrapper .radio-wrapper .btn-wrapper {
    position: absolute;
    right: 10px;
    top: 0;
  }

  #alarm-wrapper .radio-wrapper .btn-wrapper .ivu-btn {
    border: 1px solid grey;
    box-shadow: 4px 4px 2px #888888;
  }

  #alarm-wrapper .radio-wrapper .btn-wrapper .ivu-btn:hover {
    border: 1px solid grey;
    background: #dddee1;
    color: #19be6b;
  }

  #alarm-wrapper .radio-wrapper .ivu-radio-group-item span {
    font-size: 16px;
    user-select: none;
    padding-left: 10px;
  }

  #alarm-wrapper .active {
    color: #409eff
  }

  #alarm-wrapper .negative {
    opacity: .9;
    filter: alpha(opacity: 90);
    color: #bbbec4;
    text-decoration: line-through;
    text-decoration-color: grey;
  }

/* ------------------------------------------------- */
  #alarm-wrapper .alarm-grid-wrapper {
    border: 1px solid grey;
    position: relative;
  }

  #alarm-wrapper .alarm-grid-wrapper .ivu-btn {
    border: 1px solid grey;
    box-shadow: 4px 4px 2px #888888;
    position: absolute;
    right: 10px;
    top: -40px;
  }

  #alarm-wrapper .alarm-grid-wrapper .ivu-btn:hover {
    background: #dddee1;
    color: #19be6b;
  }

  #alarm-wrapper .k-link {
    text-align: center;
    color: black;
    font-weight: 600;
  }
</style>
