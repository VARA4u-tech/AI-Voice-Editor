import { supabase } from "./supabase";

export interface ParsedDocument {
  paragraphs: string[];
  fullText: string;
  pageCount: number;
  pdfType: "text" | "scanned" | "mixed";
}

export async function parseDocument(file: File): Promise<ParsedDocument> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("Authentication required to parse documents.");
  }

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${backendUrl}/document/extract-text`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `Failed to parse document (HTTP ${response.status}): ${errText}`,
    );
  }

  const result = await response.json();

  // The backend now returns { filename, full_text: "<html>..." }
  return {
    paragraphs: [result.full_text], // HTML string is stored as a single 'paragraph' node for TipTap
    fullText: result.full_text,
    pageCount: 1, // We don't have accurate page counts from HTML extraction
    pdfType: "text",
  };
}
