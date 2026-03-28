import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPDF(elementId: string, fileName: string) {
  try {
    console.log('=== Starting PDF Export ===')
    console.log('Element ID:', elementId)
    console.log('File name:', fileName)
    
    const element = document.getElementById(elementId)
    
    if (!element) {
      console.error('❌ Element not found with ID:', elementId)
      console.log('Available elements with IDs:', 
        Array.from(document.querySelectorAll('[id]')).map(el => el.id)
      )
      throw new Error('Element not found')
    }

    console.log('✓ Element found')
    console.log('Element dimensions:', {
      width: element.offsetWidth,
      height: element.offsetHeight,
      scrollHeight: element.scrollHeight
    })

    // Đảm bảo element visible tạm thời
    const originalStyle = {
      position: element.style.position,
      left: element.style.left,
      visibility: element.style.visibility
    }
    
    element.style.position = 'absolute'
    element.style.left = '0'
    element.style.visibility = 'visible'

    console.log('Creating canvas...')

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: true,
      backgroundColor: '#ffffff',
      width: 800,
      windowWidth: 800,
    })

    console.log('✓ Canvas created:', {
      width: canvas.width,
      height: canvas.height
    })

    // Restore original style
    element.style.position = originalStyle.position
    element.style.left = originalStyle.left
    element.style.visibility = originalStyle.visibility

    const imgData = canvas.toDataURL('image/png')
    console.log('✓ Image data created')
    
    // Tính toán kích thước PDF
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    console.log('Creating PDF document...')
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

    console.log('✓ PDF document created')
    console.log('Saving PDF...')

    // Lưu PDF
    pdf.save(`${fileName}.pdf`)
    
    console.log('✓✓✓ PDF saved successfully!')
    return true
  } catch (error) {
    console.error('❌❌❌ Error generating PDF:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    throw error
  }
}
