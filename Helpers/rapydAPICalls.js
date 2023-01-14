const {makeRequest} = require('../Helpers/rapydUtilities')

class rapydAPICalls{
    constructor(){

    }

    static async getPaymentMethods(currency, country){

        var paymentMethod;
        await makeRequest('GET', `/v1/payment_methods/country?country=${country}&currency=${currency}`).then((data)=>{

            paymentMethod = data

        }).catch((error) => console.log(error))

        return paymentMethod.body.data

    }

    static async getRequiredFields(payment_type){

        var requiredFields;
        await makeRequest('GET', `/v1/payment_methods/required_fields/${payment_type}`).then((data)=>{

            requiredFields = data

        }).catch((error) => console.log(error))

        return requiredFields.body.data

    }

    static async createCustomerProfile(body){
        
        var customerDetails;
        await makeRequest('POST', `/v1/customers`, body).then((data)=>{

            customerDetails = data

        }).catch((error) => console.log(error))

        return customerDetails.body

    }

    static async createPlan(body){
        
        var planDetails;
        await makeRequest('POST', `/v1/plans`, body).then((data)=>{

            planDetails = data

        }).catch((error) => console.log(error))

        return planDetails.body

    }


    static async subscribe(body){
        
        var subscription;
        await makeRequest('POST', `/v1/payments/subscriptions`, body).then((data)=>{

            subscription = data

        }).catch((error) => console.log(error))

        return subscription.body

    }

    static async cancelSubscription(sub_id){

        var response;
        await makeRequest('DELETE', `/v1/payments/subscriptions/${sub_id}`).then((data)=>{

            response = data

        }).catch((error) => console.log(error))

        return response.body

    }

} 

module.exports = rapydAPICalls;