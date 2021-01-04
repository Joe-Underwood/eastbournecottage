const vm = new Vue({
    el: '#root',
    data: {
        priceList: null,
        priceListSettings: null,
        bookings: null,
        customers: null,
    },
    computed: {
        activePriceList: function() {
            if (this.priceList) {
                return (this.priceList.filter(segment => segment['isActive']));
            }
            else {
                return null;
            }
        },
        futurePriceList: function() {
            if (this.priceList) {
                return (this.priceList.filter(segment => segment['isFuture']));
            }
            else {
                return null;
            }
        },
        pastPriceList: function () {
            if (this.priceList) {
                return (this.priceList.filter(segment => segment['isPast']));
            }
            else {
                return null;
            }
        },
        newPriceList: function() {
            if (this.priceList) {
                return (this.priceList.filter(segment => !segment['id']));
            }
            else {
                return null;
            }
        }
    },
    created: function() {
        this.getPriceList();
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
                            //sort properly in pricelist 
                            //attach correct flags isActive, isFuture, etc.
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
        addPriceListSegment() {
            this.priceList.push({
                'id': null,
                'startDate': null,
                'price': null,
                'price2Weeks': null,
                'price3Weeks': null,
                'price4Weeks': null,
                'bookingId': null,
                'isPast': false,
                'isActive': false,
                'isFuture': false,
                'updateFlag': true,
                'removeFlag': false
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
            for (segment in this.priceList) {
                if (segment['isActive']) {
                    try {
                        this.activePriceList[segment]['price2Weeks'] = `${ (((+this.activePriceList[segment]['price'] + +this.activePriceList[+segment + 1]['price']) * ((100 - +this.priceListSettings['discount2Weeks']) / 100))).toFixed(2) }`;
                    }
                    catch {
                        this.activePriceList[segment]['price2Weeks'] = '0';
                    }
                    try {
                        this.activePriceList[segment]['price3Weeks'] = `${ (((+this.activePriceList[segment]['price'] + +this.activePriceList[+segment + 1]['price'] + +this.activePriceList[+segment + 2]['price']) * ((100 - +this.priceListSettings['discount3Weeks']) / 100))).toFixed(2) }`;
                    }    
                    catch {
                        this.activePriceList[segment]['price3Weeks'] = '0';
                    }
                    try {
                        this.activePriceList[segment]['price4Weeks'] = `${ (((+this.activePriceList[segment]['price'] + +this.activePriceList[+segment + 1]['price'] + +this.activePriceList[+segment + 2]['price'] + +this.activePriceList[+segment + 3]['price']) * ((100 - +this.priceListSettings['discount4Weeks']) / 100))).toFixed(2) }`;
                    }
                    catch {
                        this.activePriceList[segment]['price4Weeks'] = '0';
                    }
                }
                else if (segment['isFuture']) {
                    try {
                        this.futurePriceList[segment]['price2Weeks'] = `${ (((+this.futurePriceList[segment]['price'] + +this.futurePriceList[+segment + 1]['price']) * ((100 - +this.priceListSettings['discount2Weeks']) / 100))).toFixed(2) }`;
                    }
                    catch {
                        this.futurePriceList[segment]['price2Weeks'] = '0';
                    }
                    try {
                        this.futurePriceList[segment]['price3Weeks'] = `${ (((+this.futurePriceList[segment]['price'] + +this.futurePriceList[+segment + 1]['price'] + +this.futurePriceList[+segment + 2]['price']) * ((100 - +this.priceListSettings['discount3Weeks']) / 100))).toFixed(2) }`;
                    }    
                    catch {
                        this.futurePriceList[segment]['price3Weeks'] = '0';
                    }
                    try {
                        this.futurePriceList[segment]['price4Weeks'] = `${ (((+this.futurePriceList[segment]['price'] + +this.futurePriceList[+segment + 1]['price'] + +this.futurePriceList[+segment + 2]['price'] + +this.futurePriceList[+segment + 3]['price']) * ((100 - +this.priceListSettings['discount4Weeks']) / 100))).toFixed(2) }`;
                    }
                    catch {
                        this.futurePriceList[segment]['price4Weeks'] = '0';
                    }
                }
            }
        },
        /*adjustRanges() {
            this.refreshPriceList();
            let rangeStartDate = new Date(this.activePriceList[0]['startDate']);
            let rangeEndDate = rangeStartDate;
            rangeEndDate.setDate(rangeStartDate.getDate() + 7 * +this.priceListSettings['activePricesRange']);

            while (new Date(this.activePriceList[this.activePriceList.length - 1]['startDate']) < rangeEndDate) {
                this.activePriceList.push(this.futurePriceList[0]);
                this.futurePriceList.splice(0, 1);
                
                this.futurePriceList.push({
                    'startDate': `${this.nextChangeoverDay(this.futurePriceList[this.futurePriceList.length - 1]['startDate']).toISOString().slice(0, 10)}`,
                    'price': this.generatePrice(`${this.nextChangeoverDay(this.futurePriceList[this.futurePriceList.length - 1]['startDate']).toISOString().slice(0, 10)}`),
                    'price2Weeks': '0.00',
                    'price3Weeks': '0.00',
                    'price4Weeks': '0.00',
                    'booked': false
                })  
            }

            while (new Date(this.activePriceList[this.activePriceList.length - 1]['startDate']) > rangeEndDate) {
                this.futurePriceList.unshift(this.activePriceList[this.activePriceList.length - 1]);
                this.futurePriceList.pop();
                this.activePriceList.pop();
            }
            
            let futureRangeStartDate = new Date(this.futurePriceList[0]['startDate']);
            let futureRangeEndDate = futureRangeStartDate;
            futureRangeEndDate.setDate(rangeStartDate.getDate() + 7 * +this.getPriceListSettings['futurePricesRange']);

            while (new Date(this.futurePriceList[this.futurePriceList.length - 1]['startDate']) < futureRangeEndDate) {
                this.futurePriceList.push({
                    'startDate': `${this.nextChangeoverDay(this.futurePriceList[this.futurePriceList.length - 1]['startDate']).toISOString().slice(0, 10)}`,
                    'price': this.generatePrice(`${this.nextChangeoverDay(this.futurePriceList[this.futurePriceList.length - 1]['startDate']).toISOString().slice(0, 10)}`),
                    'price2Weeks': '0.00',
                    'price3Weeks': '0.00',
                    'price4Weeks': '0.00',
                    'booked': false
                })
            }

            while (new Date(this.futurePriceList[this.futurePriceList.length - 1]['startDate']) > futureRangeEndDate) {
                this.futurePriceList.pop();
            }
            this.applyDiscounts();
        },
        nextChangeoverDay(dateString, weekOffset=0) {
            let date = new Date(dateString);
            if (date.getDay() === +this.priceListSettings['defaultChangeoverDay']) {
                weekOffset++;
            }
            date.setDate((date.getDate() + weekOffset * 7) + (+this.priceListSettings['defaultChangeoverDay'] + (7 - date.getDay())) % 7);
            return(date);
        },
        generatePrice(dateString) {
            const previousYear = new Date(new Date(dateString).setFullYear(new Date(dateString).getFullYear() - 1));
            this.refreshActivePriceList();
            this.refreshFuturePriceList();
            for (let i = 0; i < this.activePriceList.length; i++) {
                if (new Date(this.activePriceList[i]['startDate']) === previousYear) {
                    return (this.activePriceList[i]['price']);
                }
                else if (new Date(this.activePriceList[i]['startDate']) > previousYear) {
                    if (i === 0) {
                        return (0);
                    }
                    const forwardDateDifference = Math.abs((new Date(this.activePriceList[i]['startDate']) - previousYear));
                    const backwardDateDifference = Math.abs((new Date(this.activePriceList[i-1]['startDate']) - previousYear));
                    if (forwardDateDifference >= backwardDateDifference) {
                        return (this.activePriceList[i-1]['price']);
                    }
                    else {
                        return (this.activePriceList[i]['price']);
                    }
                }
            }
        }*/
    },
    delimiters: ['<%', '%>']
})
