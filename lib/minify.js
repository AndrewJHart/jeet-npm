// Generated by CoffeeScript 1.6.3
(function() {
  var exports, fs, getFiles, uglify;

  uglify = require("uglify-js");

  fs = require("fs");

  getFiles = function(dir, done) {
    var results;
    results = [];
    return fs.readdir(dir, function(err, list) {
      var i, next;
      if (err) {
        return done(err);
      }
      i = 0;
      return (next = function() {
        var file;
        file = list[i++];
        if (!file) {
          return done(null, results);
        }
        if (file.charAt(0) === "." || file === "minified.js" || file.substr(0, 6) === "jquery" || file.substr(0, 9) === "modernizr" || file.substr(0, 11) === "selectivizr") {
          return next();
        } else {
          file = dir + '/' + file;
          return fs.stat(file, function(err, stat) {
            if (stat && stat.isDirectory()) {
              return getFiles(file, function(err, res) {
                results = results.concat(res);
                return next();
              });
            } else {
              if (file.substr(-3) === ".js") {
                results.push(file);
              }
              return next();
            }
          });
        }
      })();
    });
  };

  exports = module.exports = function(path) {
    return getFiles(path, function(err, files) {
      var code, e, end, file, i, line, lines, start, stream, toplevel, _i, _len;
      toplevel = null;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        code = fs.readFileSync(file).toString();
        try {
          toplevel = uglify.parse(code, {
            filename: file,
            toplevel: toplevel
          });
        } catch (_error) {
          e = _error;
          console.log("\x1B[0;31mJS Error\x1B[0;0m in \x1B[0;1m" + file.split("/").pop() + "\x1B[0;0m on line \x1B[0;1m" + e.line + "\x1B[0;0m");
          console.log("````````````````````````````````````");
          code = code.split("\n");
          if (code[code.length - 1] === "") {
            code.pop();
          }
          lines = code.length;
          start = Math.max(0, e.line - 3);
          end = start + 5;
          if (end > lines) {
            if (start > 1 && (end - lines) > 1) {
              start -= 2;
              end = Math.min(end - 2, lines);
            } else if (start > 0) {
              start -= 1;
              end = Math.min(end - 1, lines);
            } else {
              end = lines;
            }
          }
          code = code.slice(start, end);
          for (i in code) {
            line = code[i];
            i++;
            i += start;
            if (i === e.line) {
              console.log("\x1B[0;1m > " + i + "| " + line + "\x1B[0;0m");
            } else {
              console.log("   " + i + "| " + line);
            }
          }
          console.log("\n\x1B[0;31m" + e.message + "\x1B[0;0m");
          console.log("````````````````````````````````````");
          return;
        }
      }
      stream = uglify.OutputStream({});
      toplevel.print(stream);
      fs.writeFileSync(path + "/minified.js", stream.toString());
      return console.log("Recompiled JS into minified.js");
    });
  };

}).call(this);