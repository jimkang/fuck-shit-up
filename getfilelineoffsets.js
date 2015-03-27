var lineChomper = require('line-chomper');

if (process.argv.length < 3) {
  console.log('Usage: node getfilelineoffsets.js <filename>');
  process.exit();
}

var filename = process.argv[2];

lineChomper.mapLineOffsets(filename, function (err, lineOffsets) {
    console.log(JSON.stringify(lineOffsets, null, '  '));
});
