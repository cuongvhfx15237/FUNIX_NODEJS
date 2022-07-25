const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res)=>{

    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">SUbmit</button></form>></body>');
        res.write('</html>');
        return res.end();
    }
    if(url === "/message" && method === "POST"){
        fs.writeFileSync("message.txt", "DUMMY");
        res.statusCode = 302;
        res.setHeader("location","/")
        return res.end();
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();
});

// http.createServer(rqListener);
server.listen(3000);
