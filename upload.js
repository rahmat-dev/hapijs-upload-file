const fs = require('fs');
const path = require('path');

const uploadImage = (data) =>
  new Promise((resolve, reject) => {
    // menentukan nama dan folder berkas
    const fileExt = data.hapi.filename.split('.').slice(-1)[0]; // shorthand to get last element of array
    const filename = `${Date.now()}.${fileExt}`;
    const directory = path.resolve(__dirname, 'uploads');
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory); // membuat folder bila belum ada
    }

    // membuat writeable stream
    const location = `${directory}/${filename}`;
    const fileStream = fs.createWriteStream(location);

    try {
      // mengembalikan Promise.reject ketika terjadi error
      fileStream.on('error', (error) => reject(error));

      // membaca Readable (data) dan menulis ke Writable (fileStream)
      data.pipe(fileStream);

      // setelah selesai membaca Readable (data) maka mengembalikan nama berkas
      data.on('end', () => resolve(filename));
    } catch (error) {
      reject(error);
    }
  });

module.exports = { uploadImage };
