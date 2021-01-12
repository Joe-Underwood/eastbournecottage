const vm = new Vue({
    el: '#root',
    data: {
        priceList: null,
        priceListSettings: null,
        bookings: null,
        customers: null,
        cardSelect: false,
        cardSelection: []
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
        this.getBookings();
        this.getCustomers();
        this.getPriceListSettings();
    },
    methods: {
        getPriceList() {
            const response =
                fetch('/get_price_list', { method: 'post' })
                    .then(response => {
                        return response.json();
                    })
                    .then(json => {
                        this.priceList = json['priceList'];
                        return json['priceList'];
                    })
                    .then((data) => {
                        const obj = this.clone(data);
                        for (let i = 0; i < this.priceList.length; i++) {
                            this.$watch(function() {
                                return this.priceList[i];
                            },
                            function() {
                                if (this.isDeepEqual(this.priceList[i], obj[i])) {
                                    this.priceList[i]['updateFlag'] = false;
                                }
                                else {
                                    this.priceList[i]['updateFlag'] = true;
                                }
                            },
                            { deep: true })
                        }
                    })
            
            return response;
        },
        getPriceListSettings() {
            fetch('/get_price_list_settings', { method: 'post' })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    this.priceListSettings = json['priceListSettings'];
                    return json['priceListSettings'];
                })
                .then((data) => {
                    const obj = this.clone(data);
                    this.$watch('priceListSettings',
                    function() {
                        if (this.isDeepEqual(this.priceListSettings, obj)) {
                            this.priceListSettings['updateFlag'] = false;
                        }
                        else {
                            this.priceListSettings['updateFlag'] = true;
                        }
                    },
                    { deep: true })
                })
        },
        getBookings() {
            const response = 
                fetch('/get_bookings', { method: 'post' })
                    .then(response => {
                        return response.json();
                    })
                    .then(json => {
                        this.bookings = json['bookings'];
                        return json['bookings'];
                    })

            return response;
        },
        getCustomers() {
            const response = 
                fetch('/get_customers', { method: 'post' })
                    .then(response => {
                        return response.json();
                    })
                    .then(json => {
                        this.customers = json['customers'];
                        return json['customers'];
                    })

            return response;
        },
        refreshPriceList() {
            this.priceList.sort((a, b) => new Date(a['startDate']) - new Date(b['startDate']));
        },
        setPriceList() {
            this.refreshPriceList();
            const response = 
                fetch('/set_price_list', {
                    method: 'post',
                    body: JSON.stringify(this.priceList),
                    headers: new Headers({
                        'content-type': 'application/json'
                    })
                })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    return json['success'];
                })

            return response;
        },
        addPriceListSegment() {
            this.priceList.push({
                'id': null,
                'startDate': null,
                'price': 0,
                'price2Weeks': 0,
                'price3Weeks': 0,
                'price4Weeks': 0,
                'bookingId': null,
                'isPast': false,
                'isActive': false,
                'isFuture': false,
                'updateFlag': true,
                'deleteFlag': false
            })
            const lastSegment = this.priceList[this.priceList.length - 1];
            this.$watch(function() {
                return lastSegment;
            },
            function() {
                //place in correct range (isPast. isActive, isFuture)
                const year = lastSegment['startDate'].substr(0, 4);
                const month = lastSegment['startDate'].substr(5, 2);
                const date = lastSegment['startDate'].substr(8, 2);
                const startDate = new Date(year, month - 1, date);
            },
            { deep: true })
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
            const response =
                fetch('/set_bookings', {
                    method: 'post',
                    body: JSON.stringify(this.bookings),
                    headers: new Headers({
                        'content-type': 'application/json'
                    })
                })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    return json['success'];
                })

            return response;
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
                'deleteFlag': false
            })
        },
        setCustomers() {
            const response = fetch('/set_customers', {
                method: 'post',
                body: JSON.stringify(this.customers),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            })
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    return json['success'];
                })

            return response;
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
                'updateFlag': true,
                'deleteFlag': false
            })
        },
        goToPriceList() {
            document.querySelector('.price-list').classList.remove('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.add('hidden');
            this.cardSelectOff();
        },
        goToBookings() {
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.remove('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.add('hidden');
            this.cardSelectOff();
        },
        goToCustomers() {
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.remove('hidden');
            document.querySelector('.settings').classList.add('hidden');
            this.cardSelectOff();
        },
        goToSettings() {
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.remove('hidden');
            this.cardSelectOff();
        },
        bookingUpdate(booking) {
            booking['updateFlag'] = true;
            this.setBookings();
        },
        bookingDelete(booking, e) {
            booking['deleteFlag'] = true;
            this.setBookings().then(success => {
                if (success) {
                    this.exitFullscreen(e);
                }
                else {
                    console.log('error updating bookings');
                }
                return success;
            })
            .then(success => {
                if (success) {
                    this.getPriceList();
                    this.getBookings();
                    this.getCustomers();
                }
            })
            //if successful, delete from view/ refresh to show change
        },
        customerUpdate(customer) {
            customer['updateFlag'] = true;
            this.setCustomers();
        },
        customerDelete(customer, e) {
            customer['deleteFlag'] = true;
            this.setCustomers().then(success => {
                if (success) {
                    this.exitFullscreen(e);
                } else {
                    console.log('error updating customers');
                }
                return success;
            })
            .then(success => {
                if (success) {
                    this.getPriceList();
                    this.getBookings();
                    this.getCustomers();
                }
            })
            //if successful, delete from view/ refresh to show change
        },
        /*
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
        },*/
        isDeepEqual(obj1, obj2) {
            //assumes same object type
            if (Object.keys(obj1).length !== Object.keys(obj2).length) {
                return false;
            }
            for (key in obj1) {
                if (obj1[key] !== obj2[key]) {
                    return false;
                }
            }
            return true;
        },
        clone(obj){
            if(obj == null || typeof(obj) != 'object')
                return obj;
        
            var temp = new obj.constructor(); 
            for(var key in obj)
                temp[key] = this.clone(obj[key]);
        
            return temp;
        },
        customerName(id) {
            if (id) {
                const customer = this.customers.find(customer => {
                    return(customer.id === id);
                });
                return `${customer['firstName']} ${customer['lastName']}`;
            }
            else {
                return 'No customer';
            }
        },
        cardSelectOn() {
            this.cardSelect = true;
        },
        cardSelectOff() {
            this.cardSelect = false;
            for (let i = 0; i < this.cardSelection.length; i++) {
                this.cardSelection[i]['selectFlag'] = false;
            }
            this.cardSelection = [];
        },
        cardClick(obj, e) {
            if (this.cardSelect) {
                if (obj['selectFlag']) {
                    this.cardSelection.splice(this.cardSelection.indexOf(obj), 1);
                    obj['selectFlag'] = false;
                } 
                else {
                    this.cardSelection.push(obj);
                    obj['selectFlag'] = true;
                }
            }
            else {
                this.goFullscreen(e);
            }
        },
        bookingSelectionDelete() {
            //prompt for user confirmation before deletion
            for (let i = 0; i < this.cardSelection.length; i++) {
                this.cardSelection[i]['deleteFlag'] = true;
            }
            this.setBookings().then(success => {
                if (success) {
                    this.getPriceList();
                    this.getBookings();
                    this.getCustomers();
                }
                else {
                    console.log('failed to delete bookings');
                }
            })
            this.cardSelectOff();
        },
        customerSelectionDelete() {
            //prompt for user confirmation before deletion
            for (let i = 0; i < this.cardSelection.length; i++) {
                this.cardSelection[i]['deleteFlag'] = true;
            }
            this.setCustomers().then(success => {
                if (success) {
                    this.getPriceList();
                    this.getBookings();
                    this.getCustomers();
                }
                else {
                    console.log('failed to delete customers');
                }
            })
            this.cardSelectOff();
        },
        goFullscreen(e) {
            function cardLevelElement(el) {
                if (el.classList.contains('card')) {
                    return el;
                } else {
                    return cardLevelElement(el.parentElement);
                }
            }

            const cardElement = cardLevelElement(e.target);
            const pageElement = cardElement.previousElementSibling;

            document.querySelector('#root').classList.add('fullscreen');

            cardElement.style.display = 'none';
            pageElement.style.display = 'block';

        },
        exitFullscreen(e) {
            function pageLevelElement(el) {
                if (el.classList.contains('page')) {
                    return el;
                } else {
                    return pageLevelElement(el.parentElement);
                }
            }
            
            const pageElement = pageLevelElement(e.target);
            const cardElement = pageElement.nextElementSibling;

            document.querySelector('#root').classList.remove('fullscreen');

            pageElement.style.display = 'none';
            cardElement.style.display = 'grid';
        }
        //adjustRanges IS BUGGED, WILL CAUSE VUE INSTANCE TO NOT RENDER ON MOBILE DEVEICES ---- NEEDS INVESTIGATION (probably should be a server side function)
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