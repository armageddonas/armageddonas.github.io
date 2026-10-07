

function generateType() {
    let herbTypeInput = document.getElementById("herbTypeInput");
    let typeLock = document.getElementById("typeLock");
    if (!typeLock.checked) {
        let names = getTypes();
        herbTypeInput.value = names[Math.floor(Math.random() * names.length)]
    }
}