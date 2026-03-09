const fs = require('fs');
let data = fs.readFileSync('lib/bankHelplines.ts', 'utf8');
data = data.replace(/number: string;/g, 'numbers: string[];');
data = data.replace(/number:\s*'(.*?)'/g, "numbers: ['$1']");
data = data.replace(/number:\s*"(.*?)"/g, 'numbers: ["$1"]');
fs.writeFileSync('lib/bankHelplines.ts', data);
console.log('Update complete');
