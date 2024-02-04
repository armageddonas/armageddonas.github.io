window.addEventListener('load', function () {
    setupDatalist(document.getElementById('lineagesList'), getLineages());
    setupDatalist(document.getElementById('heritagesList'), getLineages());
    setupDatalist(document.getElementById('culturesList'), getCultures());
});

function setupDatalist(list, data){
    data.forEach(item => {
        let option = document.createElement('option');
        option.value = item;
        list.appendChild(option);
    });
}