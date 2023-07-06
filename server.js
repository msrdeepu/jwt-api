const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

const users = [
  {id:1, username:"Sandeep", password:"Sandeep123", isAdmin:true},
  {id:2, username:"Deepu", password:"Deepu123", isAdmin:false}
]



let refreshTokens = [];

//refresh Token
app.post("/api/refresh", (req, res) => {
  // Take the refresh token from the user
  const refreshToken = req.body.token;

  //Send error if there is no token or it's invalid
  if (!refreshToken) return res.status(403).json("You are not Authenticated!");

  //if everything is ok, create new access token, refresh token and send to user
});

// const generateAccessToken =

// login end point
app.post("/api/login", (request, response) => {
  const { username, password } = request.body;
  //find user
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    //generate an access token
    const accessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      "mySecretkey",
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      "myRefreshTokenSecretkey",
      { expiresIn: "15m" }
    );
    response.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
    });
  } else {
    response.status(400).json("Please check username and Password");
  }
});

const verify = (req,res,next) => {
  const authHeader = req.headers.authorization;
  if(authHeader){
      const token = authHeader.split(" ")[1];
      jwt.verify(token,"mySecretkey", (err,user) => {
        if(err){
          return res.status(403).json("The token is invalid")
        }
        req.user = user;
        next();
      })
  }else{
    res.status(401).json("You are not authenticated");
  }
}

app.delete("/api/users/:userId", verify, (req,res) => {
  if(req.user.id === req.params.userId || req.user.isAdmin){
    res.status(200).json("User has been removed succesfully");
  }else{
    res.status(403).json("You are not allowed to delete this user");
  }
})

// Start the server
app.listen(4000, () => {
  console.log('Server listening on port 4000');
});