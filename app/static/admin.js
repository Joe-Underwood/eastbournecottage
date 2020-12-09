const vm = new Vue({
    el: '#root',
    asyncComputed: {
        getPriceList: async function() {
            const prices = 
                fetch('/get_prices', { method: 'post' })
                    .then(response => {
                        return (response.json());
                    })
                    .then(json => {
                        return (json['priceList'])
                    })
            
            return (prices);
        }
    },
    methods: {
        updatePriceList() {
            console.log(JSON.stringify(this.getPriceList));

            fetch('/update_prices', {
                method: 'post',
                body: JSON.stringify(this.getPriceList),
                headers: new Headers({
                    'content-type': 'application/json'
                })
            })
        }
    },
    delimiters: ['<%', '%>']
})

const tempPriceList= [
    { 'startDate': '2021-01-09', 'price': '519.00', 'booked': false },
    { 'startDate': '2021-01-16', 'price': '571.00', 'booked': false },
    { 'startDate': '2021-01-23', 'price': '571.00', 'booked': false },
    { 'startDate': '2021-01-30', 'price': '571.00', 'booked': false },
    { 'startDate': '2021-02-06', 'price': '571.00', 'booked': false },
    { 'startDate': '2021-02-13', 'price': '609.00', 'booked': false },
    { 'startDate': '2021-02-20', 'price': '598.00', 'booked': false },
    { 'startDate': '2021-02-27', 'price': '587.00', 'booked': false },
    { 'startDate': '2021-02-06', 'price': '571.00', 'booked': false },
    { 'startDate': '2021-03-06', 'price': '587.00', 'booked': false },
    { 'startDate': '2021-03-13', 'price': '587.00', 'booked': false },
    { 'startDate': '2021-03-20', 'price': '587.00', 'booked': false },
    { 'startDate': '2021-03-27', 'price': '587.00', 'booked': true },
    { 'startDate': '2021-04-03', 'price': '735.00', 'booked': false },
    { 'startDate': '2021-04-10', 'price': '722.00', 'booked': false },
    { 'startDate': '2021-04-17', 'price': '684.00', 'booked': false },
    { 'startDate': '2021-04-24', 'price': '722.00', 'booked': false },
    { 'startDate': '2021-05-01', 'price': '709.00', 'booked': false },
    { 'startDate': '2021-05-08', 'price': '709.00', 'booked': false },
    { 'startDate': '2021-05-15', 'price': '730.00', 'booked': false },
    { 'startDate': '2021-05-29', 'price': '819.00', 'booked': false },
    { 'startDate': '2021-06-05', 'price': '704.00', 'booked': false },
    { 'startDate': '2021-06-12', 'price': '936.00', 'booked': false },
    { 'startDate': '2021-06-19', 'price': '936.00', 'booked': true },
    { 'startDate': '2021-06-26', 'price': '990.00', 'booked': false },
    { 'startDate': '2021-07-03', 'price': '990.00', 'booked': false },
    { 'startDate': '2021-07-10', 'price': '990.00', 'booked': false },
    { 'startDate': '2021-07-17', 'price': '999.00', 'booked': false },
    { 'startDate': '2021-07-24', 'price': '1027.00', 'booked': false },
    { 'startDate': '2021-07-31', 'price': '1027.00', 'booked': false },
    { 'startDate': '2021-08-07', 'price': '1027.00', 'booked': false },
    { 'startDate': '2021-08-14', 'price': '1027.00', 'booked': false },
    { 'startDate': '2021-08-21', 'price': '1009.00', 'booked': false },
    { 'startDate': '2021-08-28', 'price': '846.00', 'booked': false },
    { 'startDate': '2021-09-04', 'price': '846.00', 'booked': false },
    { 'startDate': '2021-09-11', 'price': '823.00', 'booked': false },
    { 'startDate': '2021-09-18', 'price': '794.00', 'booked': false },
    { 'startDate': '2021-09-25', 'price': '697.00', 'booked': false },
    { 'startDate': '2021-10-02', 'price': '697.00', 'booked': false },
    { 'startDate': '2021-10-09', 'price': '697.00', 'booked': false },
    { 'startDate': '2021-10-16', 'price': '720.00', 'booked': false },
    { 'startDate': '2021-10-23', 'price': '723.00', 'booked': false },
    { 'startDate': '2021-10-30', 'price': '581.00', 'booked': false },
    { 'startDate': '2021-11-06', 'price': '581.00', 'booked': false },
    { 'startDate': '2021-11-13', 'price': '581.00', 'booked': false },
    { 'startDate': '2021-11-20', 'price': '581.00', 'booked': false },
    { 'startDate': '2021-11-27', 'price': '581.00', 'booked': false },
    { 'startDate': '2021-12-04', 'price': '581.00', 'booked': false },
    { 'startDate': '2021-12-11', 'price': '598.00', 'booked': false },
    { 'startDate': '2021-12-22', 'price': '936.00', 'booked': false },
    { 'startDate': '2021-12-29', 'price': '936.00', 'booked': false },
    { 'startDate': '2022-01-05', 'price': '936.00', 'booked': false },
    { 'startDate': '2022-01-15', 'price': '571.00', 'booked': false },
    { 'startDate': '2022-01-22', 'price': '571.00', 'booked': false },


    
]
