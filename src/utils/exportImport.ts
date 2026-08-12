/**
 * Utility functions for Exporting data to CSV/Excel and PDF,
 * as well as Importing CSV datasets into local state.
 */

export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(header => {
        let val = row[header];
        if (val === null || val === undefined) val = '';
        if (typeof val === 'object') val = JSON.stringify(val);
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDFPrint(title: string, subtitle: string, columns: string[], rows: (string | number)[][]) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up blocked! Please allow popups to export printable PDF.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - Report PDF</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #111827; }
          .header { border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 800; color: #1e3a8a; }
          .header p { margin: 4px 0 0 0; font-size: 13px; color: #6b7280; }
          .meta { text-align: right; font-size: 11px; color: #6b7280; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 12px; }
          th { background-color: #f1f5f9; text-align: left; padding: 10px 8px; border-bottom: 2px solid #cbd5e1; font-weight: 700; color: #334155; }
          td { padding: 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
          tr:nth-child(even) td { background-color: #f8fafc; }
          .footer { margin-top: 32px; border-top: 1px dashed #cbd5e1; pt: 8px; font-size: 10px; color: #94a3b8; text-align: center; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 16px; background: #eff6ff; padding: 12px; border-radius: 8px; text-align: right;">
          <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🖨️ Print / Save as PDF
          </button>
        </div>
        <div class="header">
          <div>
            <h1>Seva Desk — ${title}</h1>
            <p>${subtitle}</p>
          </div>
          <div class="meta">
            <div>Generated: ${new Date().toLocaleString()}</div>
            <div>Govt of West Bengal Seva Kendra</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              ${columns.map(col => `<th>${col}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                ${row.map(cell => `<td>${cell !== undefined && cell !== null ? String(cell) : ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          Generated automatically by Seva Desk Kendra Management Operating System • Official Official Report
        </div>
        <script>
          setTimeout(() => {
            window.print();
          }, 600);
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

export function parseCSVFile(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) return resolve([]);
        const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) return resolve([]);

        const headers = lines[0].split(',').map(h => h.replace(/^"(.*)"$/, '$1').trim());
        const results: Record<string, string>[] = [];

        for (let i = 1; i < lines.length; i++) {
          // Simple regex CSV line parse split respecting quotes
          const rawRow = lines[i];
          const values: string[] = [];
          let currentVal = '';
          let inQuotes = false;

          for (let j = 0; j < rawRow.length; j++) {
            const char = rawRow[j];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(currentVal.trim());
              currentVal = '';
            } else {
              currentVal += char;
            }
          }
          values.push(currentVal.trim());

          const rowObj: Record<string, string> = {};
          headers.forEach((header, idx) => {
            let val = values[idx] || '';
            val = val.replace(/^"(.*)"$/, '$1').replace(/""/g, '"');
            rowObj[header] = val;
          });
          results.push(rowObj);
        }

        resolve(results);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
}
