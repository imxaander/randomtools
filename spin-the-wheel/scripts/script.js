var chosenModal = new bootstrap.Modal(document.getElementById('chosen-modal'))
var padding = {top:20, right:40, bottom:0, left:0},
            w = 300 - padding.left - padding.right,
            h = 300 - padding.top  - padding.bottom,
            r = Math.min(w, h)/2,
            rotation = 0,
            oldrotation = 0,
            picked = 100000,
            oldpick = [],
            color = d3.scale.category20();

var data = [];

var svg = d3.select('#chart')
function generateWheel(){
    var gBtn = document.getElementById("genBtn")
    var rad = document.getElementById("removeAfterRadio")
    data = [];
    var str = document.getElementById("add-item-input").value
    var arr = str.split(",")

    arr.forEach(element => {
        if(element.trim()!=""){
            // console.log("valid");
            data.push({"label": element})
        }
    });

    // console.log(str);

    w = 300 - padding.left - padding.right,
            h = 300 - padding.top  - padding.bottom,
            r = Math.min(w, h)/2,
            rotation = 0,
            oldrotation = 0,
            picked = 100000,
            oldpick = [],
            color = d3.scale.category20();
    
    d3.selectAll("svg").remove();
    svg = d3.select('#chart')
    svg = d3.select('#chart')
        .append("svg")
        .data([data])
        .attr("width",  w + padding.left + padding.right)
        .attr("height", h + padding.top + padding.bottom);
    var container = svg.append("g")
        .attr("class", "chartholder")
        .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");
    var vis = container
        .append("g");
        
    var pie = d3.layout.pie().sort(null).value(function(d){return 1;});
    // declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);
    // select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "slice");
        
    arcs.append("path")
        .attr("fill", function(d, i){ return color(i); })
        .attr("d", function (d) { return arc(d); });
    // add the text
    arcs.append("text").attr("transform", function(d){
            d.innerRadius = 0;
            d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle)/2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
        })
        .attr("text-anchor", "end")
        .text( function(d, i) {
            return data[i].label;
        });
    container.on("click", spin);
    
    function spin(d){
        container.on("click", null);
        //all slices have been seen, all done
        // console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
        if(oldpick.length == data.length){
            Toastify({

                text: "Click Generate to Spin Again!",
                gravity: "bottom",
                position: "center",
                duration: 3000,
                backgroundColor: "red"
            }).showToast();
            return;
        }
        gBtn.setAttribute("disabled", "")
        var ps = 360/data.length,
                pieslice = Math.round(1440/data.length),
                rng      = Math.floor((Math.random() * 1440) + 360);
            
        rotation = (Math.round(rng / ps) * ps);
        
        picked = Math.round(data.length - (rotation % 360)/ps);
        picked = picked >= data.length ? (picked % data.length) : picked;
        if(oldpick.indexOf(picked) !== -1){
            d3.select(this).call(spin);
            // console.log(oldpick.indexOf(picked), "picked so spin");
            return;
        } else {
            // console.log(oldpick.indexOf(picked), "not picked ")
            if (rad.checked) {
                oldpick.push(picked); 
            }
        }
        rotation += 90 - Math.round(ps/2);
        vis.transition()
            .duration(3000)
            .attrTween("transform", rotTween)
            .each("end", function(){
                //mark question as seen
                if (rad.checked) {
                    d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                    .attr("fill", "#101");
                }
                oldrotation = rotation;
                document.getElementById("chosen-item").innerHTML = data[picked].label
                chosenModal.toggle()
                /* Comment the below line for restrict spin to sngle time */
                container.on("click", spin);
                gBtn.removeAttribute("disabled")
            });
    }
    //make arrow
    svg.append("g")
        .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
        .append("path")
        .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
        .style({"fill":"black"});
    //draw spin circle

}

function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function(t) {
    return "rotate(" + i(t) + ")";
    };
}


generateWheel()