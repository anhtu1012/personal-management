// Alternative simple approach using window.print()
export function printMemberDetail(member: any, content: string) {
  // Tạo window mới để print
  const printWindow = window.open('', '_blank')
  
  if (!printWindow) {
    alert('Vui lòng cho phép popup để xuất PDF')
    return
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Chi tiết - ${member.name}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: white;
            color: #1e293b;
          }
          
          @media print {
            body {
              padding: 0;
            }
          }
          
          .no-print {
            display: none !important;
          }
          
          @page {
            margin: 1cm;
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() {
            window.print();
            // Đóng window sau khi print (optional)
            // window.onafterprint = function() { window.close(); }
          }
        </script>
      </body>
    </html>
  `)
  
  printWindow.document.close()
}
