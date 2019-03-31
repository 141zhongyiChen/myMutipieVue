<template>
  <Layout id="right">
    <!-- content-right  header -->
    <Header :style="{ lineHeight: 1,padding: '4px',background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)' ,position: 'relative'}">
     <!-- create a html target to insert anything here with an attribute like this 'slot=layout-header' -->
      <slot name="layout-header"></slot>
    </Header>

    <!-- content-right middle -->
    <Content :style="{padding: '4px'}">

      <Breadcrumb id="tip" :style="{margin: '6px 0',position: 'relative'}">
        <!-- create a html target to insert anything here with an attribute like this 'slot=layout-middle' -->
        <slot name="layout-middle"></slot>
      </Breadcrumb>

      <!-- content-right footer -->
      <Card :style="{lineHeight: 1, paddingLeft: 0, position: 'relative'}">
       <!-- the codes or components will be inserted here default -->
        <slot></slot>
      </Card>
    </Content>
  </Layout>
</template>
<script>
export default {
  mounted () {

  }
}
</script>
<style>
  #right .ivu-layout-header {
    background: #495060;
    padding: 0 50px;
    height: auto;
    line-height: 64px
  }
  #right {
    height: 100%;
  }
</style>
