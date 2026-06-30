const fs = require('fs');
let content = fs.readFileSync('src/components/DataTableDemo.tsx', 'utf8');
content = content.replace(/col\.name\.toLowerCase\(\)/g, 'String(col.name).toLowerCase()');
content = content.replace(/c\.name\.toLowerCase\(\)/g, 'String(c.name).toLowerCase()');
content = content.replace(/nextCol\.name\.toLowerCase\(\)/g, 'String(nextCol.name).toLowerCase()');
fs.writeFileSync('src/components/DataTableDemo.tsx', content);

let homeContent = fs.readFileSync('src/pages/Home.tsx', 'utf8');
homeContent = homeContent.replace(/col\.name\.toLowerCase\(\)/g, 'String(col.name).toLowerCase()');
fs.writeFileSync('src/pages/Home.tsx', homeContent);
