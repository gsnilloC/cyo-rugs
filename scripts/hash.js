const bcrypt = require("bcrypt");

const password = " ";
const saltRounds = 10; // You can adjust the salt rounds as needed

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Hashed Password:", hash);
  }
});
