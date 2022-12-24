const pool = require('../Config/db-config');


class DBQueries {
    constructor(){

    }

    static getDataFromBDTable(table_name){

        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM ${table_name} ORDER BY name ASC`, 
                (error, response) => {

                if (error) return reject(error);

                resolve(response.rows)
            });
        })
    }

    static findOne(table_name, column_name, value){
        var sql = `SELECT * FROM ${table_name} WHERE ${column_name} = $1`
        var sqlValue = [value]
  
        return new Promise((resolve, reject) => {
            pool.query(
              sql,
              sqlValue,
              (error, response) => {
                if (error) return reject(error);
  
                resolve(response.rows);
              }
            )
          });
    }

    static createCustomer(customer){

        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO customers(name, email, payment_method, created_at) 
                VALUES ($1, $2, $3, $4) RETURNING id`, 
                [customer.name, customer.email, customer.payment_method.type, new Date(Date.now())],
                (error, response) => {
        
                if (error) return reject(error);
        
                resolve({'status': 'success', 'response': response})
            }
            
            );
        })
    }

    static createSubscription(subscription){

        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO subscriptions(customer_id, product_id, rapyd_sub_id, created_at) 
                VALUES ($1, $2, $3, $4) RETURNING id`, 
                [subscription.customer_id, subscription.product_id, subscription.rapyd_sub_id, new Date(Date.now())],
                (error, response) => {
        
                if (error) return reject(error);
        
                resolve({'status': 'success', 'response': response})
            }
            
            );
        })
    }

    static getSubscriptionId(email){

        var sql = `SELECT * FROM customers c
        JOIN subscriptions s ON s.customer_id = c.id 
        WHERE c.email = $1 `
        var sqlValue = [email]
  
        return new Promise((resolve, reject) => {
            pool.query(
              sql,
              sqlValue,
              (error, response) => {
                if (error) return reject(error);
  
                resolve(response.rows);
              }
            )
          });
    }
    
}

module.exports = DBQueries;