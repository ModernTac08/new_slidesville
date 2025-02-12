

const config = {
    user: 'SlidesvilleConnector',
    password: 'Weslevi-1003',
    server: 'JARVIS',
    database: 'Slidesville',
    options: {
     trustServerCertificate: true,
     trustedConnection:false,
     enableArithabort:true,
     instancename:"SQLEXPRESS",

   },
   port:1433
 };

 module.exports = config;

 