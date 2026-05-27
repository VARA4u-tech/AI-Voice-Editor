export async function exportToPdf(
  fileName: string,
  paragraphs: string[],
): Promise<void> {
  const safeName = (fileName || "gilded-scribe-export").replace(
    /[^a-z0-9_-]/gi,
    "_",
  );

  return new Promise((resolve, reject) => {
    try {
      // Create a hidden iframe
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        throw new Error("Failed to create iframe document for export");
      }

      // Inject the HTML content into the iframe
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${safeName}</title>
            <style>
              @page { 
                margin: 20mm; 
                size: A4 portrait;
              }
              body { 
                font-family: system-ui, -apple-system, sans-serif; 
                color: #1e1e1e; 
                line-height: 1.6;
                padding: 0;
                margin: 0;
              }
              h1, h2, h3, h4, h5, h6 { 
                color: rgb(180, 140, 60); 
                margin-top: 1.5em; 
                margin-bottom: 0.5em; 
                page-break-after: avoid; 
                font-weight: bold; 
              }
              p { margin-bottom: 1em; }
              
              /* Table styling */
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-bottom: 1em; 
                page-break-inside: auto; 
              }
              tr { 
                page-break-inside: avoid; 
                page-break-after: auto; 
              }
              th, td { 
                border: 1px solid #ccc; 
                padding: 8px; 
                text-align: left; 
              }
              th { background-color: #f5f5f5; }
              
              hr { 
                border: 0; 
                border-top: 1px solid #ccc; 
                margin: 2em 0; 
              }
              a { 
                color: rgb(180, 140, 60); 
                text-decoration: none; 
              }
              img { 
                max-width: 100%; 
                height: auto; 
                page-break-inside: avoid; 
                display: block; 
                margin: 1em 0; 
              }
              
              /* Custom Header for the PDF */
              .header {
                border-bottom: 3px solid rgb(180, 140, 60);
                padding-bottom: 10px;
                margin-bottom: 30px;
                display: flex;
                justify-content: space-between;
                align-items: baseline;
              }
              .title { 
                font-size: 22px; 
                font-weight: bold; 
                color: rgb(180, 140, 60); 
                margin: 0; 
              }
              .date { 
                color: rgb(100, 120, 110); 
                font-size: 16px; 
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">${fileName || "Exported Document"}</div>
              <div class="date">${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
            </div>
            ${paragraphs.join("<br/>")}
          </body>
        </html>
      `);
      doc.close();

      const printAndClean = () => {
        try {
          iframe.contentWindow?.focus();
          // Opens the browser's native print/save-as-pdf dialog
          iframe.contentWindow?.print();
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          // Cleanup after the print dialog closes
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 3000);
        }
      };

      // Wait a moment for any external images/fonts to load within the iframe
      setTimeout(printAndClean, 800);
    } catch (error) {
      reject(error);
    }
  });
}
