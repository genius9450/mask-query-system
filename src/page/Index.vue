<template>  
  <el-container>
    <el-header>              
      <label class="mainTitle">罩哪裡去<i class="el-icon-info el-icon--right" /> 
        <div
          id="maskInfoImg"
          style="text-align: center;"
        >
          <img
            src="../assets/img/MaskInfo.png"
            style="width: 50%;object-fit: contain;"
          >
        </div> 
      </label>
      <link rel="manifest" href="../../public/manifest.json">
    </el-header>
    <el-main>
      <template>        
        <!-- PC   -->
        <div class="hidden-sm-and-down">
          <el-row
            :gutter="10"
            type="flex"
          >
            <el-col :span="6">
              <el-input
                v-model="filter.Name"
                placeholder="請輸入藥局名稱"
                prefix-icon="el-icon-search"
              />
            </el-col>
  
            <el-col :span="6">
              <el-input
                v-model="filter.Area"
                placeholder="請選擇地點"
                prefix-icon="el-icon-search"
                :disabled="isUseCurrentLocationQuery"
              >
                <template slot="append">
                  <el-button
                    class="el-icon-map-location"
                    @click="useCurrentLocation"
                  />
                </template>
              </el-input>
            </el-col>
  
            <el-col :span="3">
              <el-checkbox
                v-model="filter.HaveAdultMask"
                label="成人口罩"
                border
              />
            </el-col>

            <el-col :span="3">
              <el-checkbox
                v-model="filter.HaveChildMask"
                label="兒童口罩"
                border
              />
            </el-col>
          </el-row>
        </div>

        <!-- Mobile -->
        <div class="hidden-sm-and-up">
          <el-row>
            <el-col :span="24">
              <el-input
                v-model="filter.Name"
                placeholder="請輸入藥局名稱"
                prefix-icon="el-icon-search"
              />
            </el-col>
          </el-row>
            
          <el-row>
            <el-col :span="24">
              <el-input
                v-model="filter.Area"
                placeholder="請選擇地點"
                prefix-icon="el-icon-search"
                :disabled="isUseCurrentLocationQuery"
              >
                <template slot="append">
                  <el-button
                    class="el-icon-map-location"
                    @click="useCurrentLocation"
                  />
                </template>
              </el-input>
            </el-col>
          </el-row>
              
          <el-row :gutter="10">
            <el-col :span="10">
              <el-checkbox
                v-model="filter.HaveAdultMask"
                label="成人口罩"
                border
              />
            </el-col>
            <el-col :span="10">
              <el-checkbox
                v-model="filter.HaveChildMask"
                label="兒童口罩"
                border
              />
            </el-col>              
          </el-row>
        </div>
          

        <el-row :gutter="20">
          <el-button
            :disabled="isLoading"
            type="primary"
            icon="el-icon-search"
            round
            @click="query"
          >
            查詢
          </el-button>
        </el-row>
      </template>

      <!-- 分隔線 -->
      <el-divider />        

      <div style="text-align: left;">
        <span v-show="isUseCurrentLocationQuery">顯示距離當前位置{{ distanceKM }}公里藥局</span>
      </div>
        
      <div           
        v-loading="isLoading"                  
        v-infinite-scroll="showmore"
        infinite-scroll-disabled="disabledLoadingMoreData"
      >            
        <InfoCard
          v-for="(item, index) in listDataSource"               
          :key="index"
          :current-location="currentLocation"
          :info="item"                     
        />                    
      </div>

      <el-backtop target=".el-main" />
    </el-main>
    <!-- <el-footer>Footer</el-footer> -->
  </el-container>  
</template>

