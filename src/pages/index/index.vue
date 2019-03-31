<template>
  <div>
    <p>首页index.vue</p>
    <div>
      <div v-for="(item, index) in enter1" class="itemBox" :key="index" v-if="item.status">
        <a :href=item.href>{{ item.title }}</a>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
export default {
  data () {
    return {
      enter1: [
        {
          title: '实时监控汇总(华灯)',
          href: 'realTimeProtectionH.html',
          status: true
        },
        {
          title: '实时监控汇总',
          href: 'realTimeProtection.html',
          status: false
        },
        {
          title: '实时指令状态',
          href: 'realTimeCommandStatus.html',
          status: false
        },
        {
          title: '景观亮化模式切换',
          href: 'LightingModeTabs.html',
          status: true
        },
        {
          title: '景观亮化模式设置',
          href: 'LightingModeSetting.html',
          status: true
        },
        {
          title: '实时报警报告管理',
          href: 'realTimeAlarmReportManagement.html',
          status: false
        },
        {
          title: '历史参数查询（单相）',
          href: 'historyElectricExport.html',
          status: false
        },
        {
          title: '历史指令查询',
          href: 'historyCommandsQuery.html',
          status: false
        },
        {
          title: '电能量月结算日设置',
          href: 'electricEnergy.html',
          status: false
        },
        {
          title: '电能量消耗月报表',
          href: 'monthlyConsumptionReport.html',
          status: false
        },
        {
          title: '电能量消耗年报表',
          href: 'annualConsumptionReport.html',
          status: false
        },
        {
          title: '树列表显示及筛选设置',
          href: 'treeManagementSetting.html',
          status: true
        },
        {
          title: '报警处理方式管理',
          href: 'alarmWayMenagement.html',
          status: false
        },
        {
          title: '终端走时管理',
          href: 'terminalTimerManagement.html',
          status: false
        },
        {
          title: 'FTP升级',
          href: 'FTPUpgrade.html',
          status: false
        },
        {
          title: '终端开关灯时间读写',
          href: 'terminalLightTime.html',
          status: false
        },
        {
          title: '每日在线汇总',
          href: 'terminalDailyOnlineSummary.html',
          status: false
        },
        {
          title: '测试',
          href: 'new.html',
          status: true
        },
        {
          title: '百分比测试',
          href: 'Test.html',
          status: true
        }
      ]
    }
  },
  mounted() {}
}
</script>

<style scoped>
  .itemBox {
    display: table;
    float: left;
    margin: 4px;
    width: 100px;
    height: 100px;
    background: grey;
    text-align: center;
  }

  .itemBox > a {
    display: table-cell;
    vertical-align: middle;
    margin: 0 auto;
    cursor: pointer;
    text-align: center;
  }

  .itemBox > a:hover{
    color: yellow;
  }
</style>
