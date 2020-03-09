const distance = {    
    toRad(d) {  
        return d * Math.PI / 180
    },        
    getDisance(coordinates1, coordinates2) { //lat:緯度, lng:經度

    var dis = 0;

    var radLat1 = this.toRad(coordinates1.lat)

    var radLat2 = this.toRad(coordinates2.lat)

    var deltaLat = radLat1 - radLat2

    var deltaLng = this.toRad(coordinates1.lng) - this.toRad(coordinates2.lng)

    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)))

    return dis * 6378137
    }
}
  
export default distance
