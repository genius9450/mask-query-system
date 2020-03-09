<template>
  <el-card class="box-card" shadow="hover" :body-style="{ padding: '10px' }">
    <div  class="clearfix box-card-content" >

      <!-- 藥局名稱 -->
      <span style="font-size: -webkit-xxx-large;">{{ bindingData.name }}</span>
      
      <div style="float: right; padding: 10px 0">
        <el-badge style="margin-right: 25px;" :value="bindingData.mask_adult" :max="999" :type="maskCountAlert(bindingData.mask_adult)">
          <el-tag :type="maskCountAlert(bindingData.mask_adult)">成人口罩</el-tag>
        </el-badge>        
      
        <el-badge style="margin-right: 15px;" :value="bindingData.mask_child" :max="999" :type="maskCountAlert(bindingData.mask_child)">
          <el-tag :type="maskCountAlert(bindingData.mask_child)">兒童口罩</el-tag>
        </el-badge>
      </div>
      
      <!-- 分隔線 -->
      <el-divider></el-divider>
      
      <!-- 簡易資訊 -->
      <div class="simpleInfo">        
        <el-row :gutter="20">
          <el-col :span="16">
            <el-link :href="mapUrl" target="_blank"><i  class="el-icon-location-outline"></i> {{ address }} </el-link>
          </el-col>
          <el-col :span="8" style="text-align: end;">
            <i  class="el-icon-phone-outline"></i> {{ bindingData.phone }} 
          </el-col>
        </el-row>  
        <el-row :gutter="20">
          <el-col :span="24">
            <i  class="el-icon-edit-outline"></i> {{ bindingData.note }} 
          </el-col>          
        </el-row>        
      </div>
      
    </div>    
  </el-card>
</template>

<script>  
  export default {
    name: 'InfoCard',
    props: {
      info: {
        type: Object,
        default: () => { return {} },
        required: true
      },
      currentLocation: {
        type: Object,
        default: () => { return {} },
        required: false
      }
    },
    computed: {
      mapUrl: function() {
        let url = ''
        if (this.coordinates == null || this.coordinates.length != 2) {
          url = 'https://www.google.com/maps' // 
        } else if (this.location != null && this.location.lat != null && this.location.lng != null ) {
          // 根據當前座標做路徑規劃
          url = `https://maps.google.com/maps?saddr=${this.location.lat},${this.location.lng}&daddr=${this.coordinates[1]},${this.coordinates[0]}`
        } else { 
          // 指出目標藥局座標
          url = `http://maps.google.com/maps?q=${this.bindingData.name}@${this.coordinates[1]},${this.coordinates[0]}`
        }
        return url
      },
      address: function() {
        if (this.info.distance !== undefined) return `${this.bindingData.address} (${Math.round(this.info.distance / 1000 * 100) / 100} km)`
        else return this.bindingData.address
      }      
    },
    data: function () {
      return {  
        bindingData: {
          name: "",
          phone: "",
          address: "",
          mask_adult: 0,
          mask_child: 0,
          updated: "",
          available: "",
          note: "",
          custom_note: "",
          website: "",
          county: "",
          town: "",
          cunli: ""
        },
        coordinates: [],
        location: null
      }
    },
    watch: {      
      info: {
        handler(newValue, oldValue) {     
          // console.log(newValue)         
          this.bindingData = newValue.properties
          this.coordinates = newValue.geometry.coordinates
        },        
        immediate: true,
        deep: true
      },
      currentLocation: {
        handler(newValue, oldValue) {              
          this.location = newValue
        },        
        immediate: true,
        deep: true
      }
    },
    methods: {
      // 顯示詳細內容
      showDetail() {
        
      },      
      maskCountAlert(count) {
        let className = ''
        if(count > 100) className = 'success'
        else if (count > 50) className = 'warning'
        else if (count > 0) className = 'danger'
        else className = 'info'
        
        return className
      }
    } 
  }
</script>

<style scoped >

  .box-card {
    margin: 10px 0px;    
    text-align: left;
  }

  .box-card-content {
    line-height: 30px;
    margin: 5px;    
    font: menu;
  }

  .simpleInfo {    
    color: #909399;    
  }

</style>
