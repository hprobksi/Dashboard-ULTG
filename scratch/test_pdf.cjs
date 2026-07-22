const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('C:\\Users\\rhard\\Documents\\DASHBOARD_AI\\Jadwal Pekerjaan R NR Juli.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text.substring(0, 1000));
}).catch(function(err) {
    console.error("Error reading PDF:", err);
});