<script>
  import InfoCard from '../components/InfoCard.vue'
  import distance from '../lib/distance'
 
  const axios = require('axios')
  export default {
    name: 'Index',
    components: {
      InfoCard
    },
    data: function () {
      return {
        filter: {
          Name: '',
          Area: '',         
          HaveAdultMask: false,
          HaveChildMask: false,
          IsOpen: false,
          PageIndex: 1,
          PageSize: 10
        },
        currentLocation: null,
        isAreaLoading: false,
        dataSource: [],
        listDataSource: [],
        isLoading: false,
        isUseCurrentLocationQuery: false,
        nearestCount: 10,
        distanceKM: 3, // 3km
        dialogVisible: false
      }
    },
    computed: {
      totalCount() {
        return this.dataSource.length
      },
      diaplayDataCount() {
        return this.filter.PageIndex * this.filter.PageSize
      },
      noMoreData() {        
        return this.diaplayDataCount >= this.totalCount
      },
      disabledLoadingMoreData() {
        return this.noMoreData || this.isLoading
      }
    },
    watch: {
      isUseCurrentLocationQuery: function(value) {
        this.filter.Area = value ? '目前所在位置' : ''
      }  
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        let self = this        

        // 取得當前座標
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition( (pos) => 
          {
            // console.log('pos', pos)
            // 預設使用當前位置查詢            
            self.currentLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            self.isUseCurrentLocationQuery = true
            self.query()
          }, (err) => 
          {
            console.log(err)
          });
        } else {
          // this.getCity();
          console.log('google location error')
        }

      },
      reset() {
        this.filter.PageIndex = 1
        this.listDataSource = []
      },
      query() {
        this.reset()
        let self = this
        self.isLoading = true

        axios.get('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json')
        .then(function (response) {
          
          self.dataSource = self.filterData(response.data.features)
          // console.log(self.dataSource)
          self.dataBind()   
        })        
        .catch(function (error) {
          console.log(error)
        })
        .finally(() => {
          self.isLoading = false
        })
      },
      // 根據查詢條件過濾資料
      filterData(allData) {
        let self = this

        let filterDataSource = allData.filter(data => {          
          let dragInfo = data.properties

          let areaValid = true
          if (self.isUseCurrentLocationQuery) {
            let d = distance.getDisance(self.currentLocation, { lat: data.geometry.coordinates[1], lng: data.geometry.coordinates[0] })
            areaValid = d <= (self.distanceKM * 1000)
            data.distance = d // 將距離資料存入
          } else {
            areaValid = ( self.filter.Area === '' || dragInfo.address.includes(self.filter.Area) )
          }

          return  areaValid
                  && ( self.filter.Name === '' || dragInfo.name.includes(self.filter.Name) )                   
                  && ( !self.filter.HaveAdultMask || dragInfo.mask_adult > 0)
                  && ( !self.filter.HaveChildMask || dragInfo.mask_child > 0)
        })

        if (self.isUseCurrentLocationQuery) {
          filterDataSource = filterDataSource.sort((item1, item2)=>item1.distance - item2.distance);
        }

        return filterDataSource
      },      
      dataBind() {        
        let startIndex = (this.filter.PageIndex -1) * this.filter.PageSize
        let endIndex = this.filter.PageIndex * this.filter.PageSize
        let appendDataSource = this.dataSource.slice(startIndex, endIndex)        
        this.listDataSource = this.listDataSource.concat(appendDataSource)        
      },
      showmore() {
        
        
        if(!this.disabledLoadingMoreData) {
          this.filter.PageIndex ++
          this.dataBind()
        }

        // console.log('showmore', this.filter.PageIndex)
      },
      // 是否使用當前位置查詢
      useCurrentLocation(){
        this.isUseCurrentLocationQuery = !this.isUseCurrentLocationQuery                
      },
      showMaskInfo(){
        this.dialogVisible = true
      }
    } 
  }
</script>

<style scoped >

  .el-container{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
    
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;    

    height: 100%;
  }

  .el-row {
    margin-bottom: 20px;
  }
  

  .mainTitle:hover #maskInfoImg {
    display: block;
  }

  .mainTitle #maskInfoImg {
    display: none;
    position: absolute;        
    z-index: 100;   
    left: 0; 
    right: 0; 
    margin-left: auto; 
    margin-right: auto;     
  }

</style>
