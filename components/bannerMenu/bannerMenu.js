window.addEventListener('load', function () {
    let bannerDiv = document.getElementById("bannerMenu");
    bannerDiv.style.width = "100%";
    if (bannerDiv) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) { bannerDiv.innerHTML = this.responseText; }
                if (this.status == 404) { bannerDiv.innerHTML = "Page not found."; }                
            }
        }
        xhttp.open("GET", "https://armageddonas.github.io/components/bannerMenu/bannerMenu.html", true);
        xhttp.send();
    }
    var loc = window.location.pathname;
    var dir = loc.substring(0, loc.lastIndexOf('/'));
    dir = dir.substring(0, dir.lastIndexOf('/')).split('/').slice(-1)[0];
    if (dir === "generators") {
        var temp = document.getElementsByClassName("banner-links");
        console.log(temp)
    }

});