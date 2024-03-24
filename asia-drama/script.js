
$(document).ready(function() {
    $('.fav-section-carousel').flickity({
        // options
        cellAlign: 'left',
        contain: true
    });


});

const myModalEl = document.getElementById('detail-modal')
myModalEl.addEventListener('hidden.bs.modal', event => {
  document.getElementById('detail-modal-trailer').innerHTML = ""
})


if(!("favs" in localStorage)){
    localStorage.setItem("favs", "")
    
}
if (!String.prototype.includes) {
    String.prototype.includes = function() {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

function search(){
    var query = $('#search-input').val();
    // console.log("search event")
    var site;
    var isRecent;

    //set to true to default in input
    if(query){
        $("#search-page-btn").click();
        site = 'https://runasian.net/search?type=movies&keyword='+query;
        // console.log("may laman")
        isRecent = false;
    }else{
        $("#home-page-btn").click();
        site = `https://runasian.net`;
        // console.log("walang laman")
        isRecent = true;
    }
    
    var wrapper = $('.search-results')[0];
    wrapper.innerHTML = '<i class="fas fa-spinner spinner"></i>';

    
    fetch(site).then(response => response.text()).then(html => 
    {
        
        var page = document.createElement('html');
        page.innerHTML = html;
    
        var ul = page.getElementsByClassName('switch-block list-episode-item')[0];
        
        wrapper.innerHTML = "";
  
        for(let child of ul.children){
            console.log("size: " + ul.children.length);
            let itemDiv = document.createElement("div");
        
            let href = child.querySelector('a').getAttribute("href").slice(14);
            console.log(child.querySelector('a').getAttribute("href"));
            let name = child.querySelector('h3').innerHTML;
            let img = child.querySelector('a').querySelector('img').getAttribute("data-original");
            let itemImg = document.createElement("img");

            if(isRecent){
                // href = getTitle(href);
            }

            itemImg.classList.add("card-img")
            itemImg.classList.add("img-fluid")
            itemImg.classList.add("align-self-center")
            // itemImg.classList.add("start-50")
            
            itemImg.src = img;
            itemDiv.appendChild(itemImg);
            itemDiv.classList.add("card");
            itemDiv.classList.add('d-flex')
            // itemDiv.classList.add('s')
            itemDiv.setAttribute("onclick", `detail('${href}', \`${name}\`, '${img}') `);
            
            // itemDiv.innerHTML += `<p class="item-text">${name}</p>`;
        
            wrapper.appendChild(itemDiv);
        }
        page.remove();
    }
    );
}
//get image done here remove
function detail(id, name){
    $('#detail-modal').modal('toggle'); 
    document.querySelector("#detail-modal-title").innerHTML = name;
    // document.querySelector(".fav-button").setAttribute("onclick", `fav(\`${name}\`,\`${img}\`, \`${id}\` )`)
    var wrapper = document.getElementById('detail-modal-episodes');
    
    wrapper.innerHTML = '<i class="fas fa-spinner spinner"></i>';
    
    fetch('https://runasian.net/drama-detail/'+id).then(response => response.text()).then(html =>{
        var page = document.createElement('html');
        page.innerHTML = html;
        /*
        var info = document.createElement("div")
        info.innerHTML = page.getElementsByClassName("info")[0].innerHTML;
        // console.log(details.innerText)
        
        var description;
        
        var descRegex = /escription (.*?)(Drama|Country)/m;
        var descSource = info.innerText.toString() //"elip is not balm"
        // console.log(descSource)
        var match = descRegex.exec(descSource);
        if (match) {
            let result = match;
            console.log(result);
        }else{
            console.log("no match")
        }
        */
        // document.getElementById('#detail-modal-info').innerHTML = details.innerHTML
        // console.log(details.innerText)

        //get on the top check it and implement the fogging shieee
        var img = page.getElementsByClassName('img')[0].querySelector('img').getAttribute("src")

        document.querySelector(".fav-button").setAttribute("onclick", `fav(\`${name}\`,\`${img}\`, \`${id}\` )`)
        var tab = document.createElement("div");
        tab.innerHTML = page.getElementsByClassName("tab-content left-tab-1")[0].outerHTML;

        var ul = tab.querySelector("ul");

        try{
            let trailer = page.querySelector('.trailer').children[1]
            document.getElementById('detail-modal-trailer').innerHTML = `
            <iframe src="${trailer.getAttribute("src")}" frameborder="0" width="1280" height="480" > </iframe>
            
            `

        }catch(x){
            console.log(x);
            document.getElementById('detail-modal-trailer').innerHTML = "Trailer Doesnt Exist"

        }
        
        checkFav(img);
        wrapper.innerHTML = "";
        let watchButtons = document.getElementsByClassName("video-pane-episodes")[0]
        watchButtons.innerHTML = ""
        let i = 1 
        for(let child of Array.from(ul.children).reverse()){

            // let item = document.createElement("div");
            let number = i++;
            let dateObj = new Date(child.querySelector(".time").textContent)
            let date = dateObj.getDay() + " - " +  dateObj.getMonth() + " - " + dateObj.getFullYear()
            let href = child.querySelector("a").getAttribute("href");
            // item.setAttribute("onclick", `watch('${href}')`);
            // item.setAttribute("class", `detail-modal-episode-item`);
            // item.innerHTML = `<p>${number}</p>:  ${date}`;
            let fulldatetime;

            if(child.querySelector(".time").textContent.slice(-3) != "ago"){
                fulldatetime = date
            }else{
                fulldatetime = child.querySelector(".time").textContent
            }
            itemR = `
            <div class="detail-modal-episode-item m-2 d-flex flex-wrap justify-content-between " onclick="watch('${href}')"> 
                <div class="h4">${number} </div> <div class=""> ${fulldatetime}</div>
            </div>
            <hr>
            `
            let itemW = `
                <button type="button" class="btn btn-dark btn-lg " onclick="watch('${href}')">Ep ${number}</button>
            `

            watchButtons.innerHTML += itemW
            wrapper.innerHTML += itemR;
        }
        
    });
}


function watch(id){
    document.getElementById("video-pane").classList.remove("visually-hidden")
    var wrapper = document.getElementsByClassName("video-player")[0];
    wrapper.innerHTML = '<i class="fas fa-spinner spinner"></i>';
    
    let link = "https://runasian.net"+id;
    fetch(link).then(response => response.text()).then(html => {
        var page = document.createElement("html")
        page.innerHTML = html;
        var title = page.querySelector("strong").innerHTML;
        document.querySelector(".video-title").innerHTML = title;
        
        var url = page.getElementsByClassName("watch_video watch-iframe")[0].querySelector("iframe").getAttribute("src");
        var dlUrl = page.getElementsByClassName('download')[0].children[0].getAttribute("href")
        console.log(dlUrl);
        document.getElementById("watch-dl").href = "https:" + dlUrl
        // console.log(url);
        wrapper.innerHTML = `<iframe id="video-player-iframe" sandbox = "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-modals" width="100%" height="100%" allowfullscreen src="${url}" target="_blank"></iframe>`;
    });
    var cssLink = document.createElement("link");
    cssLink.href = "../styles/index-style.css"; 
    cssLink.rel = "stylesheet"; 
    cssLink.type = "text/css"; 
}

function closeWatch(){
    var wrapper = document.getElementsByClassName("video-player")[0];
    wrapper.innerHTML = ""
    document.getElementById("video-pane").classList.add("visually-hidden")
}

function fav(name, image, id){

    var curfav = localStorage.getItem("favs");

    var tofav = `"${name}", "${image}", "${id}"`
    if(curfav.includes(tofav)){
        var ret = curfav.replace(tofav, "")
        localStorage.setItem("favs", ret)
        toast("Removed to favourites.", "red")
    }else{
        var str = localStorage.getItem("favs");
        toast("Added to favourites.", "green")
        
        localStorage.setItem("favs", `${str}, "${name}", "${image}", "${id}", `)
    }
    
    refreshFav();
    checkFav(image);
   //console.log(name + " " + image)
}

function refreshFav(){
    var wrapper = document.querySelector(".fav-section-carousel");
    wrapper.innerHTML = '';

    var favs = localStorage.getItem("favs").split(", ");
    favs = favs.filter(item => item);
    if(favs.length == 0){wrapper.innerHTML = 'No favourites.';}
    for(i = 0; i < favs.length; i+=3){
        let id = favs[i+2].replace(/^"(.*)"$/, '$1');
        let img = favs[i+1].replace(/^"(.*)"$/, '$1');
        let name = favs[i].replace(/^"(.*)"$/, '$1');
        
        let itemDiv = document.createElement("div");
        let itemImg = document.createElement("img");

        itemImg.classList.add("card-img")
        itemImg.classList.add("img-fluid")
        itemImg.classList.add("align-self-center")
        // itemImg.classList.add("start-50")
        
        itemImg.src = img;
        itemDiv.appendChild(itemImg);
        itemDiv.classList.add("card");
        itemDiv.classList.add('d-flex')
        // itemDiv.classList.add('s')
        itemDiv.setAttribute("onclick", `detail('${id}', \`${name}\`, '${img}') `);
    
        
        wrapper.appendChild(itemDiv);
    }

    $('.fav-section-carousel').flickity({
        // options
        cellAlign: 'left',
        contain: true
    });
}

function getTitle(str) {
    console.log(str)

    var thirdDashIndex = str.lastIndexOf('-'); 

    let modstr = str.slice(11, thirdDashIndex-8)
    console.log(modstr)
    return modstr;
  }


function checkFav(img){
    var favbtn = document.querySelector(".fav-button");
    var ls = localStorage.getItem("favs");
    if(ls.includes(img)){
        favbtn.setAttribute("class", "fas fa-star fav-button")
    }else{
        favbtn.setAttribute("class", "far fa-star fav-button")
    }
}

function toast(str, clr){
    Toastify({
        text: str,
        duration: 3000,
        position: "center",
        gravity: "bottom",
        backgroundColor: clr
        }).showToast();
}

function showPopular(){
    let site = 'https://runasian.net/most-popular-drama'
    var wrapper = $('.popular-section-carousel')[0];
    wrapper.innerHTML = '<i class="fas fa-spinner spinner"></i>';
    fetch(site).then(response => response.text()).then(html => 
        {
            
            var page = document.createElement('html');
            page.innerHTML = html;
        
            var ul = page.getElementsByClassName('switch-block list-episode-item')[0];
            
            wrapper.innerHTML = "";
      
            for(let child of ul.children){
    
                let itemDiv = document.createElement("div");
                let href = child.querySelector('a').getAttribute("href").slice(14);
                let name = child.querySelector('h3').innerHTML;
                let img = child.querySelector('a').querySelector('img').getAttribute("data-original");
                let itemImg = document.createElement("img");
    
                itemImg.classList.add("card-img")
                itemImg.classList.add("img-fluid")
                itemImg.classList.add("align-self-center")
                // itemImg.classList.add("start-50")
                
                itemImg.src = img;
                itemDiv.appendChild(itemImg);
                itemDiv.classList.add("card");
                itemDiv.classList.add('d-flex')
                // itemDiv.classList.add('s')
                itemDiv.setAttribute("onclick", `detail('${href}', \`${name}\`, '${img}') `);
                
                // itemDiv.innerHTML += `<p class="item-text">${name}</p>`;
            
                wrapper.appendChild(itemDiv);
                
            }
            page.remove();
        }
        
    ).then(function(response){
        $('.popular-section-carousel').flickity({
            // options
            cellAlign: 'left',
            contain: true
        });
    })
}

function showIdk(){
    let site = 'https://runasian.net'
    var wrapper = $('.popular-section-carousel')[0];
    wrapper.innerHTML = '<i class="fas fa-spinner spinner"></i>';
    fetch(site).then(response => response.text()).then(html =>{
        var page = document.createElement('html');
        page.innerHTML = html;
        console.log(page);
        var slider = page.querySelector('.ls-wp-container')
        console.log(slider);
        var rndN = Math.floor(Math.random() * slider.children.length)
        console.log(slider.children[rndN]);
        var selectedSlide = slider.children[rndN]
        var img = selectedSlide.getElementsByClassName('ls-bg')[0]
        var a = selectedSlide.getElementsByClassName('ls-link')[0]
        $('#idk-img').attr("src", img.getAttribute('src'))
        $('#idk-title').html(img.getAttribute('title'))
        $('#idk-btn').attr("onclick", `detail('${a.getAttribute("href").slice(14)}','${img.getAttribute("title")}', '${img.getAttribute('src')}')`)
    })
}

// function searchDetails(name){
//     let site = 'https://runasian.net/search?type=movies&keyword='+name
//     fetch(site).then(response => response.text()).then(html =>{
//         var page = document.createElement('html');
//         page.innerHTML = html;

//         var ul = page.getElementsByClassName('switch-block list-episode-item')[0];
//         var detailsObj ={
//             name: ul.children[0].querySelector('h3').innerHTML,
//             img: ul.children[0].querySelector('a').querySelector('img').getAttribute("data-original"),
//             href: ul.children[0].querySelector('a').getAttribute("href").slice(14)
//         }
//         console.log(detailsObj)
//         return detailsObj
//     })
// }

refreshFav()
showPopular()
showIdk()
// setTimeout(()=>{

    
// }, 500)

fetch('https://pladrac.net/download?id=NDAzNDI0&typesub=runasian-SUB&title=Wedding Impossible (2024) Episode 1').then(response => response.text()).then(html =>{
    var page = document.createElement('html');
        page.innerHTML = html;
        console.log(page);
})