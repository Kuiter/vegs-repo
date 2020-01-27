const sharp = require('sharp');
const path = require('path');

class Resize {
  constructor(filePath) {
    this.filePath = filePath;
    this.fileName = path.basename(filePath);
    this.outPath = this.filePath.replace(this.fileName, 'th_' + this.fileName);
  }

  generateThumbnail() {
    return new Promise((resolve, reject) => {
      sharp(this.filePath)
        .resize({ width: 175, height: 175 })
        .toFile(this.outPath, (err) => {
          if (err) { reject('Save failed'); }
          resolve(this.outPath)
        })
    })
  }
}

module.exports = Resize