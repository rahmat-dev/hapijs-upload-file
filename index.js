const Hapi = require('@hapi/hapi');

const { uploadImage } = require('./upload');

const init = async () => {
  const server = Hapi.server({
    host: 'localhost',
    port: 5000,
  });

  server.route({
    method: 'POST',
    path: '/uploads',
    handler: async (request, h) => {
      try {
        const { images } = request.payload;

        if (images.length > 0) {
          images.map(async (image) => await uploadImage(image));
        } else {
          await uploadImage(images);
        }

        return h
          .response({
            status: 'success',
            message: 'Berhasil mengupload gambar',
          })
          .code(200);
      } catch (error) {
        return h.response({
          status: 'error',
          message: error.message,
        });
      }
    },
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 500 * 1024, // maximal filesize: 500KB
      },
    },
  });

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

init();
