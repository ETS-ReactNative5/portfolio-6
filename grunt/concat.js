   module.exports =  {

       //COMBINE FILES
           css: {
               src: [
                    '<%= paths.src.css %>/main.css',
                    '<%= paths.src.css %>/jquery.fancybox.css'
                ],
               dest: '<%= paths.dest.css %>/main.css'
           },

           js: {
               src: [
                    '<%= paths.src.js %>/socket.io.js',
                    '<%= paths.src.js %>/angular.min.js',
                    '<%= paths.src.js %>/angular-route.min.js',
                    '<%= paths.src.js %>/angular-sanitize.min.js',
                    '<%= paths.src.js %>/angular-aria.min.js',
                    '<%= paths.src.js %>/main.js',
                    '<%= paths.src.js %>/controllers.js'
                ],
               dest: '<%= paths.dest.js %>/build/angular_app.js',
           },
           libs: {
               src: [
                    '<%= paths.src.js %>/vendor/*.js'
                ],
               dest: '<%= paths.dest.js %>/build/libs.js',
           },
           plugins: {
               src: [
                    '<%= paths.src.js %>/plugins/*.js'
                ],
               dest: '<%= paths.dest.js %>/build/plugins.js',
           }
       
   };
               
               