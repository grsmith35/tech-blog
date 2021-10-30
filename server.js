const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
//const session = require('express-session');
//const SequelizeStore = require('connect-session-sequelize')(session.Store);
//const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// const sess = {
//     secret : 'sumit secret',
//     cookies: {},
//     resave: false,
//     saveUnititialized: true,
//     store: new SequelizeStore({
//         db: sequelize
//     })
// };

//app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers/'));

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});