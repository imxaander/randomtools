function search(){
    var query = document.getElementById("search").value;
    var wrapper = document.getElementsByClassName('search-results')[0];
    wrapper.innerHTML = '<i class="fas fa-spinner spinner"></i>';
    fetch('https://dramacool.com.pa/search?type=movies&keyword='+query).then(response => response.text()).then(html => 
    {
        
        var page = document.createElement('html');
        page.innerHTML = html;
    
        var ul = page.getElementsByClassName('switch-block list-episode-item')[0];
        
        wrapper.innerHTML = "";
  
        for(let child of ul.children){
            //informations
            let href = child.querySelector('a').getAttribute("href").slice(14);
            let name = child.querySelector('h3').innerHTML;
            let img = child.querySelector('a').querySelector('img').getAttribute("data-original");
            let item = document.createElement("div");
            item.setAttribute("class", "list-items");
            item.setAttribute("onclick", `detail('${href}', \`${name}\`)`);
            item.setAttribute("style", `background-image: url('${img}')`)
            item.innerHTML = `${name}`;


            wrapper.appendChild(item);
        }
        page.remove();
    }
    );
}

function detail(id, name){
    document.getElementById("nav-watch-tab").click();
    document.querySelector(".video-player").innerHTML = "Select an Episode :DD";
    document.querySelector(".video-title").innerHTML = name;
    var wrapper = document.getElementById('item-episodes');
    
    wrapper.innerHTML = '<i class="fas fa-spinner spinner"></i>';
    
    fetch('https://dramacool.com.pa/drama-detail/'+id).then(response => response.text()).then(html =>{
        var page = document.createElement('html');
        page.innerHTML = html;

        var tab = document.createElement("div");
        tab.innerHTML = page.getElementsByClassName("tab-content left-tab-1")[0].outerHTML;

        var ul = tab.querySelector("ul");
        
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
    movieModal.toggle();
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
        wrapper.innerHTML = `<iframe id="video-player-iframe" sandbox = "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation" width="100%" height="100%" allowfullscreen src="${url}" target="_blank"></iframe>`;
    });
}


/*


*/

