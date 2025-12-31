import { PDFDocument, degrees, rgb } from 'pdf-lib';
import jsPDF from 'jspdf';

// Convert File to ArrayBuffer
export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Merge multiple PDFs
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await fileToArrayBuffer(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

// Split PDF by page range
export async function splitPdfByRange(file: File, startPage: number, endPage: number): Promise<Uint8Array> {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();
  const newPdf = await PDFDocument.create();

  const startIndex = Math.max(0, Math.min(startPage - 1, pageCount - 1));
  const endIndex = Math.min(pageCount, endPage);
  const indices = Array.from({ length: endIndex - startIndex }, (_, i) => i + startIndex);
  const pages = await newPdf.copyPages(pdf, indices);
  pages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

// Split PDF into individual pages
export async function splitPdfIntoPages(file: File): Promise<Uint8Array[]> {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();
  const pdfs: Uint8Array[] = [];

  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdf, [i]);
    newPdf.addPage(page);
    pdfs.push(await newPdf.save());
  }

  return pdfs;
}

// Extract specific pages
export async function extractPages(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();

  const indices = pageNumbers.map((num) => num - 1).filter((idx) => idx >= 0 && idx < pdf.getPageCount());
  const pages = await newPdf.copyPages(pdf, indices);
  pages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

// Remove pages
export async function removePages(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();
  const pagesToKeep = Array.from({ length: pageCount }, (_, i) => i)
    .filter((idx) => !pageNumbers.includes(idx + 1));

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, pagesToKeep);
  pages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

// Convert images to PDF
export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
  if (!files || files.length === 0) {
    throw new Error('No image files provided');
  }

  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  let isFirstPage = true;

  for (const file of files) {
    if (!isFirstPage) {
      pdf.addPage();
    }

    const imageUrl = URL.createObjectURL(file);
    
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          try {
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate dimensions maintaining aspect ratio
            const imgWidth = pdfWidth - 20; // 10mm margin on each side
            const imgHeight = (img.height * imgWidth) / img.width;
            
            let heightLeft = imgHeight;
            let position = 10; // Start with 10mm top margin

            // If image is taller than page, split it
            if (heightLeft >= pdfHeight - 20) {
              while (heightLeft >= 0) {
                const imgToAdd = Math.min(heightLeft, pdfHeight - 20);
                pdf.addImage(
                  img,
                  file.type.includes('png') || file.type === 'image/png' ? 'PNG' : 'JPEG',
                  10, // x position
                  position, // y position
                  imgWidth,
                  imgToAdd
                );
                heightLeft -= pdfHeight - 20;
                if (heightLeft > 0) {
                  pdf.addPage();
                  position = 10;
                }
              }
            } else {
              pdf.addImage(
                img,
                file.type.includes('png') || file.type === 'image/png' ? 'PNG' : 'JPEG',
                10,
                position,
                imgWidth,
                imgHeight
              );
            }
            
            resolve();
          } catch (error) {
            reject(error);
          } finally {
            URL.revokeObjectURL(imageUrl);
          }
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(imageUrl);
          reject(new Error(`Failed to load image: ${file.name}`));
        };
        
        img.src = imageUrl;
      });
    } catch (error) {
      URL.revokeObjectURL(imageUrl);
      throw error;
    }
    
    isFirstPage = false;
  }

  const arrayBuffer = pdf.output('arraybuffer');
  return new Uint8Array(arrayBuffer);
}

// Rotate PDF pages
export async function rotatePdfPages(file: File, rotation: number, pageNumbers?: number[]): Promise<Uint8Array> {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();

  const pagesToRotate = pageNumbers
    ? pageNumbers.map((num) => num - 1).filter((idx) => idx >= 0 && idx < pageCount)
    : Array.from({ length: pageCount }, (_, i) => i);

  const newPdf = await PDFDocument.create();
  const pages = await newPdf.copyPages(pdf, pdf.getPageIndices());

  pages.forEach((page, index) => {
    if (pagesToRotate.includes(index)) {
      page.setRotation(degrees(rotation));
    }
    newPdf.addPage(page);
  });

  return await newPdf.save();
}

// Parse page range string (e.g., "1, 3, 5-7" -> [1, 3, 5, 6, 7])
export function parsePageRange(rangeStr: string): number[] {
  const pages: number[] = [];
  const parts = rangeStr.split(',').map((p) => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page)) {
        pages.push(page);
      }
    }
  }

  return [...new Set(pages)].sort((a, b) => a - b);
}

