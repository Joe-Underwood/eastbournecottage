const vm = new Vue({
    el: '#root',
    data: {
        priceList: null,
        futurePriceList: null,
        priceListSettings: null,
        bookings: null,
        customers: null,
    },
    created: function() {
        this.getPriceList();
        this.getFuturePriceList();
        this.getPriceListSettings();
        this.getBookings();
        this.getCustomers();
    },
    methods: {
        getPriceList() {
            fetch('/get_price_list', { method: 'post' })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    this.priceList = json['priceList'];
                })
                .then(() => {
                    for (let i = 0; i < this.priceList.length; i++) {
                        this.$watch(function() {
                            return this.priceList[i];
                        },
                        function() {
                            this.priceList[i]['updateFlag'] = true;
                        },
                        { deep: true })
                    }
                })
        },
        getFuturePriceList() {
            fetch('/get_future_price_list', { method: 'post' })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    this.futurePriceList = json['futurePriceList'];
                })
                .then(() => {
                    for (let i = 0; i < this.futurePriceList.length; i++) {
                        this.$watch(function() {
                            return this.futurePriceList[i];
                        },
                        function() {
                            this.futurePriceList[i]['updateFlag'] = true;
                        },
                        { deep: true })
                    }
                })
        },
        getPriceListSettings() {
            fetch('/get_price_list_settings', { method: 'post' })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    this.priceListSettings = json['priceListSettings'];
                })
                .then(() => {
                    this.$watch('priceListSettings',
                    function() {
                        this.priceListSettings['updateFlag'] = true;
                    },
                    { deep: true })
                })
        },
        getBookings() {
            fetch('/get_bookings', { method: 'post' })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    this.bookings = json['bookings'];
                })
                .then(() => {
                    for (let i = 0; i < this.bookings.length; i++) {
                        this.$watch(function() {
                            return this.bookings[i];
                        },
                        function() {
                            this.bookings[i]['updateFlag'] = true;
                        },
                        { deep: true })
                    }
                })
        },
        getCustomers() {
            fetch('/get_customers', { method: 'post' })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    this.customers = json['customers'];
                })
                .then(() => {
                    for (let i = 0; i < this.customers.length; i++) {
                        this.$watch(function() {
                            return this.customers[i];
                        },
                        function() {
                            this.customers[i]['updateFlag'] = true;
                        },
                        { deep: true })
                    }
                })
        },
        refreshPriceList() {
            this.priceList.sort((a, b) => new Date(a['startDate']) - new Date(b['startDate']));
        },
        refreshFuturePriceList() {
            this.futurePriceList.sort((a, b) => new Date(a['startDate']) - new Date(b['startDate']));
        },
        setPriceList() {
            this.refreshPriceList();
            fetch('/set_price_list', {
                method: 'post',
                body: JSON.stringify(this.priceList),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            })
        },
        setFuturePriceList() {
            this.refreshFuturePriceList();
            fetch('/set_future_price_list', {
                method: 'post',
                body: JSON.stringify(this.futurePriceList),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            })
        },
        setPriceListSettings() {
            fetch('/set_price_list_settings', {
                method: 'post',
                body: JSON.stringify(this.priceListSettings),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            })
        },
        setBookings() {
            fetch('/set_bookings', {
                method: 'post',
                body: JSON.stringify(this.bookings),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            })
        },
        addBooking() {
            this.bookings.push({
                'id': null,
                'customerId': null,
                'arrivalDate': null,
                'departureDate': null,
                'adults': 0,
                'children': 0,
                'infants': 0,
                'dogs': 0,
                'stayPrice': 0,
                'dogPrice': 0,
                'price': 0,
                'updateFlag': true,
                'removeFlag': false
            })
        },
        setCustomers() {
            fetch('/set_customers', {
                method: 'post',
                body: JSON.stringify(this.customers),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            })
        },
        addCustomer() {
            this.customers.push({
                'id': null,
                'firstName': null,
                'lastName': null,
                'emailAddress': null,
                'phoneNumber': null,
                'addressLine1': null,
                'addressLine2': null,
                'townOrCity': null,
                'countyOrRegion': null,
                'postcode': null,
                'updateFlag': true
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

            for (segment in this.getFuturePriceList) {
                try {
                    this.getFuturePriceList[segment]['price2Weeks'] = `${ (((+this.getFuturePriceList[segment]['price'] + +this.getFuturePriceList[+segment + 1]['price']) * ((100 - +this.getPriceListSettings['discount2Weeks']) / 100))).toFixed(2) }`;
                }
                catch {
                    this.getFuturePriceList[segment]['price2Weeks'] = '0';
                }
                try {
                    this.getFuturePriceList[segment]['price3Weeks'] = `${ (((+this.getFuturePriceList[segment]['price'] + +this.getFuturePriceList[+segment + 1]['price'] + +this.getFuturePriceList[+segment + 2]['price']) * ((100 - +this.getPriceListSettings['discount3Weeks']) / 100))).toFixed(2) }`;
                }    
                catch {
                    this.getFuturePriceList[segment]['price3Weeks'] = '0';
                }
                try {
                    this.getFuturePriceList[segment]['price4Weeks'] = `${ (((+this.getFuturePriceList[segment]['price'] + +this.getFuturePriceList[+segment + 1]['price'] + +this.getFuturePriceList[+segment + 2]['price'] + +this.getFuturePriceList[+segment + 3]['price']) * ((100 - +this.getPriceListSettings['discount4Weeks']) / 100))).toFixed(2) }`;
                }
                catch {
                    this.getFuturePriceList[segment]['price4Weeks'] = '0';
                }
            }
        },
        adjustRanges() {
            this.refreshPriceList();
            let rangeStartDate = new Date(this.getPriceList[0]['startDate']);
            let rangeEndDate = rangeStartDate;
            rangeEndDate.setDate(rangeStartDate.getDate() + 7 * +this.getPriceListSettings['activePricesRange']);

            while (new Date(this.getPriceList[this.getPriceList.length - 1]['startDate']) < rangeEndDate) {
                this.getPriceList.push(this.getFuturePriceList[0]);
                this.getFuturePriceList.splice(0, 1);
                
                this.getFuturePriceList.push({
                    'startDate': `${this.nextChangeoverDay(this.getFuturePriceList[this.getFuturePriceList.length - 1]['startDate']).toISOString().slice(0, 10)}`,
                    'price': this.generatePrice(`${this.nextChangeoverDay(this.getFuturePriceList[this.getFuturePriceList.length - 1]['startDate']).toISOString().slice(0, 10)}`),
                    'price2Weeks': '0.00',
                    'price3Weeks': '0.00',
                    'price4Weeks': '0.00',
                    'booked': false
                })  
            }

            while (new Date(this.getPriceList[this.getPriceList.length - 1]['startDate']) > rangeEndDate) {
                this.getFuturePriceList.unshift(this.getPriceList[this.getPriceList.length - 1]);
                this.getFuturePriceList.pop();
                this.getPriceList.pop();
            }
            
            let futureRangeStartDate = new Date(this.getFuturePriceList[0]['startDate']);
            let futureRangeEndDate = futureRangeStartDate;
            futureRangeEndDate.setDate(rangeStartDate.getDate() + 7 * +this.getPriceListSettings['futurePricesRange']);

            while (new Date(this.getFuturePriceList[this.getFuturePriceList.length - 1]['startDate']) < futureRangeEndDate) {
                this.getFuturePriceList.push({
                    'startDate': `${this.nextChangeoverDay(this.getFuturePriceList[this.getFuturePriceList.length - 1]['startDate']).toISOString().slice(0, 10)}`,
                    'price': this.generatePrice(`${this.nextChangeoverDay(this.getFuturePriceList[this.getFuturePriceList.length - 1]['startDate']).toISOString().slice(0, 10)}`),
                    'price2Weeks': '0.00',
                    'price3Weeks': '0.00',
                    'price4Weeks': '0.00',
                    'booked': false
                })
            }

            while (new Date(this.getFuturePriceList[this.getFuturePriceList.length - 1]['startDate']) > futureRangeEndDate) {
                this.getFuturePriceList.pop();
            }
            this.applyDiscounts();
        },
        nextChangeoverDay(dateString, weekOffset=0) {
            let date = new Date(dateString);
            if (date.getDay() === +this.getPriceListSettings['defaultChangeoverDay']) {
                weekOffset++;
            }
            date.setDate((date.getDate() + weekOffset * 7) + (+this.getPriceListSettings['defaultChangeoverDay'] + (7 - date.getDay())) % 7);
            return(date);
        },
        generatePrice(dateString) {
            const previousYear = new Date(new Date(dateString).setFullYear(new Date(dateString).getFullYear() - 1));
            this.refreshPriceList();
            this.refreshFuturePriceList();
            for (let i = 0; i < this.getPriceList.length; i++) {
                if (new Date(this.getPriceList[i]['startDate']) === previousYear) {
                    return (this.getPriceList[i]['price']);
                }
                else if (new Date(this.getPriceList[i]['startDate']) > previousYear) {
                    if (i === 0) {
                        return (0);
                    }
                    const forwardDateDifference = Math.abs((new Date(this.getPriceList[i]['startDate']) - previousYear));
                    const backwardDateDifference = Math.abs((new Date(this.getPriceList[i-1]['startDate']) - previousYear));
                    if (forwardDateDifference >= backwardDateDifference) {
                        return (this.getPriceList[i-1]['price']);
                    }
                    else {
                        return (this.getPriceList[i]['price']);
                    }
                }
            }
        }
    },
    delimiters: ['<%', '%>']
})
