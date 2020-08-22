Vue.component('calendar-date', {
    props: ['dateYear', 'dateMonth', 'dateDate'],
    computed: {
        selfDate: function () {
            return new Date(this.dateYear, this.dateMonth, this.dateDate);
        },
        isoDate: function () {
            const thisDate = new Date(this.dateYear, this.dateMonth, this.dateDate, 12);
            const isoDate = thisDate.toISOString().slice(0, 10);
            return isoDate;
        },
        isoDateString: function () {
            const yearString = this.isoDate.slice(0, 4);
            const monthString = this.isoDate.slice(5, 7);
            const dateString = this.isoDate.slice(8, 10);
            return `${dateString}-${monthString}-${yearString}`;
        },
        dayOfWeek: function () {
            return `day${new Date(this.dateYear, this.dateMonth, this.dateDate, 12).getDay()}`;
        }
    },
    asyncComputed: {
        availability: async function () {
            if (this.dateDate === '') {
                return 'start-space';
            }
            else if (this.dateDate === undefined) {
                return 'end-space';
            }

            let dates = await bookedDates;
            for (date in dates) {
                if (this.isoDate === dates[date]) {
                    return 'booked';
                }
            }
            return 'available';
        }
    },
    methods: {
        selectDate(element, date) {
            if (this.dateDate) {
                vm.selectDate(element, date);
            }  
        }
    },
    template: `<div :class="['calendar-date', availability, dayOfWeek]" v-on:click="selectDate(_vnode.elm, selfDate)">
                   <div>{{ dateDate }}</div>
               </div>`
})

const calendarMonth = Vue.extend({
    props: ['instCalendarValues', 'instYear', 'instMonth', 'instIndex'],
    computed: {
        monthColumn: function() {
            return `${this.instIndex + 1} / span 1`;
        },
        monthRows: function () {
            return ('45px '.repeat(this.instCalendarValues.length));
        }
    },
    methods: {
        weekRow(week) {
            return `${this.instCalendarValues.indexOf(week) + 1} / span 1`;
        },
        dateColumn(index) {
            return `${index} / span 1`;
        }
    },
    template: `<div>
                   <div :class="['calendar-month']" :style="{ display: 'grid', 'grid-template-rows': monthRows, 'grid-column': monthColumn }">
                       <div :class="['calendar-week']" v-for="week in instCalendarValues" :style="{ 'grid-row': weekRow(week), display: 'grid', 'grid-template-columns': '1fr 1fr 1fr 1fr 1fr 1fr 1fr' }">
                           <calendar-date v-for="i in 7" :style="{ 'grid-column': dateColumn(i) }" :dateYear="instYear" :dateMonth="instMonth" :dateDate="week[i-1]">{{ week[i-1] }}</calendar-date>
                       </div>
                   </div>
               </div>`
})

