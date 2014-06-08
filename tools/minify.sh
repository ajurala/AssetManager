# Minify assetmanager js
rm ../ui/js/assetmanager/assetmanager.min.js

cat ../ui/js/assetmanager/*.js > assetmanager.js

ngmin assetmanager.js assetmanager.premin.js

java -jar compiler.jar --js assetmanager.premin.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file ../ui/js/assetmanager/assetmanager.min.js

# Minify color picker

java -jar compiler.jar --js ../ui/js/angular-ui-bootstrap/bootstrap-colorpicker-module.js --compilation_level SIMPLE_OPTIMIZATIONS --js_output_file ../ui/js/angular-ui-bootstrap/bootstrap-colorpicker-module.min.js