// Download PDF
export function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Download multiple PDFs as ZIP
export async function downloadMultiplePdfs(pdfs: Uint8Array[], baseFilename: string) {
  // For simplicity, download individually
  // In a production app, you might want to use a zip library
  for (let i = 0; i < pdfs.length; i++) {
    const filename = `${baseFilename}_page_${i + 1}.pdf`;
    downloadPdf(pdfs[i], filename);
    // Small delay to avoid browser blocking multiple downloads
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// Add watermark to PDF
export async function addWatermark(
  file: File,
  watermarkText: string,
  opacity: number,
  position: string
): Promise<Uint8Array> {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();

  // Embed a font for the watermark
  const font = await pdf.embedFont('Helvetica-Bold');

  for (let i = 0; i < pageCount; i++) {
    const page = pdf.getPage(i);
    const { width, height } = page.getSize();

    // Calculate position
    let x = width / 2;
    let y = height / 2;
    if (position === 'top') y = height - 50;
    else if (position === 'bottom') y = 50;

    // Calculate text size
    const fontSize = 72;
    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
    x = x - textWidth / 2;

    page.drawText(watermarkText, {
      x,
      y,
      size: fontSize,
      font: font,
      color: rgb(0.7, 0.7, 0.7),
      opacity: opacity,
      rotate: degrees(-45),
    });
  }

  return await pdf.save();
}

// Organize/reorder pages
export async function organizePages(file: File, pageOrder: string): Promise<Uint8Array> {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pageCount = pdf.getPageCount();
  const newPdf = await PDFDocument.create();

  let pageIndices: number[];
  if (!pageOrder.trim()) {
    // Reverse all pages if empty
    pageIndices = Array.from({ length: pageCount }, (_, i) => pageCount - 1 - i);
  } else {
    const pageNumbers = parsePageRange(pageOrder);
    pageIndices = pageNumbers.map((num) => num - 1).filter((idx) => idx >= 0 && idx < pageCount);
  }

  const pages = await newPdf.copyPages(pdf, pageIndices);
  pages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

// Compress PDF (basic - pdf-lib doesn't have advanced compression, so we just save with options)
export async function compressPdf(file: File, level: string): Promise<Uint8Array> {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  
  // pdf-lib has limited compression options
  // We can optimize by using object streams and avoiding unnecessary metadata
  const saveOptions: any = {
    useObjectStreams: level !== 'low', // Use object streams for medium and high
    addDefaultPage: false,
    updateMetadata: false,
  };
  
  // For high compression, we can try to reduce image quality (if any)
  // Note: This is a basic implementation. True compression would require:
  // - Image recompression in PDF
  // - Font subsetting
  // - Object deduplication
  // These features require more advanced libraries or backend processing
  
  return await pdf.save(saveOptions);
}

// Password protect PDF
// Note: pdf-lib doesn't support password protection directly
// This is a placeholder - would require additional libraries or backend
export async function passwordProtectPdf(file: File, _password: string): Promise<Uint8Array> {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  // pdf-lib doesn't support password protection in the current version
  // This would require additional libraries like pdfkit or backend processing
  alert('Password protection requires additional libraries. This feature will be implemented with a backend service.');
  return await pdf.save();
}

// Convert PDF to images (requires pdfjs-dist)
export async function pdfToImages(file: File, dpi: number): Promise<Blob[]> {
  const pdfjsLib = await import('pdfjs-dist');
  
  // Set up worker - use local worker or CDN fallback
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    try {
      // Try to use the worker from node_modules (Vite handles this)
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();
    } catch (e) {
      // Fallback to CDN with https
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    }
  }
  
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const images: Blob[] = [];
  const pageCount = pdf.numPages;

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: dpi / 72 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get canvas context');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    };

    await page.render(renderContext).promise;

    const blob = await new Promise<Blob | null>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        'image/jpeg',
        0.95
      );
    });
    
    if (blob) {
      images.push(blob);
    }
  }

  if (images.length === 0) {
    throw new Error('Failed to convert any pages to images');
  }

  return images;
}