const vm = new Vue({
    el: '#root',
    data: {
        galleryImages: [
            '../static/01-lounge.jpg',
            '../static/02-lounge.jpg',
            '../static/03-dining.jpg',
            '../static/04-dining.jpg',
            '../static/05-kitchen.jpg',
            '../static/06-stairs.jpg',
            '../static/07-master.jpg',
            '../static/08-twin.jpg',
            '../static/09-single.jpg',
            '../static/10-bathroom.jpg',
            '../static/11-garden.jpg',
            '../static/12-gardens.jpg',
            '../static/13-gardens.jpg',
            '../static/14-front.jpg'
        ],
        bookingFormData: {
            arrivalDate: '',
            departureDate: '',
            adults: 0,
            children: 0,
            infants: 0,
            dogs: 0,
            name: '',
            emailAddress: '',
            phoneNumber: '',
            price: 0
        },

        contactFormData: {
            name: '',
            lastName: '',
            emailAddress: '',
            phoneNumber: '',
            message: ''
        },
        currentDate: new Date(),
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth(),
        slideCount: 0,
        calendarShow: false,
        calendarSelector: 0
    },
    computed: {
        selectedMonth: function () {
            return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + this.slideCount);
        }
    },
    methods: {
        toggleSideMenu() {
            if (this.$refs.sideMenu.style.display === 'none') {
                this.$refs.sideMenu.style.display = 'block';
            } else {
                this.$refs.sideMenu.style.display = 'none';
            }
        },
        goToProfile() {
            this.$refs.profile.scrollIntoView(true);
        },
        goToBooking() {
            this.$refs.booking.scrollIntoView(true);
        },
        goToContact() {
            this.$refs.contact.scrollIntoView(true);
        },
        showOverview() {
            this.$refs.overview.style.display = 'block';
            this.$refs.facilities.style.display = 'none';
            this.$refs.location.style.display = 'none';
        },
        showFacilities() {
            this.$refs.overview.style.display = 'none';
            this.$refs.facilities.style.display = 'block';
            this.$refs.location.style.display = 'none';
        },
        showLocation() {
            this.$refs.overview.style.display = 'none';
            this.$refs.facilities.style.display = 'none';
            this.$refs.location.style.display = 'block';
        },
        decreaseMonth() {
            this.slideCount--;
            const calendarSlide = this.$refs.calendarSlide;
            const allMonths = calendarSlide.children;

            allMonths[4].remove();

            const mountPoint = document.createElement('table');
            calendarSlide.insertBefore(mountPoint, allMonths[0]);

            for (let i = 0; i < allMonths.length; i++) {
                allMonths[i].style.gridColumn = `${i + 1} / span 1`;
            }

            let instance = new calendarMonth({
                propsData: {
                    instCalendarValues: this.calendarValues(this.currentYear, this.currentMonth + this.slideCount - 2),
                    instYear: this.currentYear,
                    instMonth: this.currentMonth + this.slideCount - 2,
                    instIndex: 0
                }
            })

            instance.$mount(mountPoint);

            const weekList = document.querySelectorAll('.calendar-month')[2].children;
            let height = 0;
            for (let i = 0; i < weekList.length; i++) {
                height += weekList[i].offsetHeight;
                if (i === 5) {
                    break;
                }
            }
            this.$refs.calendarSlide.style.height = `${height + 20}px`;
        },
        increaseMonth() {
            this.slideCount++;
            const calendarSlide = this.$refs.calendarSlide;
            const allMonths = calendarSlide.children;

            allMonths[0].remove();

            const mountPoint = document.createElement('table');
            calendarSlide.insertBefore(mountPoint, allMonths[4]);

            for (let i = 0; i < allMonths.length; i++) {
                allMonths[i].style.gridColumn = `${i + 1} / span 1`;
            }

            let instance = new calendarMonth({
                propsData: {
                    instCalendarValues: this.calendarValues(this.currentYear, this.currentMonth + this.slideCount + 2),
                    instYear: this.currentYear,
                    instMonth: this.currentMonth + this.slideCount + 2,
                    instIndex: 4
                }
            })

            instance.$mount(mountPoint);

            const weekList = document.querySelectorAll('.calendar-month')[2].children;
            let height = 0;
            for (let i = 0; i < weekList.length; i++) {
                height += weekList[i].offsetHeight;
                if (i === 5) {
                    break;
                }
            }
            this.$refs.calendarSlide.style.height = `${height + 20}px`;            
        },
        calendarValues(year, month) { //populates calendar

            //---add days to calendar from first of month--//
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            let week = [];
            let calendar = [];
            for (let n = 1; n <= daysInMonth; n++) {
                let date = new Date(year, month, n);
                week.push(date.getDate());
                if (date.getDay() === 0) {
                    calendar.push(week);
                    week = [];
                }
            }
            if (week.length > 0) {
                calendar.push(week);
            }
            

            //--fills first week with dates of previous month--//
            datesAdded = 0;
            while (calendar[0].length < 7) {
                calendar[0].unshift('');
                datesAdded++;
                /*dateToAdd = (new Date(year, month, 0 - datesAdded)).getDate();
                calendar[0].unshift(dateToAdd);
                datesAdded++;*/
            }
            return (calendar);
        },
        initialCalendarLoad(year, month, inputField) {
            const calendarSlide = this.$refs.calendarSlide;
            const allMonths = calendarSlide.children;

            for (let i = 0; i < 5; i++) {
                const mountPoint = document.createElement('table');
                calendarSlide.insertBefore(mountPoint, allMonths[i]);

                allMonths[i + 1].remove();

                const instance = new calendarMonth({
                    data: {
                        field: inputField,
                    },
                    propsData: {
                        instCalendarValues: this.calendarValues(year, month + i - 2),
                        instYear: year,
                        instMonth: month + i - 2,
                        instIndex: i
                    }
                });

                instance.$mount(mountPoint);
                                
            }
            const weekList = document.querySelectorAll('.calendar-month')[2].children;
            let height = 0;
            for (let i = 0; i < weekList.length; i++) {
                height += weekList[i].offsetHeight;
                if (i === 5) {
                    break;
                }
            }
            this.$refs.calendarSlide.style.height = `${height + 20}px`;
        },
        selectDate(element, date) {
            if (element.classList.contains('available')) {
                if (this.calendarSelector === 0) {
                    console.log(0);
                    if (document.querySelector('.arrival-date')) {
                        document.querySelector('.arrival-date').classList.remove('arrival-date');
                        if (document.querySelector('.departure-date')) {
                            document.querySelector('.departure-date').classList.remove('departure-date');
                            let validDateRange = document.querySelectorAll('.valid-range-date');
                            for (let i = 0; i < validDateRange.length; i++) {
                                validDateRange[i].classList.remove('valid-range-date');
                            }
                            let invalidDateRange = document.querySelectorAll('.invalid-range-date');
                            for (let i = 0; i < invalidDateRange.length; i++) {
                                invalidDateRange[i].classList.remove('invalid-range-date');
                            }
                        }
                    }
                    
                    element.classList.add('arrival-date');
    
                    this.bookingFormData.departureDate = '';
                    this.bookingFormData.arrivalDate = date;
                    this.bookingFormData.price = 0;
                    this.calendarSelector = 1;
                }
                else if (this.calendarSelector === 1) {
                    console.log(1);
                    let calendarDates = Array.from(document.querySelectorAll('.calendar-date'));
                    calendarDates = calendarDates.filter((node) => {
                        if (node.classList.contains('available') || node.classList.contains('booked')) {
                            return node;
                        }
                    })
                    let arrivalIndex = calendarDates.indexOf(document.querySelector('.arrival-date'));
                    let departureIndex = calendarDates.indexOf(element);
                    if (departureIndex > arrivalIndex) {
                        element.classList.add('departure-date');
                        let validRange = true;
                        for (let i = arrivalIndex; i <= departureIndex; i++) {
                            if (validRange) {
                                console.log(i);
                                if (calendarDates[i].classList.contains('available')) {
                                    calendarDates[i].classList.add('valid-range-date');
                                } else {
                                    validRange = false;
                                    i = arrivalIndex - 1;
                                }
                            } else {
                                console.log(i);
                                if (calendarDates[i].classList.contains('valid-range-date')) {
                                    calendarDates[i].classList.remove('valid-range-date');
                                }
                                calendarDates[i].classList.add('invalid-range-date');
                                if (i === departureIndex) {
                                    this.calendarSelector = 0;
                                    return;
                                }
                            }
                            
                            
                        }
                        this.bookingFormData.departureDate = date;
                        this.calendarSelector = 0;
                        this.bookingFormData.price = getPrice(this.bookingFormData.arrivalDate, this.bookingFormData.departureDate);
                    }
                    else {
                        document.querySelector('.arrival-date').classList.remove('arrival-date');
                        element.classList.add('arrival-date');
                        this.bookingFormData.arrivalDate = date;
                        console.log('departure date must be after arrival date');
                    } 
                }
            }  
        },
        datesValid(arrival, departure) { //---add date rules here--potentially editable by server?--//
            if (arrival < departure) {
                return 'Departure must be after arrival';
            }
            return true;
        },
        bookingProceed() {
            let i = 1;
            console.log(i);
            const callback = function (mutation) {
                i++;
                console.log(mutation);
            }
            const observer = new MutationObserver(callback);
            observer.observe(this.$refs.bookingForm, {
                childList: true,
                attributes: true,
                subtree: true
            });
            this.$refs.bookingForm.style.visibility = 'visible';
            this.$refs.bookingForm.style.maxHeight = '1000px';
            this.$refs.bookingForm.style.opacity = '1.0';
            observer.disconnect();
        },
        adultsDecrease() {
            if (this.bookingFormData.adults > 0) {
                this.bookingFormData.adults--;
                if (this.bookingFormData.adults === 0) {
                    document.querySelector('#adults .party-decrease').disabled = true;
                }
            }
            document.querySelector('#adults .party-increase').disabled = false;
            document.querySelector('#children .party-increase').disabled = false;
        },
        adultsIncrease() {
            if (this.bookingFormData.adults + this.bookingFormData.children < 5) {
                this.bookingFormData.adults++;
                if (this.bookingFormData.adults + this.bookingFormData.children === 5) {
                    document.querySelector('#adults .party-increase').disabled = true;
                    document.querySelector('#children .party-increase').disabled = true;
                }
            }
            document.querySelector('#adults .party-decrease').disabled = false;
        },
        childrenDecrease() {
            if (this.bookingFormData.children > 0) {
                this.bookingFormData.children--;
            } if (this.bookingFormdata.children === 0) {
                document.querySelector('#children .party-decrease').disabled = true;
            }
            document.querySelector('#children .party-increase').disabled = false;
            document.querySelector('#adults .party-increase').disabled = false;
        },
        childrenIncrease() {
            if (this.bookingFormData.chilren + this.bookingFormData.adults < 5) {
                this.bookingFormData.children++;
                if (this.bookingFormData.children + this.bookingFormData.adults === 5) {
                    document.querySelector('#children .party-increase').disabled = true;
                    document.querySelector('#adults .party-increase').disabled = true;
                }
            }
            document.querySelector('#children .party-decrease').disabled = false;
        },
        infantsDecrease() {

        },
        infantsIncrease() {

        },
        dogsDecrease() {

        },
        dogsIncrease() {

        },
        submitBooking() {
            console.log(JSON.stringify(this.bookingFormData));

            fetch('/booking', {
                method: 'post',
                body: JSON.stringify(this.bookingFormData),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            })
                .then(response => {
                    return (response.json());
                })
                .then(json => {
                    if (json['success']) {
                        console.log('request successful');
                    } else {
                        console.log('request unsuccessful');
                    }
                })
        },
        viewFullScreen() {
            const element = this.$refs.galleryView;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) { /* Firefox */
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) { /* IE/Edge */
                element.msRequestFullscreen();
            }
        },
    },
    delimiters: ['<%', '%>']
})

