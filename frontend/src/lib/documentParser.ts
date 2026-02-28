import * as pdfjsLib from "pdfjs-dist";

// Use the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

export interface ParsedDocument {
  paragraphs: string[];
  fullText: string;
  pageCount: number;
  pdfType: "text" | "scanned" | "mixed";
}

export async function parsePDF(file: File): Promise<ParsedDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const paragraphs: string[] = [];
  let pagesWithText = 0;
  let pagesWithoutText = 0;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    let pageText = "";
    let lastY: number | null = null;

    for (const item of content.items) {
      if ("str" in item) {
        const textItem = item as { str: string; transform: number[] };
        const y = textItem.transform[5];

        if (lastY !== null && Math.abs(y - lastY) > 5) {
          if (Math.abs(y - lastY) > 15) {
            if (pageText.trim()) {
              paragraphs.push(pageText.trim());
              pageText = "";
            }
          } else {
            pageText += " ";
          }
        }

        pageText += textItem.str;
        lastY = y;
      }
    }

    if (pageText.trim()) {
      paragraphs.push(pageText.trim());
      pagesWithText++;
    } else {
      pagesWithoutText++;
    }
  }

  // Determine PDF type
  let pdfType: "text" | "scanned" | "mixed";
  if (pagesWithText === 0) {
    pdfType = "scanned";
    // Throw so the caller can show the right error message
    throw new Error(
      "SCANNED_PDF: This PDF contains only scanned images with no selectable text. " +
        "Please use a PDF with a text layer, or run it through an OCR tool (e.g. Adobe Acrobat, Google Drive) first.",
    );
  } else if (pagesWithoutText > 0) {
    pdfType = "mixed";
  } else {
    pdfType = "text";
  }

  return {
    paragraphs,
    fullText: paragraphs.join("\n\n"),
    pageCount: pdf.numPages,
    pdfType,
  };
}

export function parseTextFile(file: File): Promise<ParsedDocument> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const paragraphs = text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      resolve({
        paragraphs: paragraphs.length ? paragraphs : [text],
        fullText: text,
        pageCount: 1,
        pdfType: "text",
      });
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

export async function parseDocument(file: File): Promise<ParsedDocument> {
  if (file.type === "application/pdf") {
    return parsePDF(file);
  }
  return parseTextFile(file);
}
