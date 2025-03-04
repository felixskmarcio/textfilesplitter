import * as XLSX from 'xlsx';

export interface ProcessingOptions {
  encoding: 'utf-8' | 'ascii';
  splitMode: 'characters' | 'lines';
  splitValue: number;
}

export async function handleExcelFile(buffer: ArrayBuffer, options: ProcessingOptions, fileExtension: string): Promise<Blob[]> {
  try {
    const workbook = XLSX.read(buffer);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
    
    if (data.length === 0) {
      throw new Error('Excel file is empty');
    }

    const header = data[0];
    const rows = data.slice(1);
    const rowsPerPart = Math.ceil(rows.length / options.splitValue);
    const parts: Blob[] = [];

    for (let i = 0; i < rows.length; i += rowsPerPart) {
      const partRows = [header, ...rows.slice(i, i + rowsPerPart)];
      const partWorkbook = XLSX.utils.book_new();
      const partSheet = XLSX.utils.json_to_sheet(partRows, { skipHeader: true });
      XLSX.utils.book_append_sheet(partWorkbook, partSheet, 'Sheet1');
      const partBuffer = XLSX.write(partWorkbook, { type: 'array', bookType: fileExtension as XLSX.BookType });
      parts.push(new Blob([partBuffer]));
    }

    return parts;
  } catch (error) {
    throw new Error(`Error processing Excel file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function handleTextFile(content: ArrayBuffer, options: ProcessingOptions): Promise<Blob[]> {
  try {
    const textContent = new TextDecoder(options.encoding).decode(content);
    const parts: Blob[] = [];

    if (options.splitMode === 'characters') {
      const chunkSize = Math.ceil(textContent.length / options.splitValue);
      for (let i = 0; i < textContent.length; i += chunkSize) {
        const chunk = textContent.slice(i, i + chunkSize);
        parts.push(new Blob([chunk], { type: `text/plain;charset=${options.encoding}` }));
      }
    } else {
      const lines = textContent.split('\n');
      const linesPerPart = Math.ceil(lines.length / options.splitValue);
      
      for (let i = 0; i < lines.length; i += linesPerPart) {
        const chunk = lines.slice(i, i + linesPerPart).join('\n');
        parts.push(new Blob([chunk], { type: `text/plain;charset=${options.encoding}` }));
      }
    }

    return parts;
  } catch (error) {
    throw new Error(`Error processing text file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function handleCSVFile(content: ArrayBuffer, options: ProcessingOptions): Promise<Blob[]> {
  try {
    const textContent = new TextDecoder(options.encoding).decode(content);
    const lines = textContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }

    const header = lines[0];
    const dataLines = lines.slice(1);
    const rowsPerPart = Math.ceil(dataLines.length / options.splitValue);
    const parts: Blob[] = [];

    for (let i = 0; i < options.splitValue; i++) {
      const start = i * rowsPerPart;
      const end = Math.min(start + rowsPerPart, dataLines.length);
      const partLines = [header, ...dataLines.slice(start, end)];
      parts.push(new Blob([partLines.join('\n')], { type: `text/csv;charset=${options.encoding}` }));
    }

    return parts;
  } catch (error) {
    throw new Error(`Error processing CSV file: ${error instanceof Error ? error.message : String(error)}`);
  }
}