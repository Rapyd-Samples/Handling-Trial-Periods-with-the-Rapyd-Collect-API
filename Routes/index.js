const app = require('./Config/server');
const dotEnv = require('dotenv')
 
const app = express()
dotEnv.config()
 
const port = process.env.PORT || 3159;
app.listen(port, () => {console.log(`App listening on port ${port}`)})
