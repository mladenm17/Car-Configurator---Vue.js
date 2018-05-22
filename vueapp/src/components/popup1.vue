 <template>
<div id="popup1" class="overlayPopUp" ref="popup1">
    <div class="popup">
        <div class="content" id="content">
            <h2>Confirm selection</h2>
            <hr>
            <div class="choosedComponent">
                <h3 class="popupComponentHeading">You choosed:</h3> 
                <hr>                
                <p class="popupComponents" >{{choosedComponent}}</p>
                <p class="popupComponentsPrice" >{{choosedComponentPrice}}</p>
            </div>
            <div class="addedComponents" ref="addedComponentsRef">
                <h3 class="popupComponentHeading">Also must be added:</h3>
                <hr>
                <p class="popupComponents" v-for="item in addedComponents" :key="item.id">{{item.name}}</p>
                <p class="popupComponentsPrice" v-for="item in addedComponentsPrice" :key="item.id">{{item.price}}</p>
            </div>
            <div class="removedComponents" ref="removedComponentsRef">
                <h3 class="popupComponentHeading">Also must be removed:</h3>
                <hr>
                <p class="popupComponents" v-for="item in removedComponents" :key="item.id">{{item.name}}</p>
                <p class="popupComponentsPrice" v-for="item in removedComponentsPrice" :key="item.id">{{item.price}}</p>
            </div>
            <hr> 
            <a class="close" @click="onBtnCancel">&times;</a> 
            <div class="popupFooter" ref="popupFooterRef">
                <button class="btnCancel" type="button" @click="onBtnCancel">Cancel</button>
                <button class="btnConfirm" type="button" @click="onBtnConfirm">Confirm</button>   
                <p class="addedComponentsTotalPrice" ref="totalPriceRef">TOTAL: {{totalPrice}}</p>
            </div>            
        </div>           
    </div>
</div>  
</template>

<script>
export default{
    data(){  
         return {     
            choosedComponent: "",
            choosedComponentPrice: "",
            addedComponents: [],
            addedComponentsPrice: [],
            removedComponents: [],
            removedComponentsPrice: [],
            totalPrice: ""
         }
    },
    methods: {
        fillPopUp(){
            var data = this.$store.state.data 
            console.log('lenght') 
            console.log(data[0].addedComponents.length)
            if(data[0].addedComponents.length != 0){
                //last element in returned array from API is one added(selected) component
                this.choosedComponent = data[0].addedComponents[data[0].addedComponents.length - 1].name
                this.choosedComponentPrice = data[0].addedComponents[data[0].addedComponents.length - 1].priceInformation.price + '\u20AC'
    
                //slicing last element not to be shown twice (it will be shown in "you choosed" section above)
                var arrayWithouthLastElement = data[0].addedComponents.slice(0, (data[0].addedComponents.length - 1));
                arrayWithouthLastElement.forEach(element => {
                    this.addedComponents.push({'name': element.name})   
                    this.addedComponentsPrice.push({'price': element.priceInformation.price + '\u20AC'}) 
                    this.totalPrice = data[0].priceInformation.price + '\u20AC'  
                    this.$refs.addedComponentsRef.classList.add('show')

                });
                this.showPopUp()
            }
            if(data[0].removedComponents.length != 0){
                data[0].removedComponents.forEach(element => {
                    this.removedComponents.push({'name': element.name})   
                    this.removedComponentsPrice.push({'price': element.priceInformation.price + '\u20AC'})
                    this.totalPrice = data[0].priceInformation.price + '\u20AC'  
                    this.$refs.removedComponentsRef.classList.add('show')      
                });                 
                this.showPopUp()      
            }  
        },
        showPopUp(){
            this.$refs.popup1.classList.add("show");          
        },
        onBtnCancel(){
            this.$refs.popup1.classList.remove("show");
            this.addedComponents = []
            this.addedComponentsPrice = []
            this.removedComponents = []
            this.removedComponentsPrice = []
            this.$refs.addedComponentsRef.classList.remove('show') 
            this.$refs.removedComponentsRef.classList.remove('show') 
            //now can call parent's method to remove added component from configuration
            this.$parent.removeComponentFromConfiguration()
        },
        onBtnConfirm(){
            
        }
    }
}
</script>

<style scoped>
.overlayPopUp{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    transition: opacity 500ms;
    display: none;
    z-index: 3;
}
.popup{
    margin: 70px auto;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    width: 45%;
    position: relative;
    transition: all 5s ease-in-out;
}
.show{
    display: block !important;
}
.popup h2{
    margin-top: 0;
    color: #333;
    font-family: Tahoma, Arial, sans-serif;
}
.popup .close{
    position: absolute;
    top: -4px;
    right: 5px;
    transition: all 200ms;
    font-size: 30px;
    font-weight: bold;
    text-decoration: none;
    color: #333;
}
.popup .close:hover{
    color: black;
}
.popup .content{
    max-height: 70%;
    overflow: auto;
}
.choosedComponent{
    padding: 10px 0px;
    font-weight: bold;
}
.addedComponents{
    padding: 10px 0px;
    font-weight: bold;
    display: none;
}
.removedComponents{
    padding: 10px 0px;
    font-weight: bold;
    display: none;
}
.popupComponentHeading{
    font-size: 18px;
    margin: 0px;
}
.popupComponents{
    font-size: 13px;
    font-weight: normal;
    display: table;
}
.popupComponents:before {
    content: "\25CF";
    padding-left: 15px;
    display: table-cell;
    vertical-align: middle;
    font-size: 10px;
    padding-right: 6px;
}
.popupComponentsPrice{
    float: right;
    font-size: 14px;
    font-weight: normal;
    padding-right: 24px;
    margin-top: -36px;
}
.addedComponentsTotalPrice{
    font-weight: bold;
    float: right;
    padding-right: 24px;
}
.btnCancel{
    color: white;
    background-color:lightslategray;
    border-radius: 4px;
    padding: 6px 67px;
    text-decoration: none !important;
    font-size: 14px;
    margin-right: 20px;
}
.btnConfirm{
    color: white;
    background-color: rgb(41, 40, 40);
    border-radius: 4px;
    padding: 6px 67px;
    text-decoration: none !important;
    font-size: 14px;
}
.btnCancel:hover, .btnConfirm:hover{
    cursor: pointer;
}
</style>