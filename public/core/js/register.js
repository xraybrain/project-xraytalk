$(document).ready(function () {
  /**
  *  UI: retireves the User Interface handles
  */
  var UI = (function () {
    //-- the userName interface handles
    var userNameObj = $('#userName');
    var status0 = $('#status0');
    var userNameStatusBox = $('#userNameStatusBox');

    //-- the email interface handles
    var emailAddressObj = $('#emailAddress');
    var status1 = $('#status1');
    var emailStatusBox = $('#emailStatusBox');

    //-- the password interface handles
    var passwordObj = $('#password');
    var status2 = $('#status2');
    var passwordStatusBox = $('#passwordStatusBox');

    //-- the confirm password interface handles
    var confirmPasswordObj = $('#confirmPassword');
    var status3 = $('#status3');
    var confirmPasswordStatusBox = $('#confirmPasswordStatusBox');

    return {
      userNameObj: userNameObj,
      status0: status0,
      userNameStatusBox: userNameStatusBox,

      emailAddressObj: emailAddressObj,
      status1: status1,
      emailStatusBox: emailStatusBox,

      passwordObj:  passwordObj,
      status2: status2,
      passwordStatusBox: passwordStatusBox,

      confirmPasswordObj: confirmPasswordObj,
      status3: status3,
      confirmPasswordStatusBox: confirmPasswordStatusBox
    }
  })();


  /**
   * Validator: validates the user input.
   */
  var Validator = (function () {
    function isRealName(name){
      var pattern = /^(([a-zA-Z]+?)([0-9]*?)){3,30}$/g;

      return pattern.test(name);
    }

    function isRealEmail(email){
      var pattern = /^(\w)+?\@(\w)+?\.(com|net|hotmail)$/g;

      return pattern.test(email);
    }

    function isRealPassword(password){
      var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,16}$/;

      return pattern.test(password)
    }

    return {
      isRealName: isRealName,
      isRealEmail: isRealEmail,
      isRealPassword: isRealPassword
    }
  })();

  //-- handles the app logics
  var xraytalkApp = (function(UI, Validator){
    
    function config(){
      //-- Register event listener for userName
      UI.userNameObj.on('keyup', function(e){
        if(Validator.isRealName(UI.userNameObj.val())){
          UI.status0.removeClass('ion-close');
          UI.status0.addClass('ion-checkmark');
          UI.userNameStatusBox.css('background-color', 'rgb(0,200,0)');
        } else {
          UI.status0.removeClass('ion-checkmark');
          UI.status0.addClass('ion-close');
          UI.userNameStatusBox.css('background-color', 'rgb(255,0,0)');
        }

      })

      //-- Register event lister for emailAddress
      UI.emailAddressObj.on('keyup', function(e){
        if(Validator.isRealEmail(UI.emailAddressObj.val())){
          UI.status1.removeClass('ion-close');
          UI.status1.addClass('ion-checkmark');
          UI.emailStatusBox.css('background-color', 'rgb(0,200,0)');
        } else {
          UI.status1.removeClass('ion-checkmark');
          UI.status1.addClass('ion-close');
          UI.emailStatusBox.css('background-color', 'rgb(255,0,0)');
        }
      })

      //-- Password event lister for password
      UI.passwordObj.on('keyup', function(e){
        if(Validator.isRealPassword(UI.passwordObj.val())){
          UI.status2.removeClass('ion-close');
          UI.status2.addClass('ion-checkmark');
          UI.passwordStatusBox.css('background-color', 'rgb(0,255,0)');
        } else {
          UI.status2.removeClass('ion-checkmark');
          UI.status2.addClass('ion-close');
          UI.passwordStatusBox.css('background-color', 'rgb(255,0,0)');
        }
      });

      //-- Password event lister for password
      UI.confirmPasswordObj.on('keyup', function(e){
        if(UI.passwordObj.val() === UI.confirmPasswordObj.val()){
          UI.status3.removeClass('ion-close');
          UI.status3.addClass('ion-checkmark');
          UI.confirmPasswordStatusBox.css('background-color', 'rgb(0,255,0)');
        } else {
          UI.status3.removeClass('ion-checkmark');
          UI.status3.addClass('ion-close');
          UI.confirmPasswordStatusBox.css('background-color', 'rgb(255,0,0)');
        }
      });


    }
    
    return {
      config: config
    };
  })(UI, Validator);

  xraytalkApp.config();
});