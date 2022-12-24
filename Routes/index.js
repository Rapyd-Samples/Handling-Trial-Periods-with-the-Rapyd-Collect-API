const app = require('../Config/server')
const path = require('path');
const dotEnv = require('dotenv');
const bodyParser = require('body-parser');
const subscriptionController = require('../Controller/subscriptionController')

dotEnv.config()

app.set('views', path.join(__dirname, '../Views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {subscriptionController.viewProducts(req, res, next)})
app.post('/payment-method-fields', (req, res, next) => {subscriptionController.getPaymentMethodFields(req, res, next)})
app.post('/create-subscription', (req, res, next) => {subscriptionController.createSubscription(req, res, next)})
app.post('/cancel-subscription', (req, res, next) => {subscriptionController.cancelSubscription(req, res, next)})