function getPrice(arrival, departure) { //assuming that data is ordered by date
    for (let i = 0; i < priceList.length; i++) {
        if (priceList[i]['startDate'] <= arrival && arrival < priceList[i]['endDate'] && arrival < departure) {
            let price = priceList[i]['price'];
            if (departure <= priceList[i]['endDate']) {
                return price;
            } else {
                for (let j = i + 1; j < priceList.length; j++) {
                    if (departure >= priceList[j]['startDate']) {
                        price += priceList[j]['price'];
                        if (departure <= priceList[j]['endDate']) {
                            return price; ///return applyDiscount(price, stayLength (departure - arrival))
                        }
                    }
                }
            }
        }
    }
}

const priceList = [
    { 'startDate': new Date(2020, 7, 15), 'endDate': new Date(2020, 7, 22), 'price': 1000.00 },
    { 'startDate': new Date(2020, 7, 22), 'endDate': new Date(2020, 7, 29), 'price': 900.00 },
    { 'startDate': new Date(2020, 7, 29), 'endDate': new Date(2020, 8, 5), 'price': 800.00}
]

const bookedDates =
    fetch('/dates', { method: 'post' })
        .then(response => {
            return (response.json());
        })
        .then(json => {
            return (json['dates']);
        })

let field = '';

vm.initialCalendarLoad(2020, 7, field);

const calendarGrid = vm.$refs.calendarSlide;
animateCSSGrid.wrapGrid(calendarGrid);