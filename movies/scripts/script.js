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
    if(true){
        site = 'https://fmoviesz.to/'+query;
        console.log("may laman")
        isRecent = false;
    }else{
        site = `https://dramacool.com.pa/`;
        console.log("walang laman")
        isRecent = true;
    }
    
    var wrapper = document.getElementsByClassName('search-results')[0];
    wrapper.innerHTML = '<i class="fas fa-spinner spinner"></i>';

    
    fetch("https://fmoviesz.to/home").then(response => response.text()).then(html => 
    {
        console.log(html);
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
search()