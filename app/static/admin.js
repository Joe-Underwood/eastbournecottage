const priceListListView = Vue.extend({
    methods: {
        isoDateFormat(date) {
            return date.toISOString().slice(0, 10);
        }
    },
    template: 
    `<div>
        <div class="price-list-segment" v-for="segment in priceList">
            <input type="date" :value="[isoDateFormat(segment['startDate'])]" />
        </div>
    </div>`
})

const vm = new Vue({
    el: '#root',
    data: {
        priceList: [
            { 'startDate': new Date(2020, 7, 15), 'price': 1000.00 },
            { 'startDate': new Date(2020, 7, 22), 'price': 1000.00 },
            { 'startDate': new Date(2020, 7, 29), 'price': 1000.00},
            { 'startDate': new Date(2020, 8, 5), 'price': 1000.00 },
            { 'startDate': new Date(2020, 8, 12), 'price': 1000.00 },
            { 'startDate': new Date(2020, 8, 19), 'price': 1000.00 },
            { 'startDate': new Date(2020, 8, 26), 'price': 1000.00 },
            { 'startDate': new Date(2020, 9, 3), 'price': 1000.00 },
            { 'startDate': new Date(2020, 9, 10), 'price': 1000.00 },
            { 'startDate': new Date(2020, 9, 17), 'price': 1000.00 },
            { 'startDate': new Date(2020, 9, 24), 'price': 1000.00 },
            { 'startDate': new Date(2020, 9, 31), 'price': 1000.00 },
        ]
    },
    methods: {
        initPriceListListView() {
            const instance = new priceListListView({
                data: {
                    priceList: this.priceList
                }
            });
            let mountPoint = document.querySelector('.list-view');
            instance.$mount(mountPoint);
        }
    },
    delimiters: ['<%', '%>']
})


