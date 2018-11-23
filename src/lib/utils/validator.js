/* Filename: User.js
 * Developer: Iwuji Jude
 * Description: This module is used to validate data captured in user inputs
 * Date: 07-Nov-2018
 * At: 4:26
 */

/**
 * module dependencies
 */
//-- this validates user inputs
const validator = require("validator");
//-- this is used to clean up user inputs to avoid cross site scripting (xss)
const sanitizer = require("xss");


class XrayValidator{
  //-- default constructor
  constructor(){
    this.sanitizer = sanitizer;
    this.validator = validator;
  }

  //-- removes an unnecessary whitespace
  removeWhiteSpace(input) {
    return input.replace(/ {2,}/g, " ");
  }

  //-- sanitize user input
  sanitize(input) {
    return this.sanitizer.escapeHtml(this.sanitizer.escapeDangerHtml5Entities(this.sanitizer.escapeQuote(this.removeWhiteSpace(input.trim()))));
  }

  isEmail(input){
    return this.validator.isEmail(this.sanitize(input));
  }

  isRealName(input){
    let pattern = /^(([a-zA-Z]+?)([0-9]*?)){3,30}$/g;

    return pattern.test(this.sanitize(input));
  }

  isRealStatus(input){
    let pattern = /^([A-Za-z]+? {0,1})([A-Za-z0-9]+? {0,1})+?\.?$/g;

    return pattern.test(this.sanitize(input));
  }

  isRealPassword(input){
    let pattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,10}/g

    return pattern.test(this.sanitize(input));
  }

  isEmpty(input){
    let empty = false;

    if((input === null || input === '')){
      empty = true;
    }

    return empty;
  }
}

module.exports = new XrayValidator();