import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatIDR, formatTanggal, type Transaksi } from "./finance-api";
import type { Summary } from "./finance-api";

export function generatePdfReport(opts: {
  rows: Transaksi[];
  summary: Summary;
  periodLabel: string;
}) {
  const { rows, summary, periodLabel } = opts;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header band
  doc.setFillColor(33, 99, 235);
  doc.rect(0, 0, pageWidth, 80, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Nexus Finance Report", 40, 38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Modern Cash Flow Management", 40, 56);
  doc.text(`Dibuat: ${new Date().toLocaleString("id-ID")}`, 40, 70);

  // Period
  let y = 105;
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Periode: ${periodLabel}`, 40, y);

  // Summary boxes
  y += 16;
  const boxW = (pageWidth - 80 - 20) / 3;
  const boxH = 60;
  const boxes: { label: string; value: string; color: [number, number, number] }[] = [
    { label: "Pemasukan", value: formatIDR(summary.pemasukan), color: [34, 168, 87] },
    { label: "Pengeluaran", value: formatIDR(summary.pengeluaran), color: [220, 53, 69] },
    { label: "Saldo", value: formatIDR(summary.saldo), color: [33, 99, 235] },
  ];
  boxes.forEach((b, i) => {
    const x = 40 + i * (boxW + 10);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, boxW, boxH, 6, 6, "FD");
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(b.label.toUpperCase(), x + 12, y + 18);
    doc.setTextColor(...b.color);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(b.value, x + 12, y + 42);
  });

  y += boxH + 24;

  // Table
  autoTable(doc, {
    startY: y,
    head: [["#", "Tanggal", "Jenis", "Kategori", "Jumlah", "Metode", "Deskripsi"]],
    body: rows.map((r, i) => [
      String(i + 1),
      formatTanggal(r.Tanggal),
      r.Jenis,
      r.Kategori,
      formatIDR(Number(r.Jumlah) || 0),
      r.Metode,
      r.Deskripsi || "-",
    ]),
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [33, 99, 235], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 28 },
      4: { halign: "right" },
    },
    didDrawPage: () => {
      const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
      const ph = doc.internal.pageSize.getHeight();
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(`Nexus Finance — Halaman ${pageCount}`, pageWidth - 40, ph - 16, { align: "right" });
    },
  });

  doc.save(`nexus-finance-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
