import { jsPDF } from "jspdf";

export function exportToPdf(fileName: string, paragraphs: string[]): void {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageW - margin * 2;
  let y = margin;

  const addPage = () => {
    doc.addPage();
    y = margin;
  };

  // ── Header ────────────────────────────────────────────────────────────────
  doc.setFillColor(10, 20, 20);
  doc.rect(0, 0, pageW, 18, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(180, 140, 60); // gold
  const title = fileName || "AI Voice Editor — Exported Document";
  doc.text(title, margin, 12);

  doc.setFontSize(8);
  doc.setTextColor(100, 120, 110);
  doc.text(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    pageW - margin,
    12,
    { align: "right" },
  );

  y = 28;

  // Thin gold rule below header
  doc.setDrawColor(180, 140, 60);
  doc.setLineWidth(0.3);
  doc.line(margin, 22, pageW - margin, 22);

  // ── Paragraphs ────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);

  paragraphs.forEach((para, idx) => {
    if (!para.trim()) return;

    // Paragraph number label
    doc.setFont("courier", "normal");
    doc.setFontSize(7);
    doc.setTextColor(140, 170, 160);
    const label = `[${String(idx + 1).padStart(2, "0")}]`;
    doc.text(label, margin, y);
    y += 4;

    // Paragraph body — split long lines to fit the page
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);

    const lines = doc.splitTextToSize(para, contentWidth);
    const blockH = lines.length * 5.5 + 6;

    if (y + blockH > pageH - margin) {
      addPage();
    }

    doc.text(lines, margin, y);
    y += blockH;
  });

  // ── Footer on every page ──────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(180, 140, 60);
    doc.setLineWidth(0.2);
    doc.line(margin, pageH - 14, pageW - margin, pageH - 14);

    doc.setFont("courier", "normal");
    doc.setFontSize(7);
    doc.setTextColor(120, 140, 130);
    doc.text("AI Voice Editor — Gilded Scribe Protocol", margin, pageH - 9);
    doc.text(`Page ${p} / ${totalPages}`, pageW - margin, pageH - 9, {
      align: "right",
    });
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const safeName = (fileName || "gilded-scribe-export").replace(
    /[^a-z0-9_-]/gi,
    "_",
  );
  doc.save(`${safeName}.pdf`);
}
