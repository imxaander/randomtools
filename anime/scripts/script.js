/*fetch("https://embtaku.pro/videos/beastars-dub-episode-12").then(response => response.text()).then(html => {
    var page = document.createElement('html');
    page.innerHTML = html;
    
    let el = page.getElementsByClassName("listing items lists")[0];
    console.log(page);

    console.log(el);

});
*/
//              <iframe id="sandbox-iframe"  sandbox="allow-scripts allow-forms allow-same-origin"  width="100%" height="100%" allowfullscreen src="http://embtaku.pro/streaming.php?id=MjE3NTI3&title=Zom+100%3A+Zombie+ni+Naru+made+ni+Shitai+100+no+Koto+Episode+12&typesub=SUB" target="_blank"></iframe>
window.alias_open = window.open;
window.open = function(url, name, specs, replace) { }

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
    document.getElementById("nav-search-tab").click();
    var query = document.getElementById("search").value;
    var site;
    var isRecent;

    //set to true to default in input
    if(query != ""){
        site = 'https://embtaku.pro/search.html?keyword='+query;
        console.log("may laman")
        isRecent = false;
    }else{
        site = `https://embtaku.pro/`;
        console.log("walang laman")
        isRecent = true;
    }
    
    var wrapper = document.getElementsByClassName('search-results')[0];
    wrapper.innerHTML = '<i class="fas fa-spinner spinner"></i>';

    
    fetch(site).then(response => response.text()).then(html => 
    {
        
        var page = document.createElement('html');
        page.innerHTML = html;
    
        var ul = page.getElementsByClassName('listing items')[0];
        console.log(ul);
        
        wrapper.innerHTML = "";
  
        for(let child of ul.children){
            console.log(child)
            let itemDiv = document.createElement("div");
            let href = child.querySelector('a').getAttribute("href").slice(1);
            let name = child.querySelector('.name').textContent;
            let img = ""//child.querySelector('.img').querySelector('a').querySelector("img").getAttribute("src");
            let itemImg = document.createElement("img");

            itemImg.setAttribute("class", "item-img")
            itemImg.src = img;
            itemDiv.appendChild(itemImg);
            itemDiv.setAttribute("class", "list-items");
            itemDiv.setAttribute("onclick", `detail('${href}', \`${name}\`, '${img}') `);
            
            itemDiv.innerHTML += `<p class="item-text">${name}</p>`;
        
            wrapper.appendChild(itemDiv);
        }
        page.remove();
    }
    );
}

function detail(id, name, img){
    document.getElementById("nav-watch-tab").click();
    document.querySelector(".video-player").innerHTML = "Select an Episode :DD";
    document.querySelector(".video-title").innerHTML = name;
    document.querySelector(".fav-button").setAttribute("onclick", `fav(\`${name}\`,\`${img}\`, \`${id}\` )`)
    var wrapper = document.getElementById('item-episodes');
    
    wrapper.innerHTML = '<i class="fas fa-spinner spinner"></i>';
    
    fetch('https://embtaku.pro/'+id).then(response => response.text()).then(html =>{
        var page = document.createElement('html');
        page.innerHTML = html;

        var ul = page.getElementsByClassName("listing items lists")[0];
        console.log(ul)
    //recent,,,,, need to find how to get episodes, :DD
        
        checkFav(img);
        wrapper.innerHTML = "";

        
        for(let child of Array.from(ul.children)){

            let item = document.createElement("div");
            let number = child.querySelector(".name").innerHTML.replace(/\D/g, "").slice(4);
            let date = child.querySelector(".meta").textContent;
            let href = child.querySelector("a").getAttribute("href");
            item.setAttribute("onclick", `watch('${href}')`);
            item.setAttribute("class", `12`);
            item.innerHTML = `Episode ${number}:  ${date}`;
            
            wrapper.appendChild(item);
        }
    });
}

function watch(id){
    let sframe = document.getElementById("sandbox-iframe");
    sframe.sandbox = "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-modals";
    alert(sframe.getAttribute("src"))
    var wrapper = document.getElementsByClassName("video-player")[0];
    wrapper.innerHTML = '<i class="fas fa-spinner spinner"></i>';
    
    let link = "https://embtaku.pro"+id;
    fetch(link).then(response => response.text()).then(html => {

        var page = document.createElement("html")
        page.innerHTML = html;
        console.log(page)
        var title = page.querySelector(".video-info-left").querySelector("h1").innerHTML;
        document.querySelector(".video-title").innerHTML = title;
        var url = page.getElementsByClassName("play-video")[0].querySelector("iframe").getAttribute("src");
        console.log(url);
        wrapper.innerHTML = `<iframe id="video-player-iframe" sandbox = "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-modals" width="100%" height="100%" allowfullscreen src="https:${url}" target="_blank"></iframe>`;
    });
    var cssLink = document.createElement("link");
    cssLink.href = "../styles/index-style.css"; 
    cssLink.rel = "stylesheet"; 
    cssLink.type = "text/css"; 
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
    var wrapper = document.querySelector(".favs");
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
        itemImg.setAttribute("class", "item-img")
        itemImg.src = img;
        itemDiv.appendChild(itemImg);
        itemDiv.setAttribute("class", "list-items");
        itemDiv.setAttribute("onclick", `detail('${id}', \`${name}\`, '${img}') `);
        
        itemDiv.innerHTML += `<p class="item-text">${name}</p>`;
        
        wrapper.appendChild(itemDiv);
    }
}


function getTitle(str) {
    console.log(str)

    var thirdDashIndex = str.lastIndexOf('-'); 

    let modstr = str.slice(11, thirdDashIndex-8)

    return modstr;
  }

function removeAds(){
    document.getElementById('video-player').contentWindow.document.querySelector("");
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


var iframes;
var innerDoc;

function coi(){
    iframes = document.getElementById('video-player-iframe');
    innerDoc = (iframes.contentDocument) ? iframes.contentDocument : iframes.contentWindow.document;
}

  

function setColor(){}

var r = document.querySelector(':root');
r.style.setProperty('--dark', localStorage.getItem("color"));

refreshFav();
document.getElementById("search").dispatchEvent(new Event('input'));

