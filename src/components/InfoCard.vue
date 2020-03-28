<template>
  <el-card
    class="box-card"
    shadow="hover"
    :body-style="{ padding: '10px' }"
  >
    <!-- PC -->
    <div class="clearfix box-card-content hidden-sm-and-down">
      <!-- 藥局名稱 -->      
      <span style="font-size: xx-large;">{{ bindingData.name }}</span>
      <i
        v-show="moringOpen"
        style="font-size: x-large;"
        class="el-icon-sunrise"
      />
      <i
        v-show="afternoonOpen"
        style="font-size: x-large;"
        class="el-icon-sunny"
      />
      <i
        v-show="nightOpen"
        style="font-size: x-large;"
        class="el-icon-moon"
      />
      
      <div style="float: right; padding: 10px 0">
        <el-badge
          style="margin-right: 25px;"
          :value="bindingData.mask_adult"
          :max="999"
          :type="maskCountAlert(bindingData.mask_adult)"
        >
          <el-tag :type="maskCountAlert(bindingData.mask_adult)">
            成人口罩
          </el-tag>
        </el-badge>        
      
        <el-badge
          style="margin-right: 15px;"
          :value="bindingData.mask_child"
          :max="999"
          :type="maskCountAlert(bindingData.mask_child)"
        >
          <el-tag :type="maskCountAlert(bindingData.mask_child)">
            兒童口罩
          </el-tag>
        </el-badge>
      </div>
      
      <!-- 分隔線 -->
      <el-divider />
      
      <!-- 簡易資訊 -->
      <div class="simpleInfo">        
        <el-row :gutter="20">
          <el-col :span="16">
            <el-link
              :href="mapUrl"
              target="_blank"
            >
              <i class="el-icon-location-outline" /> {{ address }}
            </el-link>
          </el-col>
          <el-col
            :span="8"
            style="text-align: end;"
          >
            <i class="el-icon-phone-outline" /> {{ bindingData.phone }} 
          </el-col>
        </el-row>  
        <el-row :gutter="20">
          <el-col :span="24">
            <i class="el-icon-edit-outline" /> {{ bindingData.note }} 
          </el-col>          
        </el-row>        
      </div>
    </div>
    
    <!-- Mobile -->
    <div class="clearfix box-card-content hidden-sm-and-up">
      <!-- 藥局名稱 -->
      <span style="font-size: xx-large;">{{ bindingData.name }}</span>
      <i
        v-show="moringOpen"
        style="font-size: x-large;"
        class="el-icon-sunrise"
      />
      <i
        v-show="afternoonOpen"
        style="font-size: x-large;"
        class="el-icon-sunny"
      />
      <i
        v-show="nightOpen"
        style="font-size: x-large;"
        class="el-icon-moon"
      />
      
      <!-- 口罩數量 -->
      <div style="margin: 5px 0px;">
        <el-badge
          style="margin-right: 30px;"
          :value="bindingData.mask_adult"
          :max="999"
          :type="maskCountAlert(bindingData.mask_adult)"
        >
          <el-tag :type="maskCountAlert(bindingData.mask_adult)">
            成人口罩
          </el-tag>
        </el-badge>        
      
        <el-badge
          style="margin-right: 30px;"
          :value="bindingData.mask_child"
          :max="999"
          :type="maskCountAlert(bindingData.mask_child)"
        >
          <el-tag :type="maskCountAlert(bindingData.mask_child)">
            兒童口罩
          </el-tag>
        </el-badge>
      </div>
      
      <!-- 分隔線 -->
      <el-divider />
      
      <!-- 簡易資訊 -->
      <div class="simpleInfo">
        <!-- 地址 -->
        <el-row>
          <el-col :span="24">
            <el-link
              :href="mapUrl"
              target="_blank"
            >
              <i class="el-icon-location-outline" /> {{ address }}
            </el-link>
          </el-col>          
        </el-row>  

        <!-- 電話 -->
        <el-row>
          <el-col :span="24">
            <i class="el-icon-phone-outline" />{{ bindingData.phone }}
          </el-col>
        </el-row>

        <!-- 備註 -->
        <el-row>
          <el-col :span="24">
            <i class="el-icon-edit-outline" /> {{ bindingData.note }} 
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
    data: function () {
      return {  
        bindingData: {
          name: '',
          phone: '',
          address: '',
          mask_adult: 0,
          mask_child: 0,
          updated: '',
          available: '',
          note: '',
          custom_note: '',
          website: '',
          county: '',
          town: '',
          cunli: '',
          service_periods: ''
        },
        coordinates: [],
        todayServicePeriods: 'NNN',
        location: null
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
      },
      moringOpen: function() {
        return this.todayServicePeriods.length === 3 ? this.todayServicePeriods[0] === 'N' : false
      },
      afternoonOpen: function() {
        return this.todayServicePeriods.length === 3 ? this.todayServicePeriods[1] === 'N' : false
      },
      nightOpen: function() {
        return this.todayServicePeriods.length === 3 ? this.todayServicePeriods[2] === 'N' : false
      }
    },
    watch: {      
      info: {
        handler(newValue, oldValue) {     
          if (newValue === oldValue) return
          this.bindingData = newValue.properties
          this.coordinates = newValue.geometry.coordinates
          
          // 取得今日看診時段(1:星期一、2:星期二、3:星期三、4:星期四、5:星期五、6:星期六、7:星期日)
          let day = new Date().getDay() === 0 ? 7 : new Date().getDay()
          this.todayServicePeriods = this.bindingData.service_periods.substring((day-1)*3, day*3)

        },        
        immediate: true,
        deep: true
      },
      currentLocation: {
        handler(newValue, oldValue) {    
          if (newValue === oldValue) return
          this.location = newValue
        },        
        immediate: true,
        deep: true
      }
    },
    methods: {          
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
    font-size: 14px;    
  }

  .open {
    font-size: x-large;
    color: #E6A23C;
  }

  .close {
    font-size: x-large;
    color: #909399;
  }

</style>