// Add page numbers to PDF
export async function addPageNumbers(
  file: File,
  position: string,
  startNumber: number
): Promise<Uint8Array> {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const font = await pdf.embedFont('Helvetica');
  const pageCount = pdf.getPageCount();

  for (let i = 0; i < pageCount; i++) {
    const page = pdf.getPage(i);
    const { width, height } = page.getSize();
    const pageNumber = startNumber + i;
    const text = pageNumber.toString();

    let x = width / 2;
    let y = 20;
    
    if (position.includes('top')) y = height - 20;
    if (position.includes('left')) x = 30;
    if (position.includes('right')) x = width - 30;
    if (position.includes('center')) x = width / 2;

    page.drawText(text, {
      x: x - (font.widthOfTextAtSize(text, 12) / 2),
      y,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
  }

  return await pdf.save();
}

// Edit PDF metadata
export async function editMetadata(
  file: File,
  metadata: { title?: string; author?: string; subject?: string; creator?: string }
): Promise<Uint8Array> {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);

  if (metadata.title) pdf.setTitle(metadata.title);
  if (metadata.author) pdf.setAuthor(metadata.author);
  if (metadata.subject) pdf.setSubject(metadata.subject);
  if (metadata.creator) pdf.setCreator(metadata.creator);

  return await pdf.save();
}

// Crop PDF margins (simplified - uses page embedding with offset)
export async function cropPdf(
  file: File,
  margins: { top: number; bottom: number; left: number; right: number }
): Promise<Uint8Array> {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  const pageCount = pdf.getPageCount();
  
  for (let i = 0; i < pageCount; i++) {
    const originalPage = pdf.getPage(i);
    const { width, height } = originalPage.getSize();
    const croppedWidth = Math.max(1, width - margins.left - margins.right);
    const croppedHeight = Math.max(1, height - margins.top - margins.bottom);
    const newPage = newPdf.addPage([croppedWidth, croppedHeight]);
    
    // Embed page from original PDF
    const embeddedPage = await newPdf.embedPage(originalPage);
    newPage.drawPage(embeddedPage, {
      x: -margins.left,
      y: -margins.bottom,
      xScale: 1,
      yScale: 1,
    });
  }

  return await newPdf.save();
}

// Add border to PDF pages
export async function addBorder(
  file: File,
  borderWidth: number,
  borderColor: string
): Promise<Uint8Array> {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();

  // Parse hex color to RGB
  const hex = borderColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const pages = await newPdf.copyPages(pdf, pdf.getPageIndices());
  
  for (const page of pages) {
    const { width, height } = page.getSize();
    const addedPage = newPdf.addPage(page);

    // Draw border rectangles
    addedPage.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: borderWidth,
      color: rgb(r, g, b),
    });
    addedPage.drawRectangle({
      x: 0,
      y: height - borderWidth,
      width: width,
      height: borderWidth,
      color: rgb(r, g, b),
    });
    addedPage.drawRectangle({
      x: 0,
      y: 0,
      width: borderWidth,
      height: height,
      color: rgb(r, g, b),
    });
    addedPage.drawRectangle({
      x: width - borderWidth,
      y: 0,
      width: borderWidth,
      height: height,
      color: rgb(r, g, b),
    });
  }

  return await newPdf.save();
}

// Arrange pages per sheet
export async function pagesPerSheet(
  file: File,
  pagesPerSheetCount: number,
  addBorder: boolean
): Promise<Uint8Array> {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  const pageCount = pdf.getPageCount();

  // Get the dimensions of the first page to use as reference
  const firstPage = pdf.getPage(0);
  const { width: pageWidth, height: pageHeight } = firstPage.getSize();

  // Calculate grid dimensions
  let cols = 1;
  let rows = 1;
  if (pagesPerSheetCount === 2) {
    cols = 2;
    rows = 1;
  } else if (pagesPerSheetCount === 4) {
    cols = 2;
    rows = 2;
  } else if (pagesPerSheetCount === 6) {
    cols = 3;
    rows = 2;
  } else if (pagesPerSheetCount === 9) {
    cols = 3;
    rows = 3;
  }

  const scaledWidth = pageWidth / cols;
  const scaledHeight = pageHeight / rows;
  const sheetWidth = pageWidth;
  const sheetHeight = pageHeight;

  // Process pages in batches
  for (let sheetIndex = 0; sheetIndex < Math.ceil(pageCount / pagesPerSheetCount); sheetIndex++) {
    const sheet = newPdf.addPage([sheetWidth, sheetHeight]);

    for (let i = 0; i < pagesPerSheetCount; i++) {
      const pageIndex = sheetIndex * pagesPerSheetCount + i;
      if (pageIndex >= pageCount) break;

      const originalPage = pdf.getPage(pageIndex);
      const embeddedPage = await newPdf.embedPage(originalPage);

      // Calculate position on sheet
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * scaledWidth;
      const y = sheetHeight - (row + 1) * scaledHeight;

      // Draw the page scaled down
      sheet.drawPage(embeddedPage, {
        x,
        y,
        xScale: scaledWidth / pageWidth,
        yScale: scaledHeight / pageHeight,
      });

      // Optionally add border
      if (addBorder) {
        sheet.drawRectangle({
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });
      }
    }
  }

  return await newPdf.save();
}

