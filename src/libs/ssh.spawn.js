const {spawn} = require('child_process');

class Ssh{
    
    constructor(ip){
        this.ip =ip;
    }
    get tunel(){
        if(this.pipe==null){
            this.pipe= spawn("ssh",["-tt",this.ip]);
            return this.pipe;
        }
        return this.pipe;

    }
    static pipe(ip){
        return spawn("ssh",[ip]);
    }
}


module.exports=Ssh;
/*
const ls = spawn("ls",["-la"]);

ls.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
});
ls.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
});

ls.on('error', (error) => {
    console.log(`error: ${error.message}`);
});

ls.on("close", code => {
    console.log(`child process exited with code ${code}`);
});
*/