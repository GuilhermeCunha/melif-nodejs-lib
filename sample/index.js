const Melif = require('./Melif');

// Now you can use all the methods of melif!
var auth_url = Melif.getAuthUrl("http://localhost:3000/v1/authentication/authorize");
console.log(auth_url)