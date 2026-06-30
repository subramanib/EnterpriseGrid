const fs = require('fs');
let content = fs.readFileSync('src/components/DataTableDemo.tsx', 'utf8');

// Replace String(col.name).toLowerCase() to String(col.id || col.name).toLowerCase()
content = content.replace(/const colId = col\.id \|\| String\(col\.name\)\.toLowerCase\(\);/g, 'const colId = String(col.id || col.name).toLowerCase();');
content = content.replace(/const colId = col\.id \|\| String\(col\.name\)\.toLowerCase\(\);/g, 'const colId = String(col.id || col.name).toLowerCase();');
content = content.replace(/c\.id \|\| String\(c\.name\)\.toLowerCase\(\)/g, 'String(c.id || c.name).toLowerCase()');
content = content.replace(/c => \(c\.id === defaultSortFieldId \|\| String\(c\.name\)\.toLowerCase\(\) === String\(defaultSortFieldId\)\.toLowerCase\(\)\)/g, 'c => (String(c.id || c.name).toLowerCase() === String(defaultSortFieldId).toLowerCase())');
content = content.replace(/nextCol\.id \|\| String\(nextCol\.name\)\.toLowerCase\(\)/g, 'String(nextCol.id || nextCol.name).toLowerCase()');

// There are more cases where col.id || String(col.name).toLowerCase() is used
content = content.replace(/col\.id \|\| String\(col\.name\)\.toLowerCase\(\)/g, 'String(col.id || col.name).toLowerCase()');

fs.writeFileSync('src/components/DataTableDemo.tsx', content);

let homeContent = fs.readFileSync('src/pages/Home.tsx', 'utf8');
homeContent = homeContent.replace(/editor: \{ type: 'number' \}/g, "editor: { type: 'number' as const }");
homeContent = homeContent.replace(/editor: \{ type: 'select'/g, "editor: { type: 'select' as const");
homeContent = homeContent.replace(/editor: \{ type: 'checkbox' \}/g, "editor: { type: 'checkbox' as const }");
homeContent = homeContent.replace(/editor: \{\n\s*type: 'custom',/g, "editor: {\n          type: 'custom' as const,");

fs.writeFileSync('src/pages/Home.tsx', homeContent);
