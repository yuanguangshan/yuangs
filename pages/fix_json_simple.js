const fs = require('fs');

// This script converts JavaScript object notation to proper JSON format
// Usage: node fix_json.js

function convertJSObjectToJSON(inputFile, outputFile) {
  if (!inputFile) inputFile = './dailywords.json';
  if (!outputFile) outputFile = './dailywords_fixed.json';
  
  console.log('Converting JavaScript object to proper JSON...');
  
  // Read the file
  let content = fs.readFileSync(inputFile, 'utf8');
  
  // Remove trailing commas (JavaScript allows them, JSON doesn't)
  content = content.replace(/,\s*([}\]])/g, '$1');
  
  // Add quotes to unquoted keys
  content = content
    .replace(/([{,]\s*)([a-zA-Z_\$][a-zA-Z0-9_\$]*)\s*(?=\s*:)/g, '$1"$2"')
    .replace(/^(s*)([a-zA-Z_\$][a-zA-Z0-9_\$]*)\s*(?=\s*:)/m, '$1"$2"');
  
  try {
    // Parse as JSON to validate
    const obj = JSON.parse(content);
    
    // Write formatted JSON
    fs.writeFileSync(outputFile, JSON.stringify(obj, null, 2), 'utf8');
    
    console.log('✅ Successfully converted to JSON:', outputFile);
  } catch (e) {
    console.error('❌ Error parsing JSON:', e.message);
    
    // For cases where there are still unescaped quotes in string values,
    // manual fix may be needed for the specific data
    console.log('💡 If conversion fails, manually fix unescaped quotes in string values');
    fs.writeFileSync(outputFile.replace('.json', '_unfixed.json'), content, 'utf8');
    console.log('📋 Unfixed content saved for manual editing');
  }
}

// Run if called directly
if (require.main === module) {
  convertJSObjectToJSON();
}

module.exports = { convertJSObjectToJSON };
