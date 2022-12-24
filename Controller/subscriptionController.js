const rapydAPICalls = require('../Helpers/rapydAPICalls')
const DBQueries = require('../Model/DBQueries')

class subscriptionController{
    constructor(){

    }

    static viewProducts(req, res, next){
        
         DBQueries.getDataFromBDTable('products').then( async (data)=>{

                const paymentMethod = await rapydAPICalls.getPaymentMethods('USD', 'US');
                res.render('Subscription', {
                    products: data,
                    paymentMethods:  paymentMethod
                })

        }).catch((error) =>  console.log(error))

    }

    static async getPaymentMethodFields(req, res, next){

        const getRequiredFields = await rapydAPICalls.getRequiredFields(req.body.payment_method);

        return res.json({status: 200, message: 'action succesful', data: getRequiredFields});

    }

    static async createSubscription(req, res, next){

        const customerDetails = {
            name: req.body.full_name,
            email: req.body.customer_email,
            payment_method: {
                type: req.body.payment_method,
                fields: {
                  number: req.body.fieldnumber,
                  expiration_month: req.body.fieldexpiration_month,
                  expiration_year: req.body.fieldexpiration_year,
                  cvv: req.body.fieldcvv,
                  name: req.body.fieldname,
                },
                complete_payment_url: 'https://complete.rapyd.net/',
                error_payment_url: 'https://error.rapyd.net/'
              }
        };

        //check if customer exist before subscription.
        const checkCustomer = await DBQueries.findOne('customers', 'email', req.body.customer_email);

        if (checkCustomer.length > 0) {
            return res.status(400).json({status: 400, message: 'Customer email already exist'});
        }

        //created customer in the DB
        const createCustomerInDB = await DBQueries.createCustomer(customerDetails);

        if (createCustomerInDB.status == 'success') {
            // create customer in Rapyd
            const customerDetailsResponse = await rapydAPICalls.createCustomerProfile(customerDetails);

            if (customerDetailsResponse.status.status == 'SUCCESS') {
                console.log('customerDetailsResponse: ', customerDetailsResponse.data)

                const planDetails = {
                    currency: 'USD',
                    interval: 'month',
                    product: req.body.rapyd_product_id,
                    amount: req.body.price / 100,
                    nickname: 'Monthly Subscription',
                    usage_type: 'licensed'
                };

                //create plan
                const planDetailsResponse = await rapydAPICalls.createPlan(planDetails);

                if (customerDetailsResponse.status.status == 'SUCCESS') {
                    console.log('planDetailsResponse: ', planDetailsResponse.data)

                    const subscriptionDetails = {
                        customer: customerDetailsResponse.data.id,
                        billing: 'pay_automatically',
                        billing_cycle_anchor: '',
                        cancel_at_period_end: true,
                        coupon: '',
                        days_until_due: null,
                        payment_method: customerDetailsResponse.data.default_payment_method,
                        subscription_items: [
                          {
                            plan: planDetailsResponse.data.id,
                            quantity: 1
                          }
                        ],
                        metadata: {
                          merchant_defined: true
                        },
                        tax_percent: 10.5,
                        trial_start: parseInt((new Date(Date.now()).getTime() / 1000).toFixed(0)),
                        trial_period_days: 7,
                        plan_token: ''
                    };
                    
                    // create subscription in Rapyd
                    const subscriptionResponse = await rapydAPICalls.subscribe(subscriptionDetails);

                    if (subscriptionResponse.status.status == 'SUCCESS') {
                        console.log('subscriptionResponse: ', subscriptionResponse.data)

                        const subscriptionInDbDetails = {
                            customer_id: createCustomerInDB.response.rows[0].id,
                            rapyd_sub_id: subscriptionResponse.data.id,
                            product_id: req.body.product_id
                        };

                        //create subscription in DB
                        const createSubscriptionInDB = await DBQueries.createSubscription(subscriptionInDbDetails);

                        if (createSubscriptionInDB.status == 'success') {
                            return res.json({status: 200, message: 'subscription successful'});
                        }
                    }


                }


            }   
        }

        
    }

    static async cancelSubscription(req, res, next){

        const customerDetails = {
            name: req.body.full_name,
            email: req.body.customer_email,
            payment_method: {
                type: req.body.payment_method,
                fields: {
                  number: req.body.fieldnumber,
                  expiration_month: req.body.fieldexpiration_month,
                  expiration_year: req.body.fieldexpiration_year,
                  cvv: req.body.fieldcvv,
                  name: req.body.fieldname,
                },
                complete_payment_url: 'https://complete.rapyd.net/',
                error_payment_url: 'https://error.rapyd.net/'
              }
        };

        //check if customer exist before subscription.
        const checkSubscription = await DBQueries.getSubscriptionId(req.body.customer_email);

        if (checkSubscription.length == 0) {
            return res.status(400).json({status: 400, message: 'You presently do not have a subscrition'});
        }

        const cancelResponse = await rapydAPICalls.cancelSubscription(checkSubscription[0].rapyd_sub_id);

        if (cancelResponse.status.status == 'SUCCESS') {
            console.log(cancelResponse)
            return res.json({status: 200, message: 'action successful'});
        }
        
    }

} 

module.exports = subscriptionController;