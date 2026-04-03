export function openPdfAndPrintFromBase64(base64Pdf: string) {
  const cleanBase64 = base64Pdf.includes(",")
    ? (base64Pdf.split(",")[1] ?? "")
    : base64Pdf;

  const bytes = Uint8Array.from(atob(cleanBase64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";

  iframe.src = url;
  document.body.appendChild(iframe);

  iframe.onload = function () {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  };

  setTimeout(() => {
    URL.revokeObjectURL(url);
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }, 60000);
}
