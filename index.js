const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.PORT || 9000;
const ConnectedUsers = {};

app.post('/event', function(request, response) {
    setTimeout(function() {
        if (!request.body.recipients.length) {
            io.emit(request.body.event, request.body.data);
            return response.json({success:true});
        }

        request.body.recipients.forEach(function(userId) {
            io.to(ConnectedUsers[userId]).emit(
                request.body.event,
                request.body.data
            );
        });
    }, 0);

    return response.json({success:true});
});

io.on('connection', function(socket) {
    let id = socket.handshake.query.userId;
    socket.emit('online-users', getUsers());
    ConnectedUsers[id] = socket.id;
    socket.broadcast.emit('connected', {id:id});

    console.log(id);

    socket.on('disconnect', function () {
        delete ConnectedUsers[id];
        io.emit('disconnected', {id:id});
    });

});

function getUsers() {
    let users = [];
    for (var i in ConnectedUsers) {
        users.push({id:i});
    }
    return users;
}

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});