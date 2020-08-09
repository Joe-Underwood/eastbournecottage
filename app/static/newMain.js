const vm = new Vue({
    el: '#root',
    data: {
        date: new Date(),
        calendar: {
            slideCount: 0,
            width: 150
        },
        bookingFormData: {
            customer: {
                firstName: '',
                lastName: '',
                emailAddress: '',
                phoneNumber: '',
                address: {
                    addressLine1: '',
                    addressLine: '',
                    townCity: '',
                    county: '',
                    postCode: ''
                }
            },
            booking: {
                party: {
                    adults: 0,
                    children: 0,
                    infants: 0,
                    dogs: 0
                },
                price: 0
            },
            date: {
                arrivalDate: '',
                departureDate: ''
            }
        },
        contactFormData: {
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNumber: '',
            message: ''
        }
    }
})
