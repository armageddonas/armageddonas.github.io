window.onload = function () {
    let bannerDiv = document.getElementById("bannerMenu");
    if (bannerDiv) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                if (this.status == 404) { elmnt.innerHTML = "Page not found."; }                
            }
        }
        xhttp.open("GET", "https://armageddonas.github.io/components/bannerMenu/bannerMenu.html", true);
        xhttp.send();
    }
};