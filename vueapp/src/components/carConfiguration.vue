<template>
    <div id="carConfiguration" class="clearfix">
        <div class="row header">
            <div class="col-sm-3 info">
                <div class="selectedModelPrice">
                    <p>Initial price: {{initialPrice}}&euro;</p>
                    <p>Built price: {{builtPrice}}&euro;</p>
                 </div>
            </div>
            <!-- :style="{'background-image': imageUrl} -->
             <div class="col-sm-6 reset">
                <b-carousel id="carousel1"
                style="text-shadow: 1px 1px 2px #333;"
                controls
                indicators
                background="rgb(204, 200, 200)"
                :interval="4000"
                img-width="1500px"
                img-height="1500px"
                v-model="slide"
                @sliding-start="onSlideStart"
                @sliding-end="onSlideEnd">
                    <b-carousel-slide class="imgSlider" caption="Exterior" text="Exterior" :img-src="imageUrl">
                    </b-carousel-slide>
                    <b-carousel-slide class="imgSlider" caption="Interior" text="Interior" :img-src="imageUrlInt">
                    </b-carousel-slide>
                </b-carousel>
            </div>
             <div class="col-sm-3 info">
                 <div class="selectedModelSpecs">
                    <p class="bold">{{selectedBodyName}} | {{selectedClassName}} | {{selectedModelName}}</p>
                    <p v-for="item in technicalInfo" :key="item.id">{{item}}</p>
                 </div>     
            </div>
        </div>
        <div class="row components clearfix">   
            <div class="col-sm-3 colors">
                <h4>Choose color</h4>
                <hr>
                <div>
                    <b-form-select v-model="selectedItem" @change="onColorClick">
                        <option class="options" :value="null" disabled>Please select</option>
                        <option class="options" v-for="item in colors" :key="item.value" :value="item.value">{{item.name}}</option>
                    </b-form-select>
                </div>
            </div>
            <div class="col-sm-6 equipment">
                <h4>Choose equipment</h4>
                 <hr>
                <div class="equipmentTiles" v-for="item in equipment" :key="item.id">
                    <img :src="item.url" class="equipmentImg" />
                    <input type="checkbox" :id="item.id" @click="onEquipmentClick">
                </div>  
            </div>
            <div class="col-sm-3 wheels">
                <h4>Choose wheel</h4>
                <hr>              
                <div class="wheelTiles" v-for="item in wheels" :key="item.id">
                    <img :src="item.url" :id="item.id" class="wheelImg" @click="onWheelClick"/>
                    <p class="wheelInfo">{{item.size}} | {{item.price}}</p>         
                </div>                        
            </div>
            <div>
                <popup1 ref="popup1"/>
            </div>
        </div>
    </div>
</template>

