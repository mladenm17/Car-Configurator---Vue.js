<template>
    <div id="Sports Tourer" class="hatchback clearfix">
      <h2>-Sports Tourer(Hatcback)-</h2>
      <hr>
        <div class="tiles" v-for="item in classes" :key="item.id" :style="{'background-image': item.imageUrl[0]}">  
            <h4>{{item.className}}</h4>
            <p class="configureTitle">Configure one of the available models: </p>
            <ul class="clearfix">
                <li v-for="model in item.models" :key="model.id">
                    <a @click="showConfigurator" :id="model.modelId">{{model.modelName}}</a> 
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default{
    data(){  
         return {     
            apiUrl: this.$store.state.apiUrl,
            apiKey: this.$store.state.apiKey,
            classes: [],
         }
    },
    methods: {
        callApi(handleResponse, url, element){
            this.axios.get(url).then((response) => {
                handleResponse(response.data, element)                      
            })
        },
        //calling this method externally, from OrderPage.vue component
        pullCarClasses(){
            this.callApi(this.renderCarClasses, this.apiUrl + '/classes?bodyId=13&apikey='+this.apiKey)           
        },
        renderCarClasses(data){
            //limiting number of classes to be shown in component  
            if(data.length > 3) data.length = 3 
            var counter = 0;            
            data.forEach(element => {
                this.classes.push({'id' : element.classId, 'className': element.className, 'models': [], 'imageUrl' : []})
                this.callApi(this.renderCarModels, element._links.models, counter)
                counter++
            }); 
        },     
        renderCarModels(data, counter){
            //limiting number of models to be shown in component          
            if(data.length > 5) data.length = 5
            data.forEach(element => {
                this.classes[counter]['models'].push({'modelId': element.modelId, 'modelName': element.shortName}) 
                this.callApi(this.renderCarConfigurations, element._links.configurations, counter)                  
            });                                            
        },
        //it is necessary to call carConfigurations in order to get car images   
        renderCarConfigurations(data, counter){  
            this.callApi(this.renderCarImages, data._links.image, counter)  
        },
        renderCarImages(data, counter){   
            this.classes[counter]['imageUrl'].push("url('"+data.vehicle.EXT020.url+"')")          
        },
        showConfigurator(){
            console.log(event)
            //add modelId to store in order to be used in next step component (carConfigurator.vue)
            this.$store.state.clickedModelId = event.target.id
            this.$store.state.selectedModelName = event.target.innerText
            this.$store.state.selectedClassName = event.target.parentElement.parentElement.parentElement.children[0].innerText
            this.$store.state.selectedBodyName = event.target.parentElement.parentElement.parentElement.parentElement.children[0].innerText.slice(1, -1)
            console.log(event.target.parentElement.parentElement.parentElement.children[0].innerText)
            this.$parent.carConfiguratorSeen = true
            //emiting click event to the parent (orderPage.vue) so the parent can call methods from carCongifurator.vue component (this can't be done directly form this component)
            this.$emit('callCarConfigurator')
            this.$parent.carClassesSeen = false
        }
    }
}
</script>

<style scoped>
.clearfix{
    clear: both;
}
.hatchback{
    height: auto;
    background: transparent url('../assets/images/HDLogoBg.jpg') no-repeat center center;
    background-size: cover;
}
h2{
    text-align: center; 
}
.tiles{
    padding: 8px 20px;
    width: 33%;
    float: left;
    background-position: -86px -40px;
    background-size: 703px;
    background-repeat: no-repeat;
}
.configureTitle{
    margin-top: 245px;
    text-align: center;
}
ul{
    list-style: none;
    padding-left: 0px;
    width: 100%;
    border-top: 1px solid white;
}
ul li{
    float: left; 
    text-align: left;
    width: 158px;
    margin: 8px 0px;
    border-left: 1px solid gray;
    padding-left: 9px;
}
ul li:hover{
    cursor: pointer;
    color: white;
    background:rgb(204, 200, 200)
}
</style>