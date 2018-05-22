import WelcomePage from '../pages/welcomePage.vue'
import OrderPage from '../pages/orderPage.vue'

const routes = [
    {
        path: '/', 
        name: 'welcome',
        component: WelcomePage 
    },
    {
        path: '/order',
        name: 'order',
        component: OrderPage
    }
]

export default routes; //exporting object so it can be reused(imported) somewhere later