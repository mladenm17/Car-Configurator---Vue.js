import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
        bodyId: "",
        apiUrl: "https://api.mercedes-benz.com/configurator/v1/markets/de_DE",   
        apiKey: "b1210384-5634-4b3f-89ab-15a618870e8c",
        clickedModelId: "",
        selectedBodyName: "",
        selectedClassName: "",
        selectedModelName: "",
        data: []
    }
})