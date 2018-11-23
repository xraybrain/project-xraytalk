let mongoURI = "";

if(process.env.NODE_ENV === "production"){
  mongoURI = "mongodb://xraybrainOnXrayTalk:60534088(xraytalk)@ds115154.mlab.com:15154/xraytalk-prod";
} else {
  mongoURI = "mongodb://localhost:27017/xraytalk-dev"
}

module.exports = {mongoURI};