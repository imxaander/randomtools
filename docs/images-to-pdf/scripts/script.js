const fileInput = document.getElementById("files");
function downloadPDF(orientation, unit, format){
    var pdfConfig = {
        orientation: orientation,
        unit: unit,
        format: format
    }
    
    var doc = new jsPDF(pdfConfig)
    
    var img = new Image()
    img.src = 'lol.png'
    doc.addImage(img, 'png', 0, 0, 10, 10)
    doc.save('doc.pdf')
}

//downloadPDF("portrait", "in", "letter")