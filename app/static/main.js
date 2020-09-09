window.addEventListener('load', function() {
    var gallerySwiper = new Swiper('.gallery-swiper', {
        // Optional parameters
        loop: true,
      
        // If we need pagination
        pagination: {
          el: '.gallery-pagination',
          dynamicBullets: true
        },
      
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
    });
    
    
})

// corrects hero image size, as most mobile browsers have inconsistent viewport dimensions
// which causes undesirable resizing of hero area
// also accounts for mobile browsers confusing height and width in landscape orientation

let heroHeight;

const heroResize = function () {
    if (document.documentElement.offsetHeight > document.documentElement.offsetWidth) {
        if (window.screen.height > window.screen.width) {
            heroHeight = window.screen.height;
        } else {
            heroHeight = window.screen.width;
        }
    } else {
        if (window.screen.height < window.screen.width) {
            heroHeight = window.screen.height;
        } else {
            heroHeight = window.screen.width;
        }
    }
    document.querySelector('.hero-area').style.height = `${heroHeight}px`;
}

heroResize();

window.addEventListener('resize', heroResize);

//------body scroll lock used when side menu open--------//
const disableBodyScroll = bodyScrollLock.disableBodyScroll;
const enableBodyScroll = bodyScrollLock.enableBodyScroll;

//-------------------- side menu close behavious ---------------//


