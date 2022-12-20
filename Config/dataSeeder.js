const pool = require("./db-config");
const {makeRequest} = require('../Helpers/rapydUtilities')

const products = [
    {
        name: 'Product 1',
        type:'services',
        price: 30000,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' 

    },
    {
        name: 'Product 2',
        type:'services',
        price: 50000,
        description: 'Etiam id dictum neque. Etiam at risus ac libero' 

    },
    {
        name: 'Product 2',
        type:'services',
        price: 90000,
        description: 'Pellentesque id nisi id ligula convallis scelerisque facilisis a dolor' 
    }
]

products.forEach(product => {

    const body = {
        name: product.name,
        type: product.type
    };

    makeRequest('POST', '/v1/products', body).then((data)=>{

        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO products(rapyd_plan_id, name, type, price, description, created_at) 
                VALUES ($1, $2, $3, $4, $5, $6)`, 
                [data.body.data.id, product.name, product.type, product.price, product.description, new Date(Date.now())],
                (error, response) => {
        
                if (error) return reject(error);
        
                resolve(response.rows[0])
            }
            
            );
        }).catch(error => console.log(error))

    })
    .catch((error)=>{
        console.log('error: ',error);
    });

    

});
