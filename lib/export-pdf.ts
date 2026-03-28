import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPDF(elementId: string, fileName: string) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error('Element not found')
    return
  }

  try {
    // Tạo canvas từ element
    const canvas = await html2canvas(element, {
      scale: 2, // Tăng chất lượng
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    
    // Tính toán kích thước PDF
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    const pdf = new jsPDF('p', 'mm', 'a4')
    let position = 0

    // Thêm trang đầu tiên
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Thêm các trang tiếp theo nếu nội dung dài
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Lưu PDF
    pdf.save(`${fileName}.pdf`)
  } catch (error) {
    console.error('Error generating PDF:', error)
  }
}
