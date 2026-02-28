import * as pdfjsLib from "pdfjs-dist";

// Use the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

export interface ParsedDocument {
  paragraphs: string[];
  fullText: string;
  pageCount: number;
}

export async function parsePDF(file: File): Promise<ParsedDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const paragraphs: string[] = [];
  let fullText = "";

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
          // New line detected — check if it's a paragraph break
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
    }

    fullText += (fullText ? "\n\n" : "") + paragraphs.slice(-1)[0] || "";
  }

  return {
    paragraphs,
    fullText: paragraphs.join("\n\n"),
    pageCount: pdf.numPages,
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