<script>
import popup1 from '../components/popup1'
export default{
    components: {
		popup1
	},
    data(){  
         return {
            apiUrl: this.$store.state.apiUrl,
            apiKey: this.$store.state.apiKey,     
            clickedModelId: this.$store.state.clickedModelId,
            selectedBodyName: this.$store.state.selectedBodyName,
            selectedClassName: this.$store.state.selectedClassName,
            selectedModelName: this.$store.state.selectedModelName,
            configurationId: "",
            imageUrl: "",
            imageUrlInt: "",
            componentId: "",
            colors: [],
            equipment: [],
            wheels: [],
            technicalInfo: [],
            selectedItem: null,
            initialPrice: 0,
            builtPrice: 0,
            componentPrice: 0,
            apiPriceInformation: 0   
         }
    },
    methods: {
        callApi(handleResponse, url, param1, param2){
            this.axios.get(url).then((response) => {     
                handleResponse(response.data, param1, param2)                      
            })
        },
        //this method is entry point for this component
        pullCarModel(){ 
            this.callApi(this.renderCarConfiguration, this.apiUrl + '/models/'+this.clickedModelId+'/configurations/initial?apikey='+this.apiKey)                                                    
        },   
        renderCarConfiguration(data){ 
            this.initialPrice = data.initialPrice.price
            this.builtPrice = Number(data.initialPrice.price)
            this.technicalInfo.push(
            'Height: '+data.technicalInformation.dimensions.height.value +"mm" + ', Width: '+data.technicalInformation.dimensions.width.value+"mm"+', Length: '+data.technicalInformation.dimensions.length.value+"mm",
            'Doors: '+data.technicalInformation.doors,
            'Top speed: '+data.technicalInformation.topSpeed.value + "km/h", 
            'Fuel type: '+data.technicalInformation.engine.fuelType, 
            'Horse power: '+data.technicalInformation.engine.powerHp.value + " PS", 
            'Capacity: '+data.technicalInformation.engine.capacity.value +"cm"+"\u00B3", 
            'Weight: '+data.technicalInformation.kerbWeight.value + "kg"
            )
            this.configurationId = data.configurationId
            this.callApi(this.renderCarImage, data._links.image) 
            this.callApi(this.renderCarComponents, data._links.selectables)  
        },
        renderCarImage(data){ 
            console.log(data)  
            //this.imageUrl = "url('"+data.vehicle.EXT020.url+"')"   
            this.imageUrl = data.vehicle.EXT020.url  
            this.imageUrlInt = data.vehicle.INT1.url  
        },
        renderCarComponents(data){
            console.log(data)
            data.componentCategories.forEach(element => {
                // if(element.categoryName == 'PAINTS'){ 
                //     element.subcategories.forEach(subcategory => {
                //         subcategory.componentIds.forEach(componentId => {
                //             this.colors.push({'name': data.vehicleComponents[componentId].name, 'value': componentId})
                //         });
                //     })
                // }
                if(element.categoryName == 'SPECIAL_EQUIPMENT'){ 
                    if(element.subcategories.length > 3) element.subcategories.length = 3;       
                    element.subcategories.forEach(subcategory => {
                        //if(subcategory.componentIds.length > 3) subcategory.componentIds.length = 3;      
                        subcategory.componentIds.forEach(componentId => {
                            if(subcategory.componentIds.length > 4) subcategory.componentIds.length = 4;   
                            this.callApi(this.renderCarEquipment, data.vehicleComponents[componentId]._links.image, componentId)
                        });              
                     })
                }
                // if(element.categoryName == 'WHEELS'){
                //     if(element.subcategories.length > 3) element.subcategories.length = 3;  
                //     element.subcategories.forEach(subcategory => { 
                //         if(subcategory.componentIds.length > 4) subcategory.componentIds.length = 4;                   
                //         subcategory.componentIds.forEach(componentId => {
                //             var wheelSize = data.vehicleComponents[componentId].name;   
                //             var wheelPrice = data.vehicleComponents[componentId].priceInformation.price;  
                //             var wheelDetails = [{wheelSize, wheelPrice}] 
                //             this.callApi(this.renderCarWheels, data.vehicleComponents[componentId]._links.image, componentId, wheelDetails)
                //         });
                //     }) 
                // }            
            });
        },
        renderCarEquipment(data, componentId){
            if(data.equipment != null)
                this.equipment.push({'id': componentId, 'url': data.equipment.url })
        },
        renderCarWheels(data, componentId, wheelDetails){
            var wheelSizeInches = wheelDetails[0]['wheelSize'].substr(wheelDetails[0]['wheelSize'].length - 5, 4); 
            this.wheels.push({'id': componentId, 'price': wheelDetails[0]['wheelPrice']+'\u20AC', 'size': wheelSizeInches, 'url': data.rim.url})        
        },
        onColorClick(){
            this.componentId = event.target.value;
            this.callApi(this.addComponentToConfiguration, this.apiUrl + '/models/'+this.clickedModelId+'/configurations/'+this.configurationId+'/alternatives/+'+this.componentId+'?apikey='+this.apiKey)
        },
        onEquipmentClick(){
            console.log('equipment')
            console.log(data)
            this.componentId = event.target.value;
            var price = event.target.nextElementSibling.innerText
            var priceArray = price.split('|')
            this.componentPrice = priceArray[1].slice(0, priceArray[1].length - 1).trim()
            this.callApi(this.addComponentToConfiguration, this.apiUrl + '/models/'+this.clickedModelId+'/configurations/'+this.configurationId+'/alternatives/+'+this.componentId+'?apikey='+this.apiKey)
        },
        onWheelClick(){
            var selectedTiles = document.getElementsByClassName("selected");
            while (selectedTiles.length > 0)
                selectedTiles[0].classList.remove("selected");
            event.target.parentElement.classList.add('selected')
            this.componentId = event.target.id
            var price = event.target.nextElementSibling.innerText
            var priceArray = price.split('|')
            this.componentPrice = priceArray[1].slice(0, priceArray[1].length - 1).trim()
            this.callApi(this.addComponentToConfiguration, this.apiUrl + '/models/'+this.clickedModelId+'/configurations/'+this.configurationId+'/alternatives/+'+this.componentId+'?apikey='+this.apiKey)
        },      
        addComponentToConfiguration(data){
            this.apiPriceInformation = data[0].priceInformation.price
            if(this.apiPriceInformation == 0){
                this.builtPrice += Number(this.componentPrice)
            }
            else{
                 this.builtPrice += Number(this.apiPriceInformation)
            }
            this.builtPrice.toFixed(0) 
            this.configurationId = data[0].configurationId
            this.callApi(this.renderCarImage, data[0]._links.image)
            this.$store.state.data = data
            //with selected component, some extra components may be obligatory and included in package, 
            //so it is necessary to aware user of adding extra components to price, in popup window   
            //components must be added to configuration first so i can get choosed, added and removed components from API to show in popup
            //this gets things complicated, so if user clicks "cancel" button in popup, i have to turn back to previous configuration
            this.$refs.popup1.fillPopUp(data)       
        },
        removeComponentFromConfiguration(){
            this.builtPrice -= Number(this.apiPriceInformation)
            this.builtPrice.toFixed(0)
        }
    }
}
</script>

