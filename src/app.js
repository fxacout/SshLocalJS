const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http,{
    cors: {
      origin: '*'
    }
});
const port = 3000;
const Ssh = require('./libs/ssh.spawn');
app.get('/',(req,res)=>{
 res.sendFile(__dirname+'/frontend/index.html');
});
var ipIntroducida = false;
var ssh;

var generarChild = function(socket){
    ssh.tunel;
    ssh.tunel.stdout.on("data",(data)=>{
        socket.emit('output',data);
    });
    ssh.tunel.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });
    ssh.tunel.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });
    
    ssh.tunel.on("close", code => {
        console.log(`child process exited with code ${code}`);
    });
}


io.on('connection',(socket)=>{
    console.log("Se ha conectado un user");
    socket.emit('output',"Introduce la ip a la que te quieres conectar\n");

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });

    socket.on('command',(comm)=>{
        if(!ipIntroducida){
            ssh = new Ssh(comm);
            ipIntroducida=true;
            socket.emit('output','Ip introducida con éxito\n');
            generarChild(socket);
            return;
        }
        ssh.tunel.stdin.write(comm);
        console.log(comm);
    });
    socket.on('kill',(comm)=>{
        if(ssh&&ssh.tunel){
            ssh.tunel.kill();
            socket.emit('output','Sesión acabada\n');
            ipIntroducida=false;
            socket.emit('output',"Introduce la ip a la que te quieres conectar\n");

        }else{
            socket.emit('output','No hay aún una sesión');
        }
    });
});

http.listen(3000,()=>{
    console.log(`Listening on port ${port}`);
});

