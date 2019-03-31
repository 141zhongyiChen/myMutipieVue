<template>
  <div>
    <p style="text-align: right;margin-right: 5px;">
      <span v-if="excImprot" type="primary" style="color:#fff;background-color: #2D8CF0;padding: 0px 10px;cursor: default;font-size: 18px;"  @click="exportData">导出</span>
    </p>
    <Table ref="table"  highlight-row  :show-header="iSshowheader"   @on-row-click="currentchange"  id="te" :width="tableWidth" :height="tableHeight" border :columns="tdCols" :data="tdData"></Table>
    <Page ref="page" :total="dataCount" :page-size="pageSize" show-total  @on-change="changepage"></Page>
  </div>
</template>

<script>
import 'iview'
import { mapMutations, mapGetters } from 'vuex'
import { export2Excel } from 'common/js/exportExcell_dyx/'
export default {
  name: 'changeTable',
  data() {
    return {
      saveFileName: '',
      tableWidth: 'auto',
      tdCols: [],
      tdData: [],
      tableHeight: 500,
      filename: '',
      iSshowheader: true,
      excImprot: true,
      currentRowIndex: -1,
      codeKey: '1',
      treeType: 0,
      isSetTableRowSelected: true,
      ajaxHistoryData: [],
      dataCount: 0,
      pageSize: 100
    }
  },
  computed: {
    ...mapGetters('treeModule', ['treeSelectedArr'])
  },
  methods: {
    ...mapMutations('treeModule', {
      setTreeTerminal: 'SET_TREE_TERMINAL',
      setselectedNodeByAddressCode: 'SET_ADDRESS_CODE'
    }),
    initTableData(header, rowData, h, filename) {
      if (filename !== null) {
        this.$data.filename = filename
      }
      if (header !== null) {
        this.$data.tdCols = header
      }

      this.$refs.page.current = 1
      this.$data.ajaxHistoryData = rowData
      this.$data.dataCount = rowData.length

      this.changepage(1)

      if (h !== null && h > 0) {
        this.$data.tableHeight = h
      }
    },
    changepage(index) {
      let start = (index - 1) * this.$data.pageSize
      let end = index * this.$data.pageSize
      this.$data.tdData = this.$data.ajaxHistoryData.slice(start, end)
    },

    upadeteRowData(CodesData, Field2, Field3, Field4, Field5) {
      var dataSource = this.$data.tdData
      CodesData.map((code, index) => {
        dataSource.map((data, i) => {
          if (code === data['1']) {
            data['2'] = Field2
            data['3'] = Field3
            data['4'] = Field4
            data['5'] = Field5
          }
        })
      })
    },
    exportData() {
      var tHeaderArr = []
      var filterValArr = []
      for (let i in this.$data.tdCols) {
        tHeaderArr.push(this.$data.tdCols[i].title)
        filterValArr.push(this.$data.tdCols[i].key)
      }
      export2Excel(
        tHeaderArr,
        filterValArr,
        this.$data.ajaxHistoryData,
        this.$data.saveFileName
      )
    },
    currentchange(row, index) {
      if (this.$data.treeType === 1) {
        this.setselectedNodeByAddressCode(row[this.$data.codeKey])
      } else {
        this.setTreeTerminal(row[this.$data.codeKey])
      }
      this.$data.currentRowIndex = index
    },
    // 设置选中行
    highlightCurrentRow(code) {
      var obj = this.$refs.table
      this.$data.tdData.map((item, index) => {
        if (item[this.$data.codeKey] === code) {
          obj.highlightCurrentRow(index)
          this.$data.currentRowIndex = index
        }
      })
    },
    setiSshowheader(val, showExcl) {
      this.$data.iSshowheader = val
      this.$data.excImprot = showExcl
    },
    _getDownloadUrl(text) {
      var BOM = '\uFEFF'
      if (window.Blob && window.URL && window.URL.createObjectURL) {
        // let csvData = new Blob([BOM + text], { type: 'text/csv' })
        // let test = new Blob([BOM], { type: 'application/vnd.ms-excel' })
        // console.log(URL.createObjectURL(test))
        // console.log(URL.createObjectURL(csvData))
        return (
          'data:attachment/csv;charset=utf-8,' + BOM + encodeURIComponent(text)
        )
      } else {
        return ('data:attachment/vnd.ms-excel;charset=utf-8,' + BOM + encodeURIComponent(text))
      }
    },
    download(filename, text) {
      // ie版本<10
      var isIE = false
      if (isIE) {
        var oWin = window.top.open('about:blank', '_blank')
        oWin.document.charset = 'utf-8'
        oWin.document.write(text)
        oWin.document.close()
        oWin.document.execCommand('SaveAs', filename)
        oWin.close()
      } else if (isIE) {
        // ie版本大于等于10
        var BOM = '\uFEFF'
        var csvData = new Blob([BOM + text], { type: 'text/csv' })
        navigator.msSaveBlob(csvData, filename)
      } else {
        var link = document.createElement('a')
        link.download = filename + ''
        var path = this._getDownloadUrl(text)
        link.href = path
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  },
  watch: {
    treeSelectedArr(selectedNode) {
      if (
        this.$data.isSetTableRowSelected &&
        selectedNode.length > 0 &&
        this.$data.tdData.length > 0
      ) {
        var code =
          this.$data.treeType === 1
            ? selectedNode[0].objData.addressCode
            : selectedNode[0].objData.terminalCode
        this.highlightCurrentRow(code)
      }
    }
  }
}
</script>

<style >
.ivu-table .demo-table-info-row td {
  background-color: #2db7f5;
  color: #fff;
}
.ivu-table .demo-table-right-row td {
  background-color: #ff6600;
  color: #fff;
}
.ivu-table .ivu-table-row td {
  background-color: #fff; /*重置行背景样式*/
}
.ivu-table .ivu-table-row-highlight td {
  /*重置高亮背景样式*/
  background-color: #cbc9f5 !important;
  color: #fff;
}
.ivu-table-cell span {
  font-size: 16px;
  color: #000;
}
.ivu-table td {
  height: 36px;
}
</style>