//---------------CALENDAR COMPONENTS---------------------------------------//

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
        },
        extendedAvailability: async function () {
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

/*const calendarMonth = Vue.extend({
    props: ['instYear', 'instMonth'],
    computed: {           
        instCalendarValues: function () {
            return (vm.calendarValues(this.instYear, this.instMonth));
        },
        monthRows: function () {
            return ('48px '.repeat(this.instCalendarValues.length));
        }
    },
    methods: {
        weekRow(week) {
            return `${this.instCalendarValues.indexOf(week) + 1} / span 1`;
        },
        dateColumn(index) {
            return `${index} / span 1`;
        },
    },
    template: `<div class="swiper-slide">
                   <div class="calendar-month" :style="{ display: 'grid', 'grid-template-rows': monthRows }">
                       <div class="calendar-week" v-for="week in instCalendarValues" :style="{ 'grid-row': weekRow(week), display: 'grid', 'grid-template-columns': 'repeat(7, 1fr)' }">
                           <calendar-date v-for="i in 7" :style="{ 'grid-column': dateColumn(i) }" :dateYear="instYear" :dateMonth="instMonth" :dateDate="week[i-1]"></calendar-date>
                       </div>
                   </div>
               </div>`
})*/

const calendarMonth = Vue.extend({
    props: ['instYear', 'instMonth'],
    computed: {           
        instCalendarValues: function () {
            return (vm.experimentCalendarValues(this.instYear, this.instMonth));
        },
        monthRows: function () {
            return ('48px '.repeat(this.instCalendarValues.length));
        }
    },
    methods: {
        weekRow(week) {
            return `${this.instCalendarValues.indexOf(week) + 1} / span 1`;
        },
        dateColumn(index) {
            return `${index} / span 1`;
        },
        dateNumber(week, index) {
            if (week.prevDays) {
                if (index < week.prevDays.length) {
                    return(week.prevDays[index]);
                } else if (week.days) {
                    return(week.days[index - week.prevDays.length]);
                }
            }
            else if (week.nextDays) {
                if (week.days) {
                    if (index < week.days.length) {
                        return(week.days[index]);
                    } else {
                        return(week.nextDays[index - week.days.length]);
                    }
                } else {
                    return (week.nextDays[index]);
                }
            } 
            else {
                return (week.days[index]);
            }
        },
        dateClass(week, index) {
            if (week.prevDays) {
                if (index < week.prevDays.length) {
                    return('prev-days');
                } else if (week.days) {
                    return('');
                }
            }
            else if (week.nextDays) {
                if (week.days) {
                    if (index < week.days.length) {
                        return('');
                    } else {
                        return('next-days');
                    }
                } else {
                    return ('next-days');
                }
            } 
            else {
                return ('');
            }
        },
    },
    template: `<div class="swiper-slide">
                   <div class="calendar-month" :style="{ display: 'grid', 'grid-template-rows': monthRows }">
                       <div class="calendar-week" v-for="week in instCalendarValues" :style="{ 'grid-row': weekRow(week), display: 'grid', 'grid-template-columns': 'repeat(7, 1fr)' }">
                           <calendar-date v-for="i in 7" :style="{ 'grid-column': dateColumn(i) }" :dateYear="instYear" :dateMonth="instMonth" :dateDate="dateNumber(week, i-1)" :class="dateClass(week, i-1)"></calendar-date>
                       </div>
                   </div>
               </div>`
})

//---------------------------ROOT COMPONENT--------------------//

const vm = new Vue({
    el: '#root',
    data: {
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
        calendarRange: 18,
        calendarShow: false,
        calendarSelector: 0,
        //side menu open parameters
        scrollY: 0,
        scrimClose: false,
        initialX: undefined,
        offsetX: undefined,
        //gallery 
        gallerySlideCount: 1
    },
    computed: {
        selectedMonth: function () {
            return new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + this.slideCount);
        }
    },
    methods: {
        //-------------------- NAVBAR METHODS ------------------------//
        toggleSideMenu() {  
            //toggles side menu
            const navLinks = document.querySelector('.nav-links');
            document.querySelector('.side-menu').ontransitionend = function() {
                if (!document.querySelector('.side-menu').classList.contains('open')) {
                    document.querySelector('.side-menu').style.transform = 'translate3d(-100%, 0, 0)';
                }
            }
            
            if (!navLinks.classList.contains('open')) {
                document.querySelector('.side-menu').style.transform = 'translate3d(0, 0, 0)';
                navLinks.style.transform = 'translate3d(0, 0, 0)';

                //body scroll lock
                this.scrollY = window.scrollY;
                let offsetY = this.scrollY;
                disableBodyScroll(navLinks);
                //desktop browsers scroll to the top of page, below code corrects view only if this happens
                setTimeout(function () {
                    if (window.scrollY != offsetY) {
                        document.querySelector('.content-wrapper').style.transform = `translateY(-${offsetY}px)`;
                    }
                })
                
            } else {
                navLinks.style.transform = 'translate3d(-100%, 0, 0)';

                //body scroll unlock
                let offsetY = this.scrollY;
                enableBodyScroll(navLinks);
                //desktop browsers scroll to the top of page, below code corrects view only if this happens
                setTimeout(function () {
                    if (window.scrollY != offsetY) {
                        document.querySelector('.content-wrapper').style.transform = `translateY(0)`;
                    }
                    window.scrollTo(0, offsetY);
                }, 1)
            }
            navLinks.classList.toggle('open');
            document.querySelector('#root').classList.toggle('open');
            this.$refs.hamburger.classList.toggle('open');
            document.querySelector('.hero-area').classList.toggle('open');
            document.querySelector('.side-menu').classList.toggle('open');          
        },
        bookCTAPress() {
            //goes to booking section when navbar cta button is pressed
            document.querySelector('.navbar button').classList.toggle('pressed');
        },

        //----------------------- SIDE MENU METHODS -----------------------------//
        //-----------navigation links--------------//
        //---------- side menu touch methods used to close menu by tapping or sliding //
        menuTouchstart(event) {
            //on touchstart
            if (document.querySelector('.nav-links').contains(event.target)) {
                this.initialX = event.touches[0].clientX;
                document.querySelector('.nav-links').style.transition = "none"; 
            } else if (document.querySelector('.nav-links').classList.contains('open') && event.target === document.querySelector('.side-menu')) {
                this.scrimClose = true;
                this.initialX = document.querySelector('.nav-links').clientWidth;
                document.querySelector('.nav-links').style.transition = "none"; 
            }
        },
        menuTouchmove(event) {
            //on touchmove, slides menu horizontally based on touch position
            if (document.querySelector('.side-menu').contains(event.target) && document.querySelector('.nav-links').classList.contains('open')) {
                this.scrimClose = false;
                if (!document.querySelector('.navbar').contains(event.target)) {
                    this.offsetX = event.touches[0].clientX - this.initialX;
                    if (this.offsetX <= 0) {
                        document.querySelector('.nav-links').style.transform = `translate3d(${this.offsetX}px, 0, 0)`;
                    }   
                }
            }
        },
        menuTouchend(event) {
            //on touchend, calls side menu if conditions are met, else keeps side menu open and resets parameters ready for next touch event
            if (this.scrimClose && document.querySelector('.nav-links').classList.contains('open')) {
                document.querySelector('.nav-links').style.transition = 'all 0.2s';
                let endX = event.changedTouches[0].clientX;
                let endY = event.changedTouches[0].clientY;
                if (document.elementFromPoint(endX, endY) === document.querySelector('.side-menu')) {
                    vm.toggleSideMenu();
                }
                this.scrimClose = false;
            }
            if (document.querySelector('.side-menu').contains(event.target) && document.querySelector('.nav-links').classList.contains('open')) {
                document.querySelector('.nav-links').style.transition = 'all 0.2s';
                if (this.offsetX < -(document.querySelector('.nav-links').clientWidth) / 4) {
                    document.querySelector('.nav-links').style.transform = `translate3d(-100%, 0, 0)`;
                    this.toggleSideMenu();
                } else {
                    document.querySelector('.nav-links').style.transform = `translate3d(0, 0, 0)`;
                }
            }
            this.scrimClose = false;
            this.initialX = undefined;
            this.offsetX = undefined;
        },

        //------------------- GALLERY METHODS -------------------------------------//
        prevImage() {
            if (this.gallerySlideCount <= 0) {
                return;
            }
            this.gallerySlideCount--;
            document.querySelector('.gallery-slide').style.transition = 'all 0.5s';
            document.querySelector('.gallery-slide').style.transform = `translateX(-${this.gallerySlideCount * 100 / 16}%)`;
        },
        nextImage() {
            if (this.gallerySlideCount >= 15) {
                return;
            }
            this.gallerySlideCount++;
            document.querySelector('.gallery-slide').style.transition = 'all 0.5s';
            document.querySelector('.gallery-slide').style.transform = `translateX(-${this.gallerySlideCount * 100 / 16}%)`;
        },
        galleryWrap() {
            if (this.gallerySlideCount === 15) {
                this.gallerySlideCount = 1;
                document.querySelector('.gallery-slide').style.transition = 'none';
                document.querySelector('.gallery-slide').style.transform = `translateX(-${this.gallerySlideCount * 100 / 16}%)`;

            } else if (this.gallerySlideCount === 0) {
                this.gallerySlideCount = 14;
                document.querySelector('.gallery-slide').style.transition = 'none';
                document.querySelector('.gallery-slide').style.transform = `translateX(-${this.gallerySlideCount * 100 / 16}%)`;
            }
        },
        toggleFullscreenGallery() {
        },

        //-------------------COTTAGE NAV-----------------//
        showOverview() {
            document.querySelector('.overview-cottage-nav').classList.add('active-cottage-link');
            document.querySelector('.facilities-cottage-nav').classList.remove('active-cottage-link');
            document.querySelector('.location-cottage-nav').classList.remove('active-cottage-link');

            document.querySelector('.overview').style.display = 'block';
            document.querySelector('.facilities').style.display = 'none';
            document.querySelector('.location').style.display = 'none';
        },
        showFacilities() {
            document.querySelector('.overview-cottage-nav').classList.remove('active-cottage-link');
            document.querySelector('.facilities-cottage-nav').classList.add('active-cottage-link');
            document.querySelector('.location-cottage-nav').classList.remove('active-cottage-link');

            document.querySelector('.overview').style.display = 'none';
            document.querySelector('.facilities').style.display = 'block';
            document.querySelector('.location').style.display = 'none';
        },
        showLocation() {
            document.querySelector('.overview-cottage-nav').classList.remove('active-cottage-link');
            document.querySelector('.facilities-cottage-nav').classList.remove('active-cottage-link');
            document.querySelector('.location-cottage-nav').classList.add('active-cottage-link');
            
            document.querySelector('.overview').style.display = 'none';
            document.querySelector('.facilities').style.display = 'none';
            document.querySelector('.location').style.display = 'block';
        },

        //--------------- CALENDAR ---------------------------//
        //---------calendar months loading----//

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

        extendedCalendarValues(year, month) { //populates calendar

            //---add days to calendar from first of month--//
            const daysInMonth = new Date(year, month + 1, 0, 12).getDate();
            let week = [];
            let calendar = [];
            
            function dateAppend(x) {
                let date = new Date(year, month, x, 12);
                week.push(date.getDate());
                if (date.getDay() === 0) {
                    calendar.push(week);
                    week = [];
                }
            }

            let n = 1;
            for (n; n <= daysInMonth; n++) {
                dateAppend(n);
            }
            while (calendar.length < 6) {
                dateAppend(n);
                n++;
            }
            
            //--fills first week with dates of previous month--//
            let datesToAdd = 7 - (calendar[0].length);
            for (let i = 0; i < datesToAdd; i++) {
                dateToAdd = (new Date(year, month, -i, 12)).getDate();
                calendar[0].unshift(dateToAdd);
            }
            return(calendar);
        },

        experimentCalendarValues(year, month) { //populates calendar

            //---add days to calendar from first of month--//
            const daysInMonth = new Date(year, month + 1, 0, 12).getDate();
            let week = {};
            let prevDays = [];
            let days = [];
            let nextDays = [];
            let calendar = [];

            let n = 1;

            for (n; n <= daysInMonth; n++) {
                let date = new Date(year, month, n, 12);
                days.push(date.getDate());
                if (date.getDay() === 0) {
                    week.days = days;
                    calendar.push(week);
                    days = [];
                    week = {};
                }
            }
            week.days = days;
            days = [];

            while (calendar.length < 6) {
                let date = new Date(year, month, n, 12);
                nextDays.push(date.getDate());
                if (date.getDay() === 0) {
                    week.nextDays = nextDays;
                    calendar.push(week);
                    nextDays = [];
                    week = {};
                }
                n++;
            }
            
            //--fills first week with dates of previous month--//
            let datesToAdd = 7 - (calendar[0].days.length);
            for (let i = 0; i < datesToAdd; i++) {
                dateToAdd = (new Date(year, month, -i, 12)).getDate();
                prevDays.unshift(dateToAdd);
            }
            calendar[0].prevDays = prevDays;

            return(calendar);
        },
        

        initCalendar(year, month, inputField) {
            var calendarSwiper = new Swiper('.calendar-swiper', {
                navigation: {
                    nextEl: '.next-month',
                    prevEl: '.prev-month',
                  }
            });
            for (let i = 0; i < this.calendarRange; i++) {
                const instance = new calendarMonth({
                    data: {
                        field: inputField,
                    },
                    propsData: {
                        instCalendarValues: this.extendedCalendarValues(year, month + i),
                        instYear: year,
                        instMonth: month + i,
                    }
                });
                let mountPoint = document.createElement('div');
                calendarSwiper.appendSlide(mountPoint);
                instance.$mount(mountPoint);
            }
            calendarSwiper.update();

            calendarSwiper.on('slideChange', () => {
                this.slideCount = calendarSwiper.activeIndex;
            })
        },

        initGliderCalendar(year, month, inputField) {
            var glider = new Glider(document.querySelector('.glider'), {
                arrows: {
                    prev: '.glider-prev-month',
                    // may also pass element directly
                    next: '.glider-next-month'
                },
                slidesToShow: 1,
                slidesToScroll: 1,
                scrollLock: true
            });

            for (let i = 0; i < this.calendarRange; i++) {
                const instance = new calendarMonth({
                    data: {
                        field: inputField,
                    },
                    propsData: {
                        instYear: year,
                        instMonth: month + i,
                    }
                });
                let mountPoint = document.createElement('div');
                glider.addItem(mountPoint);
                instance.$mount(mountPoint);
            }
            glider.refresh();
        },
        
        //--------calendar update------//
        
        

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

vm.initCalendar(vm.currentYear, vm.currentMonth, field);
