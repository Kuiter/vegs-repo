const fs = require('fs');
var path = require('path');

function deleteFile(p, callback) {
  fs.unlink(p, (err) => {
    if (err) { throw err }
    callback()
  });
}

module.exports = {
  deleteFiles: function (paths) {
    return new Promise((resolve, reject) => {
      let deletions = Array.from({ length: paths.length }, paths.forEach(deletion => {
        return new Promise((res) => {
          deleteFile(deletion, res);
        })
      }));
      Promise.all(deletions)
        .then(() => {
          resolve();
        });
    });
  }

};