<style scoped>
.clearfix{
    clear: both;
}
h4{
    margin: 20px auto;
}
#carConfiguration{
    background: transparent url("../assets/images/mercedesBlured.png") no-repeat;
    background-attachment: fixed;
    background-size: cover;
    height: 1000px;
}
.header{
    width: 90%;
    margin: 0 auto;
}
.info{
    display: table;
    height: 450px;
}
.selectedModelPrice{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    margin: 0 auto;
    font-weight: bold;
    font-size: 20px;
}
.reset{
   padding: 0px;
}
.imgSlider{
    width: 100%;
    height: 433px;
}
.selectedModelSpecs{
    display: table-cell;
    vertical-align: middle;
    text-align: left;
    margin: 0 auto;
    font-size: 14px;
}
.components{
    margin: 0 auto;
    width: 90%;
}
.colors{
    display: table;
    text-align: center;
    background: transparent url('../assets/images/HDLogoBg.jpg') no-repeat center center;
    height: 335px;
}
.equipment{
  background: transparent url('../assets/images/HDLogoBg.jpg') no-repeat center center;
  text-align: center;
}
.equipmentTiles{
    float: left;
    width: 210px;
    margin: 0px 30px 10px 30px;
}
.equipmentImg{
    float: left;
    width: 210px;
    height: 120px;
}
.equipmentTiles:hover{
    cursor: pointer;
    background: rgb(204, 200, 200);
}
.wheels{
  text-align: center;
  background: transparent url('../assets/images/HDLogoBg.jpg') no-repeat center center;
}
.wheelTiles{
    float: left;
    width: 130px;
    height: 115px;
}
.wheelImg{
    width: 80px;
    height: 80px; 
}
.wheelTiles:hover{
    background: rgb(204, 200, 200);
    cursor: pointer;
}
.wheelInfo{
    font-size: 12px;
}
.bold{
    font-weight: bold;
}
.selected{
    background: rgb(204, 200, 200);
}
.options:hover{
    cursor: pointer;
}
</style>