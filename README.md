# handlexpress

I wanted a handlebar static web generator.

### Features

 - Watch and Compiles a folder tree recursively preserving the structure using handlebars.
 - Handlebars support

### How it works

 - Compiles in memory handlebars partials files from partials folder. (Use the partial with name of the file without ext. Ex: partials/myproject1/sections/prj1-head.html becomes {{> prj1-head}} )

 - Copy (compiles) handlebars files from templates folder. (preserves the folder structure). Ex: If you have templates/index.html and templates/aboutus/index.html (both using handlebars syntax), the output will be the same, it only compiles the content.

 - Handlebars compilation errors do not break the node proccess.

 - Copies css from css folder to the output folder slash css. (preserves structure)

 - Custom json or js handlebars data load for using as context.

 ### Future improvements

 - Copies assets from asset folder to the output folder (preserves structure)

 - development GUI

 	- iframe web preview
    - cloud based editing using ACE editor.
 	- firebase (watch/build state sync for live reloading).
 	- install scripts using bower
 	- ftp deploy

 - Anything you propose is welcome

