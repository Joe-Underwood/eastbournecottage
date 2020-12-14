const vm = new Vue({
    el: '#root',
    data: {
        tempPriceList: [
            { 'startDate': '2021-01-09', 'price': '467.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-01-16', 'price': '519.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-01-23', 'price': '519.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-01-30', 'price': '519.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-02-06', 'price': '519.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-02-13', 'price': '557.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-02-20', 'price': '546.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-02-27', 'price': '535.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-03-06', 'price': '535.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-03-13', 'price': '535.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-03-20', 'price': '535.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-03-27', 'price': '535.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': true },
            { 'startDate': '2021-04-03', 'price': '683.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-04-10', 'price': '652.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-04-17', 'price': '580.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-04-24', 'price': '670.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-05-01', 'price': '657.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-05-08', 'price': '657.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-05-15', 'price': '678.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-05-29', 'price': '767.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-06-05', 'price': '652.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-06-12', 'price': '884.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-06-19', 'price': '884.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': true },
            { 'startDate': '2021-06-26', 'price': '938.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-07-03', 'price': '938.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-07-10', 'price': '938.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-07-17', 'price': '947.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-07-24', 'price': '975.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-07-31', 'price': '975.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-08-07', 'price': '975.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-08-14', 'price': '975.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-08-21', 'price': '957.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-08-28', 'price': '794.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-09-04', 'price': '794.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-09-11', 'price': '771.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-09-18', 'price': '742.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-09-25', 'price': '645.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-10-02', 'price': '645.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-10-09', 'price': '645.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-10-16', 'price': '668.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-10-23', 'price': '671.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-10-30', 'price': '529.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-11-06', 'price': '529.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-11-13', 'price': '529.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-11-20', 'price': '529.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-11-27', 'price': '529.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-12-04', 'price': '529.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-12-11', 'price': '546.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-12-22', 'price': '884.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2021-12-29', 'price': '884.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2022-01-05', 'price': '884.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2022-01-15', 'price': '519.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false },
            { 'startDate': '2022-01-22', 'price': '519.00', 'price2Weeks': '0.00', 'price3Weeks': '0.00', 'price4Weeks': '0.00', 'booked': false }, 
        ],
        priceListSettings: {
            discount2Weeks: 4,
            discount3Weeks: 6,
            discount4Weeks: 7,
            activePricesRange: '12',
            futurePricesRange: '6',
            defaultChangeoverDay: 5
        }
    },
    asyncComputed: {
        getPriceList: async function() {
            const prices = 
                fetch('/get_prices', { method: 'post' })
                    .then(response => {
                        return (response.json());
                    })
                    .then(json => {
                        return (json['priceList']);
                    })
            
            return (prices);
        },
        getPriceListSettings: async function() {
            const settings = 
            fetch('/get_price_list_settings', { method: 'post' })
                .then(response => {
                    return (response.json());
                })
                .then(json => {
                    return (json['priceListSettings']);
                })
            return (settings);
        }
    },
    methods: {
        refreshPriceList() {
            this.getPriceList.sort((a, b) => new Date(a['startDate']) - new Date(b['startDate']));
        },
        updatePriceList() {
            this.refreshPriceList();
            fetch('/update_prices', {
                method: 'post',
                body: JSON.stringify(this.getPriceList),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            })
        },
        updatePriceListSettings() {
            fetch('/update_price_list_settings', {
                method: 'post',
                body: JSON.stringify(this.getPriceListSettings),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            })
        },
        applyDiscounts() {
            for (segment in this.getPriceList) {
                try {
                    this.getPriceList[segment]['price2Weeks'] = `${ (((+this.getPriceList[segment]['price'] + +this.getPriceList[+segment + 1]['price']) * ((100 - +this.getPriceListSettings['discount2Weeks']) / 100))).toFixed(2) }`;
                }
                catch {
                    this.getPriceList[segment]['price2Weeks'] = '0';
                }
                try {
                    this.getPriceList[segment]['price3Weeks'] = `${ (((+this.getPriceList[segment]['price'] + +this.getPriceList[+segment + 1]['price'] + +this.getPriceList[+segment + 2]['price']) * ((100 - +this.getPriceListSettings['discount3Weeks']) / 100))).toFixed(2) }`;
                }    
                catch {
                    this.getPriceList[segment]['price3Weeks'] = '0';
                }
                try {
                    this.getPriceList[segment]['price4Weeks'] = `${ (((+this.getPriceList[segment]['price'] + +this.getPriceList[+segment + 1]['price'] + +this.getPriceList[+segment + 2]['price'] + +this.getPriceList[+segment + 3]['price']) * ((100 - +this.getPriceListSettings['discount4Weeks']) / 100))).toFixed(2) }`;
                }
                catch {
                    this.getPriceList[segment]['price4Weeks'] = '0';
                }
            }
        },
        adjustRanges() {
            this.refreshPriceList();
            let rangeStartDate = new Date(this.getPriceList[0]['startDate']);
            let rangeEndDate = rangeStartDate;
            rangeEndDate.setDate(rangeStartDate.getDate() + 7 * +this.getPriceListSettings['activePricesRange']);

            let lastDateString = this.getPriceList[this.getPriceList.length - 1]['startDate'];

            if (new Date(lastDateString) < rangeEndDate) {
                let numWeeks = 1;
                while (this.nextChangeoverDay(lastDateString, numWeeks) <= rangeEndDate) {
                    this.getPriceList.push({
                        'startDate': `${this.nextChangeoverDay(lastDateString, numWeeks).toISOString().slice(0, 10)}`,
                        'price': '0.00',
                        'price2Weeks': '0.00',
                        'price3Weeks': '0.00',
                        'price4Weeks': '0.00',
                        'booked': false
                    })
                    numWeeks++;
                }
            }

            else {
                for (let i = this.getPriceList.length - 1; i >= 0; i--) {
                    if (new Date(this.getPriceList[i]['startDate']) > rangeEndDate) {
                        this.getPriceList.splice(i, 1);
                    }
                }
            }
            
        },
        nextChangeoverDay(dateString, weekOffset=0) {
            let date = new Date(dateString);
            date.setDate((date.getDate() + weekOffset * 7) + (+this.getPriceListSettings['defaultChangeoverDay'] + (7 - date.getDay())) % 7);
            return(date);
        }
    },
    delimiters: ['<%', '%>']
})

