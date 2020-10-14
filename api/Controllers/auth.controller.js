const authService = require('../Services/auth.service');

exports.signUp = function(req, res){
  let register = authService.signUp(req.body, 
    function(err, result){
      if(err)
        res.send(err);
      res.send(result);
    });
};

exports.logIn = function(req, res) {
  let login = authService.logIn(req.body, 
    function(err, result){
      if(err)
        res.send(err)
      res.send(result);
    });
};

exports.validate_token = function(req, res){
  let validate = authService.Validate(req.body.token, 
    function(err, result){
      if(err)
        res.send(err.message);
      res.send(result);
    });
};
