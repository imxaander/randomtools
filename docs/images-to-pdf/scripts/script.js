

const fileInput = document.getElementById("files-input");

function PDF(action){
    console.log("PDF is Called.");
    let orientation = document.getElementById("files-o").value
    let unit = document.getElementById("files-u").value
    let format = document.getElementById("files-f").value
    var filename = document.getElementById("file-name").value
    var margin = parseFloat(document.getElementById("files-margin").value)
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
    if (files.length != 0){
        for (let index = 0; index < files.length; index++) {
            console.log(files[index]);
            doc.addPage()
            img.src = URL.createObjectURL(files[index])
            let docwidth = doc.internal.pageSize.getWidth()
            let docheight = doc.internal.pageSize.getHeight()

            doc.addImage(img, 'png', margin, margin, docwidth-(2*margin), docheight-(2*margin))
        }
        if (action == "download") {
            //doc.save(filename+".pdf")
        }
        document.getElementById('main-iframe').setAttribute('src', doc.output('bloburl'));
    }
}

