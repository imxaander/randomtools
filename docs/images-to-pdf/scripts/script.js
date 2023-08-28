const fileInput = document.getElementById("files-input");

function downloadPDF(){
    let orientation = document.getElementById("files-o").value
    let unit = document.getElementById("files-u").value
    let format = document.getElementById("files-f").value
    var pdfConfig = {
        orientation: orientation,
        unit: unit,
        format: format
    }
    
    var doc = new jsPDF(pdfConfig)
    doc.deletePage(1)

    //loop logic
    var files = fileInput.files
    var img = new Image()
    if (files.length != 0) {
        
        for (let index = 0; index < files.length; index++) {
            console.log(files[index]);
            doc.addPage()
            img.src = URL.createObjectURL(files[index])
            console.log(img.src);
            doc.addImage(img, 'png',0, 0, 10, 10)
    
        }
        doc.save("wow")
    }else{

    }
}

