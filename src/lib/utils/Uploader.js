/**
 * Module dependencies
 */
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');

//-- Load UploadValidator
const {
  isFileSizeOk,
  isAllowedMimeType,
  fileExists
} = require('./UploaderValidator');

//***************************************************/
//--** Perform a file upload
function upload(req, res, next, option = null) {
  if (option === null || option === undefined) {
    option = {
      targetUploadDir: path.join(__dirname, '../', 'public/core/upload'),
      relativeDir: '/core/upload',
      isAjaxCall: false,
      successRedirect: '/',
      failureRedirect: '/'
    };
  }
  if (option.allowedMimeType === undefined || option.allowedMimeType === null) {
    option.allowedMimeType = ['image/jpg', 'image/jpeg', 'image/png'];
  }

  //-- The instansiate the formidable object.
  let form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {

    if (files.fileToUpload !== undefined) {
      let tempPath = files.fileToUpload.path;
      let targetUploadDir = option.targetUploadDir;
      let fileSize = files.fileToUpload.size;
      let fileMimeType = files.fileToUpload.type;
      let fileName = files.fileToUpload.name;

      //-- setup file upload directives
      let allowedMimeType = option.allowedMimeType;
      let minFileSize = 81920; /* 81920b == 80kb */
      let maxFileSize = 5242880; /* 5242880b == 5mb */

      let uploadOk = true;
      let errMsg = null;

      if (!isFileSizeOk('<', minFileSize, fileSize)) {
        uploadOk = false;
        errMsg = {
          status: 0,
          'message': 'Filesize too small, min allowed is 200kb'
        };
        res.send(errMsg);
      }

      //-- to avoid resending and header errors check if no error has been commited
      if (uploadOk) {
        if (!isFileSizeOk('>', maxFileSize, fileSize)) {
          uploadOk = false;
          errMsg = {
            status: 0,
            'message': 'Filesize too large, max allowed is 2mb'
          };
          res.send(errMsg);
        }
      }

      if (uploadOk) {
        if (!isAllowedMimeType(allowedMimeType, fileMimeType)) {
          uploadOk = false;
          errMsg = {
            status: 0,
            'message': 'File Type not allowed, allowed types jpeg, jpg, and png'
          };

          res.send(errMsg);
        }
      }

      if (uploadOk) {
        //-- check if file exists
        if (fileExists(targetUploadDir, fileName)) {
          console.log('fileExists');
          res.redirect(successRedirect);
        } else {
          //-- get all the files in the specified directory
          fs.readdir(targetUploadDir, (err, filesInDir) => {

            if (err) throw err;

            let totalFiles = filesInDir.length + 1; //-- total files in this dir + 1

            let newFileName = 'xt' + totalFiles + path.extname(fileName);
            let relativeDir = option.relativeDir;

            relativeDir = path.join(relativeDir, newFileName);

            //-- Perform the file upload
            fs.readFile(tempPath, (err, data) => {
              if (err) throw err;

              //-- rename fileToUpload
              targetUploadDir = path.join(targetUploadDir, newFileName);

              fs.writeFile(targetUploadDir, data, (err) => {
                if (err) throw err;
                let userID = false;

                if(req.user){ //-- check if user has logged in
                  userID = req.user.id;
                }

                if (option.isAjaxCall) {
                  //-- no page refresh
                  res.send({
                    status: 1,
                    profilePics: relativeDir
                  });
                } else {
                  //-- page is refreshed
                  req.flash('success_msg', 'File upload success.')
                  res.redirect(successRedirect)
                }

                //-- add this to DB
                if (option.User && userID) {
                  option.User.findOne({
                      _id: userID
                    })
                    .then(user => {
                      user.pictureDir = relativeDir;
                      user.save();
                    })
                }
              });
            });
          });
        }
      }
    } else {
      if (option.isAjaxCall) {
        res.send({
          status: 0,
          message: 'You must select a file.'
        });
      } else {
        req.flash('success_msg', 'You must select a file.');
        res.redirect(option.successRedirect);
      }
    }
  });
}

module.exports = {
  upload
};