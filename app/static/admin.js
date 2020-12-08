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


