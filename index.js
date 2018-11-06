const app = require('express')();
const cors = require('cors');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

const port = process.env.PORT || 9000;

io.on('connection', function(socket) {
    console.log('a user connected')

    socket.on('disconnect', function () {
    });

    socket.on('set_color', function(value) {
        socket.emit('get_color', value);
    })

});

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});