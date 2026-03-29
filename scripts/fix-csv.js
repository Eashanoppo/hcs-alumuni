// scripts/fix-csv.js
const fs = require('fs');
const xlsx = require('xlsx');

// usage: node scripts/fix-csv.js target.csv fixed.csv
const inputFile = process.argv[2];
const outputFile = process.argv[3] || 'fixed-output.csv';

if (!inputFile || !fs.existsSync(inputFile)) {
    console.error("Please provide your CSV file path.");
    console.error("Example usage: node scripts/fix-csv.js my-alumni-data.csv");
    process.exit(1);
}

console.log(`Reading CSV file: ${inputFile}...`);

const workbook = xlsx.readFile(inputFile);
const sheetName = workbook.SheetNames[0];
// Reading as raw text to prevent automatic date morphing by the library
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });

let fixedCount = 0;

for (let row of data) {
    // Modify 'dob' field if it exists. Note: check if your CSV uses 'dob' or 'Date of Birth' as the column header.
    let dobField = row['dob'] !== undefined ? 'dob' : (row['Date of Birth'] !== undefined ? 'Date of Birth' : null);

    if (dobField && row[dobField]) {
        let dob = row[dobField].trim();
        let originalDob = dob;

        if (dob.includes('/')) {
            let parts = dob.split('/');
            
            // Assume CSV was exported as mm/dd/yy or mm/dd/yyyy
            let [m, d, y] = parts;

            if (y && y.length === 2) {
               let yearNum = parseInt(y);
               y = yearNum > 30 ? `19${y}` : `20${y}`;
            }
            
            row[dobField] = `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
            
            if (row[dobField] !== originalDob) {
              fixedCount++;
            }
        }
    }
}

const newSheet = xlsx.utils.json_to_sheet(data);
const newWorkbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(newWorkbook, newSheet, "Sheet1");
xlsx.writeFile(newWorkbook, outputFile);

console.log(`Successfully fixed ${fixedCount} dates of birth.`);
console.log(`Saved new CSV to: ${outputFile}`);
console.log(`You can now import ${outputFile} directly into Supabase!`);
