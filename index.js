const app = require('./Config/server');
const dotEnv = require('dotenv')
 
dotEnv.config()

require('./Routes/index.js')
 

const port = process.env.PORT || 3159;
app.listen(port, () => {console.log(`App listening on port ${port}`)})