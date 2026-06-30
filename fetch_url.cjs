const https = require('https');

https.get('https://reactdatatable.com', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      let bodyText = bodyMatch[1].replace(/<[^>]+>/g, ' \n').replace(/\s+/g, ' ').trim();
      console.log('Body snippet:', bodyText.substring(0, 3000));
    }
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
