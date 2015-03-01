// Gruntfile with the configuration of grunt-express and grunt-open. No livereload yet!
module.exports = function(grunt) {

  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // FTP deploy
  grunt.loadNpmTasks('grunt-sftp-deploy');

  // Configure Grunt
  grunt.initConfig({

    // grunt-express will serve the files from the folders listed in `bases`
    // on specified `port` and `hostname`
    express: {
      all: {
        options: {
          port: 9000,
          hostname: "0.0.0.0",
          bases: ["app"], // Replace with the directory you want the files served from
                              // Make sure you don't use `.` or `..` in the path as Express
                              // is likely to return 403 Forbidden responses if you do
                              // http://stackoverflow.com/questions/14594121/express-res-sendfile-throwing-forbidden-error
          livereload: true
        }
      }
    },

    // grunt-watch will monitor the projects files
    watch: {
      all: {
        // Replace with whatever file you want to trigger the update from
        // Either as a String for a single entry
        // or an Array of String for multiple entries
        // You can use globing patterns like `css/**/*.css`
        // See https://github.com/gruntjs/grunt-contrib-watch#files
        files: 'index.html',
        options: {
          livereload: true
        }
      }
    },

    // grunt-open will open your browser at the project's URL
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= express.all.options.port%>'
      }
    },

    'sftp-deploy': {
      build: {
        auth: {
          host: 'ftp.flyingblogspot.com',
          port: 22,
          authKey: 'key1'
          },
          cache: 'sftpCache.json',
          src: __dirname + '/app/',
          dest: '/home/flyingbl/public_html/lostfestivalofperth',
          exclusions: [__dirname + '/app/**/.DS_Store', __dirname + '/app/**/Thumbs.db', 'app/tmp'],
          serverSep: '/',
          concurrency: 8,
          progress: true
        }
    }
  });

  // Creates the `server` task
  grunt.registerTask('server', [
    'express',
    'open',
    'watch'
  ]);
};
