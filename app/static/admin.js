const vm = new Vue({
    el: '#root',
    data: {
        priceList: null,
        priceListSettings: null,
        bookings: null,
        customers: null,

        serverDate: null,
        priceListMonthView: true,
        rangeMonths: null,
        cardSelect: false,
        cardSelection: [],

        monthSwiper: null,
        monthTabGlider: null,
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
                'bookingId': null,
                'isPast': false,
                'isActive': false,
                'isFuture': false,
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
            for (node in swiperNodeList) {
                new Swiper(swiperNodeList[node], {
                    spaceBetween: 0,
                    pagination: {
                        el: document.querySelectorAll('.swiper-pagination')[node],
                        type: 'bullets',
                      },
                })
            }
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
            this.priceListSelectOff();
        },
        openPriceListSettings() {
            document.querySelector('.tabs').classList.add('hidden');
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.remove('hidden');
        },
        exitPriceListSettings() {
            document.querySelector('.tabs').classList.add('remove');
            this.goToPriceList();
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
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.remove('hidden');
            document.querySelector('.customers').classList.add('hidden');
            document.querySelector('.settings').classList.add('hidden');
            this.bookingCardSelectOff();
        },
        goToCustomers() {
            document.querySelector('.price-list').classList.add('hidden');
            document.querySelector('.bookings').classList.add('hidden');
            document.querySelector('.customers').classList.remove('hidden');
            document.querySelector('.settings').classList.add('hidden');
            this.customerCardSelectOff();
        },
        priceListSettingsUpdate() {
            this.setPriceListSettings().then(success => {
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
                e.preventDefault();
                e.stopPropagation();
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