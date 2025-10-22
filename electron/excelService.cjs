const ExcelJS = require('exceljs');

async function generateMatchReportExcel(report) {
    const { headers, data, modelStructure } = report;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Match Report');

    const headerRow1Values = ['Nº', 'Jogador'];
    const headerRow2Values = ['', ''];
    const categoryNames = Object.keys(headers);
    const efColumns = [];
    const coefColumns = [];

    const header1Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D223F' } };
    const header1Font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };
    const header2Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF27A174' } };
    const header2Font = { color: { argb: 'FF0D223F' }, bold: true, size: 10 };

    categoryNames.forEach(catName => {
        const subCats = headers[catName];
        headerRow1Values.push(catName, ...Array(subCats.length + 1).fill(null));
        headerRow2Values.push('Total', ...subCats, 'EF%', 'Coef.');
    });

    worksheet.addRow(headerRow1Values);
    worksheet.addRow(headerRow2Values);

    let currentColNum = 3;
    categoryNames.forEach(catName => {
        const subCatsCount = headers[catName].length;
        worksheet.getCell(1, currentColNum).value = catName;
        worksheet.mergeCells(1, currentColNum, 1, currentColNum + subCatsCount + 2);

        efColumns.push(worksheet.getColumn(currentColNum + subCatsCount + 1).letter);
        coefColumns.push(worksheet.getColumn(currentColNum + subCatsCount + 2).letter);
        currentColNum += subCatsCount + 3;
    });

    data.forEach(playerRow => {
        const row = worksheet.addRow([]);
        row.getCell(1).value = playerRow.playerNumber;
        row.getCell(2).value = playerRow.playerName;

        let startColNum = 3;
        categoryNames.forEach(catName => {
            const totalCell = row.getCell(startColNum);
            const startRangeCol = worksheet.getColumn(startColNum + 1).letter;
            const endRangeCol = worksheet.getColumn(startColNum + headers[catName].length).letter;
            totalCell.value = { formula: `SUM(${startRangeCol}${row.number}:${endRangeCol}${row.number})` };

            headers[catName].forEach((subCat, index) => {
                row.getCell(startColNum + 1 + index).value = playerRow.actions[catName][subCat];
            });

            const weights = headers[catName].map(subCatName => {
                const subCatInfo = modelStructure.find(s => s.categoryName === catName && s.subCategoryName === subCatName);
                return subCatInfo ? subCatInfo.subCategoryWeight : 0;
            });
            let formulaParts = [];
            for (let i = 0; i < weights.length; i++) {
                const colLetter = worksheet.getColumn(startColNum + 1 + i).letter;
                formulaParts.push(`${colLetter}${row.number}*${weights[i]}`);
            }
            const efFormula = `IF(${totalCell.address}>0, (${formulaParts.join(' + ')}) / (${totalCell.address}*10), 0)`;
            row.getCell(startColNum + headers[catName].length + 1).value = { formula: efFormula };

            const mostPositiveSubCat = modelStructure
                .filter(s => s.categoryName === catName)
                .reduce((max, sub) => (sub.subCategoryWeight > max.subCategoryWeight ? sub : max));

            const subCatIndex = headers[catName].indexOf(mostPositiveSubCat.subCategoryName);

            const positiveActionColLetter = worksheet.getColumn(startColNum + 1 + subCatIndex).letter;
            const positiveActionCellAddress = `${positiveActionColLetter}${row.number}`;

            const coefFormula = `IFERROR(${totalCell.address}/${positiveActionCellAddress}, 0)`;
            row.getCell(startColNum + headers[catName].length + 2).value = { formula: coefFormula };

            startColNum += headers[catName].length + 3;
        });
    });

    let absTotalRow;
    const firstDataRow = 3;
    const lastDataRow = worksheet.lastRow.number;
    if (lastDataRow >= firstDataRow) {
        absTotalRow = worksheet.addRow([]);
        absTotalRow.getCell(2).value = 'TOTAL';
        absTotalRow.font = { bold: true };

        let startColNum = 3;
        categoryNames.forEach(catName => {
            const subCats = headers[catName];
            const totalColLetter = worksheet.getColumn(startColNum).letter;
            absTotalRow.getCell(startColNum).value = { formula: `SUM(${totalColLetter}${firstDataRow}:${totalColLetter}${lastDataRow})` };
            for (let i = 0; i < subCats.length; i++) {
                const subCatColLetter = worksheet.getColumn(startColNum + 1 + i).letter;
                absTotalRow.getCell(startColNum + 1 + i).value = { formula: `SUM(${subCatColLetter}${firstDataRow}:${subCatColLetter}${lastDataRow})` };
            }
            const totalCellAddress = `${totalColLetter}${absTotalRow.number}`;
            const weights = subCats.map(subCatName => {
                const subCatInfo = modelStructure.find(s => s.categoryName === catName && s.subCategoryName === subCatName);
                return subCatInfo ? subCatInfo.subCategoryWeight : 0;
            });
            let formulaParts = [];
            for (let i = 0; i < weights.length; i++) {
                const colLetter = worksheet.getColumn(startColNum + 1 + i).letter;
                formulaParts.push(`${colLetter}${absTotalRow.number}*${weights[i]}`);
            }
            const efFormula = `IF(${totalCellAddress}>0, (${formulaParts.join(' + ')}) / (${totalCellAddress}*10), 0)`;
            absTotalRow.getCell(startColNum + subCats.length + 1).value = { formula: efFormula };
            const mostPositiveSubCat = modelStructure
                .filter(s => s.categoryName === catName)
                .reduce((max, sub) => (sub.subCategoryWeight > max.subCategoryWeight ? sub : max));
            const subCatIndex = subCats.indexOf(mostPositiveSubCat.subCategoryName);
            const positiveActionColLetter = worksheet.getColumn(startColNum + 1 + subCatIndex).letter;
            const positiveActionCellAddress = `${positiveActionColLetter}${absTotalRow.number}`;
            const coefFormula = `IFERROR(${totalCellAddress}/${positiveActionCellAddress}, 0)`;
            absTotalRow.getCell(startColNum + subCats.length + 2).value = { formula: coefFormula };
            startColNum += subCats.length + 3;
        });
    }

    worksheet.addRow([]);
    const freqTitleRow = worksheet.addRow(['FREQUÊNCIAS / PARTICIPAÇÃO (%)']);
    worksheet.mergeCells(freqTitleRow.number, 1, freqTitleRow.number, worksheet.columnCount);

    const freqHeader1Values = ['Nº', 'Jogador'];
    const freqHeader2Values = ['', ''];
    let freqColumnCount = 2;
    categoryNames.forEach(catName => {
        const subCats = headers[catName];
        freqHeader1Values.push(catName, ...Array(subCats.length).fill(null));
        freqHeader2Values.push('Total', ...subCats);
        freqColumnCount += subCats.length + 1;
    });

    const freqHeader1Row = worksheet.addRow(freqHeader1Values);
    const freqHeader2Row = worksheet.addRow(freqHeader2Values);
    const freqTableStartRow = freqHeader1Row.number;

    currentColNum = 3;
    categoryNames.forEach(catName => {
        const subCatsCount = headers[catName].length;
        worksheet.getCell(freqHeader1Row.number, currentColNum).value = catName;
        worksheet.mergeCells(freqHeader1Row.number, currentColNum, freqHeader1Row.number, currentColNum + subCatsCount);

        currentColNum += subCatsCount + 1;
    });

    data.forEach((playerRow, index) => {
        const absValuesRowNumber = firstDataRow + index;
        const freqRow = worksheet.addRow([]);
        freqRow.getCell(1).value = playerRow.playerNumber;
        freqRow.getCell(2).value = playerRow.playerName;

        let startColNumAbs = 3;
        let startColNumFreq = 3;
        categoryNames.forEach(catName => {
            const totalColLetterAbs = worksheet.getColumn(startColNumAbs).letter;
            const playerTotalCellAddressAbs = `${totalColLetterAbs}${absValuesRowNumber}`;
            const teamTotalCellAddressAbs = `${totalColLetterAbs}$${absTotalRow.number}`;

            const participationFormula = `IFERROR(${playerTotalCellAddressAbs}/${teamTotalCellAddressAbs}, 0)`;
            freqRow.getCell(startColNumFreq).value = { formula: participationFormula };

            headers[catName].forEach((subCat, subIndex) => {
                const subCatColLetter = worksheet.getColumn(startColNumAbs + 1 + subIndex).letter;
                const subCatCellAddressAbs = `${subCatColLetter}${absValuesRowNumber}`;
                const formula = `IF(${playerTotalCellAddressAbs}>0, ${subCatCellAddressAbs}/${playerTotalCellAddressAbs}, 0)`;
                freqRow.getCell(startColNumFreq + 1 + subIndex).value = { formula };
            });

            startColNumAbs += headers[catName].length + 3;
            startColNumFreq += headers[catName].length + 1;
        });
    });

    if (absTotalRow) {
        const freqTotalRow = worksheet.addRow([]);
        freqTotalRow.getCell(2).value = 'TOTAL';
        freqTotalRow.font = { bold: true };

        let startColNumAbs = 3;
        let startColNumFreq = 3;
        categoryNames.forEach(catName => {
            const totalColLetterAbs = worksheet.getColumn(startColNumAbs).letter;
            const teamTotalCellAddressAbs = `${totalColLetterAbs}${absTotalRow.number}`;

            freqTotalRow.getCell(startColNumFreq).value = { formula: `IF(${teamTotalCellAddressAbs}>0, 1, 0)`};

            headers[catName].forEach((subCat, subIndex) => {
                const subCatColLetter = worksheet.getColumn(startColNumAbs + 1 + subIndex).letter;
                const teamSubCatCellAddressAbs = `${subCatColLetter}${absTotalRow.number}`;
                const formula = `IF(${teamTotalCellAddressAbs}>0, ${teamSubCatCellAddressAbs}/${teamTotalCellAddressAbs}, 0)`;
                freqTotalRow.getCell(startColNumFreq + 1 + subIndex).value = { formula };
            });
            startColNumAbs += headers[catName].length + 3;
            startColNumFreq += headers[catName].length + 1;
        });
    }

    worksheet.getColumn('A').width = 5;
    worksheet.getColumn('B').width = 25;
    for (let i = 3; i <= worksheet.columnCount; i++) {
        worksheet.getColumn(i).width = 8;
    }

    efColumns.forEach(colLetter => { worksheet.getColumn(colLetter).numFmt = '0%'; });
    coefColumns.forEach(colLetter => { worksheet.getColumn(colLetter).numFmt = '0.00'; });

    const lastColumn = worksheet.columnCount;

    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        row.height = 20;

        if (rowNumber === 1) {
            for (let i = 1; i <= lastColumn; i++) {
                const cell = row.getCell(i);
                cell.fill = header1Fill;
                cell.font = header1Font;
            }
        }
        if (rowNumber === 2) {
            for (let i = 1; i <= lastColumn; i++) {
                const cell = row.getCell(i);
                cell.fill = header2Fill;
                cell.font = header2Font;
            }
        }

        if (rowNumber === freqHeader1Row.number) {
            for (let i = 1; i <= freqColumnCount; i++) {
                const cell = row.getCell(i);
                cell.fill = header1Fill;
                cell.font = header1Font;
            }
        }
        if (rowNumber === freqHeader2Row.number) {
            for (let i = 1; i <= freqColumnCount; i++) {
                const cell = row.getCell(i);
                cell.fill = header2Fill;
                cell.font = header2Font;
            }
        }

        if (absTotalRow && rowNumber === absTotalRow.number) {
            row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEEEE' } };
        }

        if (rowNumber >= freqTableStartRow) {
            const freqTotalRow = worksheet.lastRow;
            if (rowNumber === freqTotalRow.number) {
                row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEEEE' } };
            }

            if (rowNumber >= freqTableStartRow + 2) {
                for (let i = 3; i <= freqColumnCount; i++) {
                    row.getCell(i).numFmt = '0%';
                }
            }
        }

        for (let colNumber = 1; colNumber <= lastColumn; colNumber++) {
            const cell = row.getCell(colNumber);
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

            if (rowNumber > 2) {
                const colLetter = cell.address.replace(/[0-9]/g, '');
                if (efColumns.includes(colLetter) || coefColumns.includes(colLetter)) {
                    cell.font = { bold: true };
                }
            }
        }
    });

    worksheet.getColumn('B').alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

    return await workbook.xlsx.writeBuffer();
}

module.exports = { generateMatchReportExcel };