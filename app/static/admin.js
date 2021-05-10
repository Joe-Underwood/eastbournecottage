const vm = new Vue({
    el: '#root',
    data: {
        priceList: null,
        priceListSettings: null,
        bookings: null,
        customers: null,
        billings: null,
        billingSettings: null,

        serverDate: null,
        priceListMonthView: true,
        rangeMonths: null,
        cardSelect: false,
        cardSelection: [],

        paymentBreakpointSelect: false,
        paymentBreakpointSelection: [],

        cancellationBreakpointSelect: false,
        cancellationBreakpointSelection: [],

        monthSwiper: null,
        monthTabGlider: null,
        monthTabsRefresh: false,
        priceTableSwiperList: [],


        billingTableSwiper: null,

        newBillingScrimClose: false,
        initialY: undefined,
        offsetY: undefined,

        disableBodyScroll: undefined,
        enableBodyScroll: undefined,

        newBillingFormData: {
            'id': null,
            'bookingId': null,
            'amount': null,
            'date': null,
            'invoiceDueDate': null,
            'transactionType': null,
            'reference': null,
            'note': null
        }


    },
    computed: {
        /*activePriceList: function() {
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
        },*/
    },
    created: function() {
        this.disableBodyScroll = bodyScrollLock.disableBodyScroll;
        this.enableBodyScroll = bodyScrollLock.enableBodyScroll;
        this.getPriceList();
        this.getBookings();
        this.getCustomers();
        this.getBillings();
        this.getBillingSettings();
        this.getPriceListSettings()
            .then(() => {
                return this.getServerDate();
            })
            .then((serverDate) => {
                this.addRangeMonths(serverDate);
                this.priceListMonth = this.rangeMonths[0];
            })
            .then(() => {
                this.initMonthSwiper();
                this.$nextTick(function() {
                    document.querySelector('.tab').classList.add('current-month-tab');
                    this.initMonthTabGlider();
                    this.initPriceTableSwipers();
                })
            })
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
            const response = 
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

            return response;
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
        getBillings() {
            const response =
                fetch('/get_billings', { method: 'post' })
                    .then(response => {
                        return response.json();
                    })
                    .then(json => {
                        this.billings = json['billings'];
                        return json['billings'];
                    })

            return response;
        },
        setBillings() {
            const response = 
                fetch('/set_billings', {
                    method: 'post',
                    body: JSON.stringify(this.billings),
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
        getBillingSettings() {
            const response =
                fetch('/get_billing_settings', { method: 'post' })
                    .then(response => {
                        return response.json();
                    })
                    .then(json => {
                        this.billingSettings = json['billingSettings'];
                        return json['billingSettings'];
                    })
                    .then(data => {
                        this.refreshPaymentBreakpoints();
                        this.refreshCancellationBreakpoints();
                        return data;
                    })
                    .then(data => {
                        this.$watch('billingSettings', 
                        function() {
                            this.billingSettings['updateFlag'] = true;
                        },
                        { deep: true })
                        return data;
                    })

            return response;
        },
        setBillingSettings() {
            this.refreshPaymentBreakpoints();
            this.refreshCancellationBreakpoints();
            if (this.billingSettings['updateFlag']) {
                const response = 
                    fetch('/set_billing_settings', {
                        method: 'post',
                        body: JSON.stringify(this.billingSettings),
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

                if (response) {
                    this.billingSettings['updateFlag'] = false;
                }

                return response;
            }
        },
        refreshPaymentBreakpoints() {
            this.billingSettings['paymentBreakpoints'].sort(function(a, b) {
                if (a['firstPayment']) {
                    return -1;
                }
                else if (b['firstPayment']) {
                    return 1;
                }
                else {
                    return b['dueBy'] - a['dueBy'];
                }
            })

            for (let i = 0; i < this.billingSettings['paymentBreakpoints'].length; i++) {
                if (this.billingSettings['paymentBreakpoints'][i]['deleteFlag']) {
                    this.billingSettings['paymentBreakpoints'][i]['amountDue'] = 0;
                }
                if (i === 0) {
                    this.billingSettings['paymentBreakpoints'][i]['cumulativeTotal'] = parseInt(this.billingSettings['paymentBreakpoints'][i]['amountDue']);
                }
                else {
                    this.billingSettings['paymentBreakpoints'][i]['cumulativeTotal'] = parseInt(this.billingSettings['paymentBreakpoints'][i-1]['cumulativeTotal']) + parseInt(this.billingSettings['paymentBreakpoints'][i]['amountDue']);
                }
            }
        },
        refreshCancellationBreakpoints() {
            this.billingSettings['cancellationBreakpoints'].sort((a, b) => b['cancelBy'] - a['cancelBy']);
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
        getServerDate() {
            const response = 
                fetch('/get_server_date', { method: 'post' })
                    .then(response => {
                        return response.json();
                    })
                    .then(json => {
                        const year = json['serverDate'].substr(0, 4);
                        const month = json['serverDate'].substr(5, 2);
                        const date = json['serverDate'].substr(8, 2);
                        const serverDate = new Date(year, month - 1, date);

                        this.serverDate = serverDate;
                        return serverDate;
                    })
                
            return response;
        },
        addRangeMonths(startDate) {
            //expects startDate is a date object, returns array of date objects, one for each month including and between current date and end of future price list range
            let rangeEndDate = new Date(+startDate);
            rangeEndDate.setDate(startDate.getDate() + 7 * (this.priceListSettings['activePricesRange'] + this.priceListSettings['futurePricesRange']));

            const rangeMonths = [];
            const monthAmount = ((rangeEndDate.getMonth() + 1) - (startDate.getMonth() + 1)) + 1 + (12 * (rangeEndDate.getFullYear() - startDate.getFullYear()));
            
            for (let i = 0; i < monthAmount; i++) {
                let month = new Date(startDate.getFullYear(), startDate.getMonth() + i);
                rangeMonths.push(month);
            }

            this.rangeMonths = rangeMonths;
        },
        addPriceListSegment() {
            this.priceList.push({
                'id': null,
                'startDate': null,
                'price': 0,
                'price2Weeks': 0,
                'price3Weeks': 0,
                'price4Weeks': 0,
                'discountAmount2Weeks': 0,
                'discountAmount3Weeks': 0,
                'discountAmount4Weeks': 0,
                'bookingId': null,
                'rangeType': null,
                'lockFlag': false,
                'updateFlag': true,
                'deleteFlag': false
            })
            const lastSegment = this.priceList[this.priceList.length - 1];
            /*this.$watch(function() {
                return lastSegment;
            },
            function() {
                //place in correct range (isPast. isActive, isFuture)
                const year = lastSegment['startDate'].substr(0, 4);
                const month = lastSegment['startDate'].substr(5, 2);
                const date = lastSegment['startDate'].substr(8, 2);
                const startDate = new Date(year, month - 1, date);
            },
            { deep: true })*/
        },
        setPriceListSettings() {
            const response = 
                fetch('/set_price_list_settings', {
                    method: 'post',
                    body: JSON.stringify(this.priceListSettings),
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
        initMonthSwiper() {
            const monthSwiper = new Swiper('.month-swiper', {
                spaceBetween: 16,
                slidesPerView: 1,
                allowTouchMove: false,
                on: {
                    slideChange: function() {
                        document.querySelectorAll('.tab').forEach(tab => {
                            tab.classList.remove('current-month-tab');
                        })
                        document.querySelectorAll('.tab')[this.activeIndex].classList.add('current-month-tab');
                        vm.monthTabGlider.scrollItem(this.activeIndex);
                    }
                }
            });  

            this.monthSwiper = monthSwiper;
        },
        initMonthTabGlider() {
            const monthTabGlider = new Glider(document.querySelector('.month-tabs'), {
                slidesToShow: 4,
                duration: 2,
                scrollLock: true
            })

            this.monthTabGlider = monthTabGlider;
        },
        initPriceTableSwipers() {
            const swiperNodeList = document.querySelectorAll('.price-table-swiper');
            const priceTableSwiperList = [];
            for (node in swiperNodeList) {
                priceTableSwiperList.push(new Swiper(swiperNodeList[node], {
                    spaceBetween: 0,
                    slidesPerView: 1,
                    allowTouchMove: true,
                    pagination: {
                        el: document.querySelectorAll('.swiper-pagination')[node],
                        type: 'bullets'
                    },
                    breakpoints: {
                        478: {
                            slidesPerView: 2,
                            allowTouchMove: true
                        },
                        638: {
                            slidesPerView: 3,
                            allowTouchMove: true
                        },
                        798: {
                            slidesPerView: 4,
                            allowTouchMove: false
                        }
                    }
                    
                }))
            }

            this.priceTableSwiperList = priceTableSwiperList;
        },
        initBillingTableSwiper() {
            const billingTableSwiper = new Swiper('.billing-table-swiper', {
                spaceBetween: 0,
                slidesPerView: 1,
                allowTouchMove: true,
                pagination: {
                    el: document.querySelector('.billing-table-swiper .swiper-pagination'),
                    type: 'bullets'
                },
                breakpoints: {
                    422: {
                        slidesPerView: 2,
                        allowTouchMove: true
                    },
                    582: {
                        slidesPerView: 3,
                        allowTouchMove: true
                    },
                    712: {
                        slidesPerView: 4,
                        allowTouchMove: true
                    },
                    872: {
                        slidesPerView: 5,
                        allowTouchMove: true
                    },
                    932: {
                        slidesPerView: 6,
                        allowTouchMove: true
                    },
                    1092: {
                        slidesPerView: 7,
                        allowTouchMove: false
                    }
                }
            })

            this.billingTableSwiper = billingTableSwiper;
            
        },
        segmentMonthFilter(segment, month, index) {
            if (index === this.rangeMonths.length - 1) {
                return (month <= new Date(segment['startDate']));
            } 
            else {
                return (month <= new Date(segment['startDate']) && new Date(segment['startDate']) <= this.rangeMonths[index + 1]);
            }
        },
        goToPriceList() {
            document.querySelector('.price-list').classList.remove('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.add('hidden');
            document.querySelector('.billing').classList.add('hidden');
            document.querySelector('.tabs').classList.remove('hidden');
            document.querySelector('.billing-settings').classList.add('hidden');
            this.priceListSelectOff();
            if (!this.monthTabGlider) {
                this.monthTabsRefresh = false;
                this.$forceUpdate();
                this.initMonthSwiper();
                this.$nextTick(function() {
                    this.initMonthTabGlider();
                    this.$forceUpdate();
                });
            }
        },
        openPriceListSettings() {
            if (this.monthTabGlider) {
                this.monthTabGlider.destroy();
                this.monthTabGlider = null;
                this.monthTabsRefresh = true;
            }
            document.querySelector('.tabs').classList.add('hidden');
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.remove('hidden');
            document.querySelector('.billing').classList.add('hidden');
            document.querySelector('.billing-settings').classList.add('hidden');
        },
        segmentToggleExpand(e) {
            function segmentNode(node) {
                if (node.classList.contains('price-list-segment')) {
                    return node;
                }
                else {
                    return segmentNode(node.parentElement);
                }
            }

            const segmentEl = segmentNode(e.target);
            const segmentIndex = Array.from(document.querySelectorAll('.price-list-segment')).indexOf(segmentEl);

            segmentEl.classList.toggle('expand');
            document.querySelectorAll('.segment-card')[segmentIndex].classList.toggle('hidden');
            document.querySelectorAll('.segment-expand')[segmentIndex].classList.toggle('hidden');
        },
        goToBookings() {
            document.querySelector('.tabs').classList.remove('hidden');
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.remove('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.add('hidden');
            document.querySelector('.billing').classList.add('hidden');
            document.querySelector('.billing-settings').classList.add('hidden');
            this.bookingCardSelectOff();
        },
        goToCustomers() {
            document.querySelector('.tabs').classList.remove('hidden');
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.remove('hidden');
            document.querySelector('.settings').classList.add('hidden');
            document.querySelector('.billing').classList.add('hidden');
            document.querySelector('.billing-settings').classList.add('hidden');
            this.customerCardSelectOff();
        },
        goToBilling() {
            document.querySelector('.tabs').classList.remove('hidden');
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.add('hidden');
            document.querySelector('.billing').classList.remove('hidden');
            document.querySelector('.billing-settings').classList.add('hidden');
            this.customerCardSelectOff();
            if (!this.billingTableSwiper) {
                this.initBillingTableSwiper();
            }
        },
        goToBillingSettings() {
            document.querySelector('.tabs').classList.add('hidden');
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.add('hidden');
            document.querySelector('.billing').classList.add('hidden');
            document.querySelector('.billing-settings').classList.remove('hidden');
            this.customerCardSelectOff();
        },
        priceListSettingsUpdate() {
            this.setPriceListSettings()
                .then(() => {
                    this.getPriceList();
                })
        },
        bookingUpdate(booking, e) {
            booking['updateFlag'] = true;
            this.setBookings();
            //prompt result, with(out) closing page
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
        customerUpdate(customer, e) {
            customer['updateFlag'] = true;
            this.setCustomers();
            //prompt result, with(out) closing page
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
        clone(obj) {
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
        priceListSelectOn() {
            this.cardSelect = true;

            document.querySelector('.price-list .cards-add').classList.add('hidden');
            document.querySelector('.price-list .cards-select').classList.add('hidden');
            document.querySelector('.price-list .cards-cancel').classList.remove('hidden');
            document.querySelector('.price-list .cards-delete').classList.remove('hidden');
        },
        priceListSelectOff() {
            this.cardSelect = false;
            for (let i = 0; i < this.cardSelection.length; i++) {
                this.cardSelection[i]['selectFlag'] = false;
            }
            this.cardSelection = [];

            document.querySelector('.price-list .cards-add').classList.remove('hidden');
            document.querySelector('.price-list .cards-select').classList.remove('hidden');
            document.querySelector('.price-list .cards-cancel').classList.add('hidden');
            document.querySelector('.price-list .cards-delete').classList.add('hidden');
        },
        bookingCardSelectOn() {
            this.cardSelect = true;

            document.querySelector('.bookings .cards-add').classList.add('hidden');
            document.querySelector('.bookings .cards-select').classList.add('hidden');
            document.querySelector('.bookings .cards-cancel').classList.remove('hidden');
            document.querySelector('.bookings .cards-delete').classList.remove('hidden');
        },
        bookingCardSelectOff() {
            this.cardSelect = false;
            for (let i = 0; i < this.cardSelection.length; i++) {
                this.cardSelection[i]['selectFlag'] = false;
            }
            this.cardSelection = [];

            document.querySelector('.bookings .cards-add').classList.remove('hidden');
            document.querySelector('.bookings .cards-select').classList.remove('hidden');
            document.querySelector('.bookings .cards-cancel').classList.add('hidden');
            document.querySelector('.bookings .cards-delete').classList.add('hidden');
        },
        customerCardSelectOn() {
            this.cardSelect = true;

            document.querySelector('.customers .cards-add').classList.add('hidden');
            document.querySelector('.customers .cards-select').classList.add('hidden');
            document.querySelector('.customers .cards-cancel').classList.remove('hidden');
            document.querySelector('.customers .cards-delete').classList.remove('hidden');
        },
        customerCardSelectOff() {
            this.cardSelect = false;
            for (let i = 0; i < this.cardSelection.length; i++) {
                this.cardSelection[i]['selectFlag'] = false;
            }
            this.cardSelection = [];

            document.querySelector('.customers .cards-add').classList.remove('hidden');
            document.querySelector('.customers .cards-select').classList.remove('hidden');
            document.querySelector('.customers .cards-cancel').classList.add('hidden');
            document.querySelector('.customers .cards-delete').classList.add('hidden');
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
        segmentSelect(segment, e) {
            if (this.cardSelect) {
                if (segment['selectFlag']) {
                    segment['selectFlag'] = false;
                    this.cardSelection.splice(this.cardSelection.indexOf(segment), 1);
                } else {
                    segment['selectFlag'] = true;
                    this.cardSelection.push(segment)
                }
            }
        },
        priceListSelectionDelete() {
            //prompt for user confirmation before deletion
            for (let i = 0; i < this.cardSelection.length; i++) {
                this.cardSelection[i]['deleteFlag'] = true;
            }
            this.setPriceList().then(success => {
                if (success) {
                    this.getPriceList();
                    this.getBookings();
                    this.getCustomers();
                }
                else {
                    console.log('failed to delete bookings');
                }
            })
            this.priceListSelectOff();
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
            this.bookingCardSelectOff();
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
            this.customerCardSelectOff();
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
            const transitionElement = cardElement.nextElementSibling;
            const cardRect = cardElement.getBoundingClientRect();
            const pageRect = pageElement.getBoundingClientRect();

            document.querySelector('#root').classList.add('fullscreen');

            cardElement.classList.add('invisible');
            /*transitionElement.classList.remove('hidden');
            transitionElement.style.top = `${cardRect.top}px`;
            transitionElement.style.right = `${cardRect.right}px`;
            transitionElement.style.bottom = `${cardRect.bottom}px`;
            transitionElement.style.left = `${cardRect.left}px`;*/

            pageElement.classList.remove('hidden');

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

            pageElement.classList.add('hidden');
            cardElement.classList.remove('invisible');
        },
        adultsDecrease(booking, e) {
            e.preventDefault();
            if(booking['adults'] > 0) {
                booking['adults']--;
            }
        },
        adultsIncrease(booking, e) {
            e.preventDefault();
            if (booking['adults'] + booking['children'] < this.priceListSettings['maxGuests']) {
                booking['adults']++;
            }
        },
        childrenDecrease(booking, e) {
            e.preventDefault();
            if (booking['children'] > 0) {
                booking['children']--;
            }
        },
        childrenIncrease(booking, e) {
            e.preventDefault();
            if (booking['adults'] + booking['children'] < this.priceListSettings['maxGuests']) {
                booking['children']++;
            }
        },
        infantsDecrease(booking, e) {
            e.preventDefault();
            if (booking['infants'] > 0) {
                booking['infants']--;
            }
        },
        infantsIncrease(booking, e) {
            e.preventDefault();
            if (booking['infants'] < this.priceListSettings['maxInfants']) {
                booking['infants']++;
            }
        },
        dogsDecrease(booking, e) {
            e.preventDefault();
            if (booking['dogs'] > 0) {
                booking['dogs']--;
            }
        },
        dogsIncrease(booking, e) {
            e.preventDefault();
            if (booking['dogs'] < this.priceListSettings['maxDogs']) {
                booking['dogs']++;
            }
        },
        maxGuestsDecrease(e) {
            e.preventDefault();
            if (this.priceListSettings['maxGuests'] > 0) {
                this.priceListSettings['maxGuests']--;
            }
        },
        maxGuestsIncrease(e) {
            e.preventDefault();
            this.priceListSettings['maxGuests']++;
        },
        maxInfantsDecrease(e) {
            e.preventDefault();
            if (this.priceListSettings['maxInfants'] > 0) {
                this.priceListSettings['maxInfants']--;
            }
        },
        maxInfantsIncrease(e) {
            e.preventDefault();
            this.priceListSettings['maxInfants']++;
        },
        maxDogsDecrease(e) {
            e.preventDefault();
            if (this.priceListSettings['maxDogs'] > 0) {
                this.priceListSettings['maxDogs']--;
            }
        },
        maxDogsIncrease(e) {
            e.preventDefault();
            this.priceListSettings['maxDogs']++;
        },
        addPaymentBreakpoint() {
            this.billingSettings['paymentBreakpoints'].push({
                'id': null,
                'amountDue': null,
                'dueBy': null,
                'firstPayment': false,
                'cumulativeTotal': null,
                'selectFlag': false,
                'deleteFlag': false
            })
            this.billingSettings['updateFlag'] = true
        },
        addCancellationBreakpoint() {
            this.billingSettings['cancellationBreakpoints'].push({
                'id': null,
                'amountRefundable': null,
                'cancelBy': null,
                'checkIn': false,
                'cumulativeTotal': null,
                'selectFlag': false,
                'deleteFlag': false
            })
            this.billingSettings['updateFlag'] = true
        },
        selectPaymentBreakpoint(row, e) {
            if (this.paymentBreakpointSelect) {
                if (row['selectFlag']) {
                    row['selectFlag'] = false;
                    this.paymentBreakpointSelection.splice(this.paymentBreakpointSelection.indexOf(row), 1);
                } else if (!row['firstPayment']) {
                    row['selectFlag'] = true;
                    this.paymentBreakpointSelection.push(row);
                }
            }
        },
        deletePaymentBreakpointSelection() {
            //prompt for user confirmation before deletion

            for (let i = 0; i < this.paymentBreakpointSelection.length; i++) {
                this.paymentBreakpointSelection[i]['deleteFlag'] = true;
                this.paymentBreakpointSelection[i]['amountDue'] = 0;
            }

            this.paymentBreakpointSelectOff();
            this.refreshPaymentBreakpoints();
        },
        paymentBreakpointSelectOn() {
            this.paymentBreakpointSelect = true;

            document.querySelector('.payment-terms-settings .controls-add').classList.add('hidden');
            document.querySelector('.payment-terms-settings .controls-select').classList.add('hidden');
            document.querySelector('.payment-terms-settings .controls-cancel').classList.remove('hidden');
            document.querySelector('.payment-terms-settings .controls-delete').classList.remove('hidden');
        },
        paymentBreakpointSelectOff() {
            this.paymentBreakpointSelect = false;
            for (let i = 0; i < this.paymentBreakpointSelection.length; i++) {
                this.paymentBreakpointSelection[i]['selectFlag'] = false;
            }
            this.paymentBreakpointSelection = [];

            document.querySelector('.payment-terms-settings .controls-add').classList.remove('hidden');
            document.querySelector('.payment-terms-settings .controls-select').classList.remove('hidden');
            document.querySelector('.payment-terms-settings .controls-cancel').classList.add('hidden');
            document.querySelector('.payment-terms-settings .controls-delete').classList.add('hidden');
        },
        selectCancellationBreakpoint(row, e) {
            if (this.cancellationBreakpointSelect) {
                if (row['selectFlag']) {
                    row['selectFlag'] = false;
                    this.cancellationBreakpointSelection.splice(this.cancellationBreakpointSelection.indexOf(row), 1);
                } else if (!row['checkIn']) {
                    row['selectFlag'] = true;
                    this.cancellationBreakpointSelection.push(row);
                }
            }
        },
        deleteCancellationBreakpointSelection() {
            //prompt for user confirmation before deletion
            for (let i = 0; i < this.cancellationBreakpointSelection.length; i++) {
                this.cancellationBreakpointSelection[i]['deleteFlag'] = true;
                this.cancellationBreakpointSelection[i]['amountRefundable'] = 0;
            }
            
            this.cancellationBreakpointSelectOff();
        },
        cancellationBreakpointSelectOn() {
            this.cancellationBreakpointSelect = true;

            document.querySelector('.cancellation-terms-settings .controls-add').classList.add('hidden');
            document.querySelector('.cancellation-terms-settings .controls-select').classList.add('hidden');
            document.querySelector('.cancellation-terms-settings .controls-cancel').classList.remove('hidden');
            document.querySelector('.cancellation-terms-settings .controls-delete').classList.remove('hidden');
        },
        cancellationBreakpointSelectOff() {
            this.cancellationBreakpointSelect = false;
            for (let i = 0; i < this.cancellationBreakpointSelection.length; i++) {
                this.cancellationBreakpointSelection[i]['selectFlag'] = false;
            }
            this.cancellationBreakpointSelection = [];

            document.querySelector('.cancellation-terms-settings .controls-add').classList.remove('hidden');
            document.querySelector('.cancellation-terms-settings .controls-select').classList.remove('hidden');
            document.querySelector('.cancellation-terms-settings .controls-cancel').classList.add('hidden');
            document.querySelector('.cancellation-terms-settings .controls-delete').classList.add('hidden');
        },
        newBillingTouchstart(event) {
            //on touchstart
            if (document.querySelector('.new-billing-container').contains(event.target)) {
                this.initialY = event.touches[0].clientY;
                document.querySelector('.new-billing-container').style.transition = "none"; 
            } else if (document.querySelector('.new-billing-container').classList.contains('open') && event.target === document.querySelector('.new-billing-wrapper')) {
                this.newBillingScrimClose = true;
                this.initialY = document.querySelector('.new-billing-container').offsetTop;
                document.querySelector('.new-billing-container').style.transition = "none"; 
            }
        },
        newBillingTouchmove(event) {
            //on touchmove, slides menu horizontally based on touch position
            if (document.querySelector('.new-billing-wrapper').contains(event.target) && document.querySelector('.new-billing-container').classList.contains('open')) {
                this.newBillingScrimClose = false;
                /*if (!document.querySelector('.navbar').contains(event.target)) {*/
                    this.offsetY = event.touches[0].clientY - this.initialY;
                    if (this.offsetY >= 0) {
                        document.querySelector('.new-billing-container').style.transform = `translate3d(0, ${this.offsetY}px, 0)`;
                    }   
                /*}*/
            }
        },
        newBillingTouchend(event) {
            //on touchend, calls side menu if conditions are met, else keeps side menu open and resets parameters ready for next touch event
            if (this.newBillingScrimClose && document.querySelector('.new-billing-container').classList.contains('open')) {
                document.querySelector('.new-billing-container').style.transition = 'all 0.2s';
                let endX = event.changedTouches[0].clientX;
                let endY = event.changedTouches[0].clientY;
                if (document.elementFromPoint(endX, endY) === document.querySelector('.new-billing-wrapper')) {
                    vm.hideNewBillingOverlay();
                }
                this.newBillingScrimClose = false;
            }
            /*else if (document.querySelector('.party-wrapper').contains(event.target) && document.querySelector('.party-container').classList.contains('open')) {
                document.querySelector('.party-container').style.transition = 'all 0.4s';
                if (this.offsetY > (document.querySelector('.party-container').clientHeight) / 4) {  
                    this.hidePartyOverlay();
                } else {
                    document.querySelector('.party-container').style.transform = `translate3d(0, 0, 0)`;
                }
            }*/
            else if (document.querySelector('.new-billing-wrapper').contains(event.target) && document.querySelector('.new-billing-container').classList.contains('open')) {
                document.querySelector('.new-billing-container').style.transition = 'all 0.2s';
                if (this.offsetY > document.querySelector('.new-billing-container').clientHeight / 4) {
                    this.hideNewBillingOverlay();
                } else {
                    document.querySelector('.new-billing-container').style.transform = 'translate3d(0, 0, 0)';
                }
                
            }
            this.newBillingScrimClose = false;
            this.initialY = undefined;
            this.offsetY = undefined;
        },
        displayNewBillingOverlay() {
            const x = window.matchMedia("(max-width: 735px)");

            if (x.matches) {
                document.querySelector('.new-billing-wrapper').classList.remove('closed');
                document.querySelector('.new-billing-wrapper').classList.add('open');
                document.querySelector('.new-billing-container').classList.add('open');
                document.querySelector('.new-billing-container').style.transform = 'translate3d(0, 0, 0)';
    
                this.disableBodyScroll(document.querySelector('.new-billing-container'));
            } 
            /*
            else {
                document.querySelector('.guests-dropdown').classList.add('open');
                window.addEventListener('click', this.hideGuestsDropdown);
            }*/
            
        },
        hideNewBillingOverlay() {
            closeNewBillingOverlay = true;
            document.querySelector('.new-billing-wrapper').classList.remove('open');
            document.querySelector('.new-billing-container').classList.remove('open');
            document.querySelector('.new-billing-container').style.transform = 'translate3d(0, 100%, 0)';

            document.querySelector('.new-billing-container').ontransitionend = function() {
                if (!document.querySelector('.new-billing-wrapper').classList.contains('open') && closeNewBillingOverlay) {
                    document.querySelector('.new-billing-wrapper').classList.add('closed');
                    closeNewBillingOverlay = false;
                }
            }
            this.enableBodyScroll(document.querySelector('.new-billing-container'));
        },
        createNewBilling() {
            if (this.newBillingFormData['transactionType'] && this.newBillingFormData['date'] && this.newBillingFormData['amount'] && this.newBillingFormData['bookingId']) {
                if (this.newBillingFormData['transactionType'] == 'PAYMENT') {
                    if (this.newBillingFormData['amount'] > 0) {
                        this.newBillingFormData['amount'] *= -1;
                    }
                }
                this.billings.push({
                    'id': null,
                    'bookingId': this.newBillingFormData['bookingId'],
                    'amount': this.newBillingFormData['amount'],
                    'date': this.newBillingFormData['date'],
                    'invoiceDueDate': null,
                    'transactionType': this.newBillingFormData['transactionType'],
                    'reference': null,
                    'note': this.newBillingFormData['note'],
                    'updateFlag': true,
                    'deleteFlag': false
                });
                this.newBillingFormData = {
                    'id': null,
                    'bookingId': null,
                    'amount': null,
                    'date': null,
                    'invoiceDueDate': null,
                    'transactionType': null,
                    'reference': null,
                    'note': null
                }
                this.hideNewBillingOverlay();
            }
        }
        /*
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