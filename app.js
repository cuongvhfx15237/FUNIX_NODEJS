const http = require('http');

const server = http.createServer((req, res)=>{
    console.log(req)
})

// http.createServer(rqListener);
server.listen(3000);
