const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000

app.use('/public', express.static('public'));

app.use(express.urlencoded({ extended: true })); //middlewware
app.use(express.json()); 

app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    //defaultLayout: 'home.hbs',
    //layoutsDir: 'views'
}));

app.set('view engine', 'hbs');

const {db} = require('./database/db.js');

app.get('/search', async (req, res) => {
  try {
    console.log(req.query.name)
      await db.connect();
      const result = await db.request()
      .input('MADT', '1')
      .input('MACN', '1274549652')
      .execute(`usp_danhsach_MA`)
         // .input('MADT', req.query.name)
          //.execute(`usp_danhsach_DT`);
      const employees = result.recordset;
      console.log(result)
      console.log(employees)
      res.json(employees);
  } catch (error) {
      res.status(500).json(error);
  }
});

app.get('/', function (req, res) {
  // res.send('Hello World!');
  res.render('home');
});
const user = require('./routes/user.r.js')
app.use('/user', user);
const monanRoute = require('./routes/monan.r.js')
app.use('/monan', monanRoute);

const categoriesRoute = require('./routes/category.r.js')
app.use('/categories', categoriesRoute);

const productsRoute = require('./routes/product.r.js')
app.use('/products', productsRoute);

const productClientRoute = require('./routes/product-bycat.r.js')
app.use('/productClient', productClientRoute);
//route(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
