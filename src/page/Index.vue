<template>  
    <el-container>
      <el-header>              
          <label class="mainTitle" >罩哪裡去<i class="el-icon-info el-icon--right"></i> 
            <div id="maskInfoImg" style="text-align: center;">
              <img src="../assets/img/MaskInfo.png" style="width: 50%;object-fit: contain;" >
            </div> 
          </label>                  
      </el-header>
      <el-main>
        <template>          
          <el-row :gutter="20" type="flex" >
            <el-col :span="6">
              <el-input
                placeholder="請輸入藥局名稱"
                prefix-icon="el-icon-search"
                v-model="filter.Name">
              </el-input>
            </el-col>

            <el-col :span="6">
              <el-input
                placeholder="請選擇地點"
                prefix-icon="el-icon-search"
                v-model="filter.Area"
                :disabled="isUseCurrentLocationQuery">
                <template slot="append"><el-button class="el-icon-map-location" @click="useCurrentLocation"></el-button></template>
              </el-input>
            </el-col>

            <el-col :span="3">
              <el-checkbox v-model="filter.HaveMask" label="仍有口罩" border></el-checkbox>
            </el-col>

          </el-row>

          <el-row :gutter="20" >
            <el-button :disabled="isLoading" type="primary" icon="el-icon-search" round @click="query" >查詢</el-button>
          </el-row>
        </template>

        <!-- 分隔線 -->
        <el-divider></el-divider>

        <div           
          v-loading="isLoading"                  
          v-infinite-scroll="showmore"
          infinite-scroll-disabled="disabledLoadingMoreData"
        >
            <InfoCard
              v-for="(item, index) in listDataSource"               
              :key="index"
              :currentLocation="currentLocation"
              :info="item"                     
            >
            </InfoCard>                    
        </div>

        <el-backtop target=".el-main"></el-backtop>
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
          HaveMask: false,
          PageIndex: 1,
          PageSize: 10
        },
        currentLocation: null,
        areaList: [],
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
    mounted() {
      this.init()      
    },
    methods: {
      init() {
        let self = this        

        this.areaList = ["台北市","基隆市","新北市","連江縣","宜蘭縣","新竹市","新竹縣","桃園市","苗栗縣","台中市","彰化縣","南投縣","嘉義市","嘉義縣","雲林縣","台南市","高雄市","澎湖縣","金門縣","屏東縣","台東縣","花蓮縣"]

        // // 取得當前座標
        // this.$getLocation()
        // .then(coordinates => {
        //   console.log(coordinates)
        //   self.currentLocation = coordinates
        // });

        // 取得當前座標
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition( (pos) => 
          {
            console.log('pos', pos)
            self.currentLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          }, (err) => 
          {
            console.log(err)
          });
        } else {
          // this.getCity();
          console.log('google location error');
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
          console.log(self.dataSource)
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
                  && ( !self.filter.HaveMask || dragInfo.mask_adult + dragInfo.mask_child > 0)
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

        console.log('showmore', this.filter.PageIndex)
      },
      // 是否使用當前位置查詢
      useCurrentLocation(){
        this.isUseCurrentLocationQuery = !this.isUseCurrentLocationQuery
        this.filter.Area = this.isUseCurrentLocationQuery ? '目前所在位置' : ''        
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

    /* position: absolute;
    width: 100%;
    top: 0; */
  }

  .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;

    /* position: absolute;
    width: 100%;
    bottom: 0; */
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
