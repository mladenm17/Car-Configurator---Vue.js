<template>
  <div class="container-fluid">
    <header class="page-header">                
        <a href="#">
        <img class="headerBackground" src="../assets/images/mercedesTransparentLogo.png"/>
        </a> 
        <h1 class="gillSans">Configure your car</h1>
    </header> 
    <div class="row">         
        <div class="col-lg-12">  
             <nav v-if="navigationSeen" class="navbar sticky-top navbar-expand-lg navbar-light bg-white">    
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div class="navbar-nav">         
                        <a @click="addActiveClass" class="nav-item nav-link" :href="'#'+item.name"  v-for="item in menuItems" :value="item.id" :key="item.bodyId">
                            {{item.name}}      
                        </a>
                    </div>
                </div>
            </nav> 
            <div v-if="carClassesSeen">       
                <rotatingSign/> 
                <hatchback @callCarConfigurator="loadCarConfiguratorComponent" ref="hatchbackRef"/>           
                <suv @callCarConfigurator="loadCarConfiguratorComponent" ref="suvRef"/>               
                <limousine ref="limousineRef"/>                   
                <estate ref="estateRef"/>                     
                <cabriolet ref="cabrioletRef"/>                   
                <coupe ref="coupeRef"/>                   
            </div>
            <div v-if="carConfiguratorSeen">           
                <carConfiguration ref="carConfigurationRef"/>                   
            </div>  
        </div>
    </div>
  </div>
</template>

<script>
import rotatingSign from '../components/rotatingSign'
import hatchback from '../components/hatchback'
import suv from '../components/SUV'
import limousine from '../components/limousine'
import estate from '../components/estate'
import cabriolet from '../components/cabrio'
import coupe from '../components/coupe'
import carConfiguration from '../components/carConfiguration'

export default{
   	components: {
		rotatingSign, hatchback, suv, limousine, estate, cabriolet, coupe, carConfiguration
	},
    data(){  
         return {
            menuItems: [{}],
            startPage: true,
            classesPage: false,
            apiUrl: this.$store.state.apiUrl,
            apiKey: this.$store.state.apiKey,
            hatchback: 'hatchback',
            carClassesSeen: true,
            navigationSeen: true,
            carConfiguratorSeen: false
         }
    },
    mounted() {      
        this.pullCarBodies()
        //calling subcomponent's methods in order to be loaded
        //for now just 2 of them due to too meny requests
        this.$refs.hatchbackRef.pullCarClasses() 
        //this.$refs.suvRef.pullCarClasses()
        //this.$refs.limousine.pullClasses()
        //this.$refs.estateRef.pullCarClasses()
        //this.$refs.cabrioletRef.pullCarClasses()
        //this.$refs.coupeRef.pullCarClasses()
    },
    methods : {  
        callApi(handleResponse, url){
            this.axios.get(url).then((response) => {
                handleResponse(response.data)                      
            })
        }, 
        pullCarBodies(){
           //this.callApi(this.renderCarBodies, this.apiUrl + '/bodies?&apikey='+this.apiKey)
        },   
        renderCarBodies(data){
            data.forEach(element => {
                if(element.bodyId == 1 || element.bodyId == 3 || element.bodyId == 5 || element.bodyId == 6 || element.bodyId == 13 || element.bodyId == 16){
                this.menuItems.push({'id': element.bodyId, 'name': element.bodyName})
                }
            });
        },
        addActiveClass(){    
            var actives = document.getElementsByClassName("active");
            while (actives.length > 0)
                actives[0].classList.remove("active");
            event.target.classList.add('active')
        },
        loadCarConfiguratorComponent(){
            //hiding navigation, no need to be displayed in future steps of car configuration
            this.navigationSeen = false
            //waiting for DOM element to be rerendered after changing "carConfiguratorSeen" to true form child component (hatchback.vue, SUV.vue...))
            this.$nextTick(() => {
                this.$refs.carConfigurationRef.pullCarModel() 
            })
        }
    }
}
</script>

<style scoped>
.reset{
    margin: 0px;
    padding: 0px;
}
body{
    background-color:gainsboro;
}
h1{
    margin-right: 108px;
}
.clearfix{
    clear: both;
}
.container-fluid{
    background-color: white;
    height: 1000px;
}
.page-header{  
    height: 145px;
    width: 100%;
    border-bottom:1px solid black;
    text-align: center;
    margin-top: 20px;
}
.headerBackground{
    width: 120px;
    float: left;
    margin: 20px 0px 0px 15px;
}   
.gillSans{
    font-family: "Gill Sans", sans-serif;
    font-weight: 100;
    color: black;
    font-size: 90px;
  
}
.navbar-nav{
    margin: 0 auto !important;
    height: 40px;
}
.nav-item{
    margin-right: 15px !important;
    font-size: 20px;
    color: black !important;
}
.nav-item:hover{
    cursor: pointer;
    border-bottom: 1px solid black;  
}
.active{
    border-bottom: 1px solid black !important;  
}
.hatchback{
    background-color: lightgray;
}
.closed{
    width: 40px;
    height: 35px;
}
@media (max-height: 618px) {
    .sideNav li{
        font-size: 14px;    
        padding: 3px 15px;
        }
}
@media (max-height: 400px) {
    .sideNav li{
        font-size: 10px;    
        padding: 1px 15px;
        } 
}
</style>