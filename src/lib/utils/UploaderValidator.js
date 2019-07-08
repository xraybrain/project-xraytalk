/**
 * Module dependencies
 */
const fs = require('fs');
const path = require('path');

/**
 * 
 * @param {Number} allowedSize 
 * @param {Number} fileSize 
 */
function isFileSizeOk(check,allowedSize, fileSize){
  let sizeOk = false;

  switch(check){
    case '<': //-- checks for minimum filesize
      sizeOk = fileSize > allowedSize;
      break;
    case '>':
      sizeOk = fileSize <= allowedSize;
      break;
  }
  return sizeOk;
}

/**
 * 
 * @param {[]} allowedMimeType 
 * @param {String} mimeType 
 */
function isAllowedMimeType(allowedMimeType=[], mimeType){
  let isAllowed = false; //-- assumes the mimeType is not allowed

  if(allowedMimeType instanceof Array){ //-- ensure that allowedMimeType is Array

    for(item of allowedMimeType){
      if(item === mimeType){
        //-- the mimeType is allowed break out of loop
        isAllowed = true;
        break;
      }
    }

  }

  return isAllowed;
}

function fileExists(filePath, fileName){
  return fs.existsSync(path.join(filePath, fileName));
}

module.exports = {isFileSizeOk, isAllowedMimeType, fileExists};