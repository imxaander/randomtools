function search(){
    document.getElementById("nav-search-tab").click();
    var query = document.getElementById("search").value;
    var site;
    var isRecent;

    //set to true to default in input
    if(true){
        site = 'https://dramacool.com.pa/search?type=movies&keyword='+query;
        console.log("may laman")
        isRecent = false;
    }else{
        site = `https://dramacool.com.pa/`;
        console.log("walang laman")
        isRecent = true;
    }
    
    var wrapper = document.getElementsByClassName('search-results')[0];
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

            if(isRecent){
                href = getTitle(href);
            }
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
    
    fetch('https://dramacool.com.pa/drama-detail/'+id).then(response => response.text()).then(html =>{
        var page = document.createElement('html');
        page.innerHTML = html;

        var tab = document.createElement("div");
        tab.innerHTML = page.getElementsByClassName("tab-content left-tab-1")[0].outerHTML;

        var ul = tab.querySelector("ul");

        
        checkFav(img);
        wrapper.innerHTML = "";

        
        for(let child of Array.from(ul.children)){

            let item = document.createElement("div");
            let number = child.querySelector("h3").textContent.replace(/\D/g, "").slice(4);
            let date = child.querySelector(".time").textContent;
            let href = child.querySelector("a").getAttribute("href");
            item.setAttribute("onclick", `watch('${href}')`);
            item.setAttribute("class", `12`);
            item.innerHTML = `Episode ${number}:  ${date}`;
            
            wrapper.appendChild(item);
        }
    });
}

function watch(id){
    var wrapper = document.getElementsByClassName("video-player")[0];
    wrapper.innerHTML = '<i class="fas fa-spinner spinner"></i>';
    
    let link = "https://dramacool.com.pa"+id;
    fetch(link).then(response => response.text()).then(html => {
        var page = document.createElement("html")
        page.innerHTML = html;
        var title = page.querySelector("strong").innerHTML;
        document.querySelector(".video-title").innerHTML = title;
        var url = page.getElementsByClassName("watch_video watch-iframe")[0].querySelector("iframe").getAttribute("src");
        console.log(url);
        wrapper.innerHTML = `<iframe id="video-player-iframe" sandbox = "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-modals" width="100%" height="100%" allowfullscreen src="${url}" target="_blank"></iframe>`;
    });
    var cssLink = document.createElement("link");
    cssLink.href = "../styles/index-style.css"; 
    cssLink.rel = "stylesheet"; 
    cssLink.type = "text/css"; 
}

function fav(name, image, id){
    if(localStorage.getItem("favs") == null){
        localStorage.setItem("favs", "")
    }
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
    console.log(modstr)
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
refreshFav();
document.getElementById("search").dispatchEvent(new Event('input'));


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

