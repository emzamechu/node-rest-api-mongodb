const http = require('http');
const app = require('./app');


const port = process.env.PORT || 3000;
const projectName = process.env.PROJECT_NAME;

const server = http.createServer(app);

server.listen(port, ()=>{
  console.log(projectName);
  console.log(`Server started on port: ${port}`);
})
