Vue.component('calendar-date', {
    props: ['dateYear', 'dateMonth', 'dateDate'],
    computed: {
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
                return 'whitespace';
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
    /*methods: {
        returnDate() {
            const inputDate = ``
            const input = document.getElementById(field);
            input.setAttribute('value', this.isoDateString);
        }
    },*/
    template: '<div :class="[availability, dayOfWeek]">{{ dateDate }}</div>'
})

const calendarMonth = Vue.extend({
    props: ['instCalendarValues', 'instYear', 'instMonth', 'instIndex'],
    computed: {
        monthColumn: function() {
            return `${this.instIndex + 1} / span 1`;
        },
        monthRows: function () {
            return (this.instCalendarValues.length * '1fr');
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
                       <div v-for="week in instCalendarValues" :style="{ 'grid-row': weekRow(week), display: 'grid', 'grid-template-columns': '1fr 1fr 1fr 1fr 1fr 1fr 1fr' }">
                           <calendar-date v-for="i in 7" :style="{ 'grid-column': dateColumn(i) }" :dateYear="instYear" :dateMonth="instMonth" :dateDate="week[i-1]">{{ week[i-1] }}</calendar-date>
                       </div>
                   </div>
               </div>`
})

const vm = new Vue({
    el: '#root',
    data: {
        galleryImages: [
            '../static/01-front.jpg',
            '../static/02-lounge.jpg',
            '../static/03-lounge.jpg',
            '../static/04-dining.jpg',
            '../static/05-dining.jpg',
            '../static/06-kitchen.jpg',
            '../static/07-stairs.jpg',
            '../static/08-master.jpg',
            '../static/09-twin.jpg',
            '../static/10-single.jpg',
            '../static/11-bathroom.jpg',
            '../static/12-garden.jpg',
            '../static/13-gardens.jpg',
            '../static/14-gardens.jpg'
        ],
        bookingFormData: {
            arrivalDate: '',
            departureDate: '',
            phoneNumber: '',
            party: {
                adults: 0,
                children: 0,
                infants: 0,
                dogs: 0
            },
            name: '',
            emailAddress: ''
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
    },
    computed: {
        selectedMonth: function () {
            return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + this.slideCount);
        },
        bookingFormComputed: function () {
            return {
                price: function () {
                    return 0;
                }
            }
        },
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

            this.$refs.overview.style.opacity = '1.0';
            this.$refs.facilities.style.opacity = '0.0';
            this.$refs.location.style.opacity = '0.0';
        },
        showFacilities() {
            this.$refs.overview.style.display = 'none';
            this.$refs.facilities.style.display = 'block';
            this.$refs.location.style.display = 'none';

            this.$refs.overview.style.opacity = '0.0';
            this.$refs.facilities.style.opacity = '1.0';
            this.$refs.location.style.opacity = '0.0';
        },
        showLocation() {
            this.$refs.overview.style.display = 'none';
            this.$refs.facilities.style.display = 'none';
            this.$refs.location.style.display = 'block';

            this.$refs.overview.style.opacity = '0.0';
            this.$refs.facilities.style.opacity = '0.0';
            this.$refs.location.style.opacity = '1.0';
        },
        toggleCalendar() {
            if (!this.calendarShow) {
                this.$refs.calendar.style.transform = "translateY(0)";
                this.calendarShow = true;
            } else {
                this.$refs.calendar.style.transform = "translateY(100%)";
                this.initialCalendarLoad(this.currentYear, this.currentMonth);
                this.slideCount = 0;
                this.calendarShow = false;
            }
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
            calendar.push(week);

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
        },
        adultsDecrease() {
            if (this.bookingFormData.party.adults > 0) {
                this.bookingFormData.party.adults--;
                if (this.bookingFormData.party.adults === 0) {
                    document.querySelector('#adults .party-decrease').disabled = true;
                }
            }
            document.querySelector('#adults .party-increase').disabled = false;
            document.querySelector('#children .party-increase').disabled = false;
        },
        adultsIncrease() {
            if (this.bookingFormData.party.adults + this.bookingFormData.party.children < 5) {
                this.bookingFormData.party.adults++;
                if (this.bookingFormData.party.adults + this.bookingFormData.party.children === 5) {
                    document.querySelector('#adults .party-increase').disabled = true;
                    document.querySelector('#children .party-increase').disabled = true;
                }
            }
            document.querySelector('#adults .party-decrease').disabled = false;
        },
        childrenDecrease() {
            if (this.bookingFormData.party.children > 0) {
                this.bookingFormData.party.children--;
            } if (this.bookingFormdata.party.children === 0) {
                document.querySelector('#children .party-decrease').disabled = true;
            }
            document.querySelector('#children .party-increase').disabled = false;
            document.querySelector('#adults .party-increase').disabled = false;
        },
        childrenIncrease() {
            if (this.bookingFormData.party.chilren + this.bookingFormData.party.adults < 5) {
                this.bookingFormData.party.children++;
                if (this.bookingFormData.party.children + this.bookingFormData.party.adults === 5) {
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
                body: JSON.stringify(this.bookingFormData)
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
        }
        
    },
    delimiters: ['<%', '%>']
})


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