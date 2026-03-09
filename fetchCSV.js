const https = require('https');
https.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vTC8_cqY4y-D_NAgVzZb7lqb-QZtHPFYnUSGUu8yhlPn6gSx4krPLsou321ao5u7Jlsb-XiaJlkdT-j/pub?output=csv', (res) => {
  let data = '';
  res.on('data', (d) => { data += d });
  res.on('end', () => { console.log(data) });
})
