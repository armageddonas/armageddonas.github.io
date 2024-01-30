function generateCharacter() {
    generateCulture();
    generateLineage();
    generateHeritage();
    generateSex();
    generateName();
    generateProfession();
}

function generateSex() {
    fetch('./data/data.json')
        .then((response) => response.json())
        .then((json) => console.log(json));
    let sex = document.getElementById("characterSex");
    let sexLock = document.getElementById("sexLock");
    if (!sexLock.checked) {
        let amount = sex.options.length;
        if (amount == 0) {
            sex.options.selectedIndex = amount;
        } else {
            sex.options.selectedIndex = Math.floor(Math.random() * (amount-1)+1);
        }
    }    
}

function generateName() {
    let nameInput = document.getElementById("characterNameInput");
    let nameLock = document.getElementById("nameLock");
    sex = document.getElementById("characterSex").value;
    culture = document.getElementById("characterCultureInput").value;
    if (!nameLock.checked) {
        let names = [];
        let cultures = getCultures();
        if (cultures.includes(culture)) {
            names = selectNameBySex(sex, culture);
        } else {
            cultures.forEach(culture => names.push(...selectNameBySex(sex, culture)));
        }
        nameInput.value = names[Math.floor(Math.random() * names.length)]
    }
}

function selectNameBySex(sex, culture) {
    let names = [];
    if (sex === "Male") {
        names = getMaleNames(culture);
    } else if (sex === "Female") {
        names = getFemaleNames(culture);
    } else {
        names = getAllNames(culture);
    }
    return names;
}

function generateLineage() {
    let lineageLock = document.getElementById("lineageLock");
    let lineageInput = document.getElementById("characterLineageInput")
    if (!lineageLock.checked) {
        let lineages = getLineages();
        lineageInput.value = lineages[Math.floor(Math.random() * lineages.length)]
    }
}

function generateHeritage() {
    let heritageLock = document.getElementById("heritageLock");
    let heritageInput = document.getElementById("characterHeritageInput")
    if (!heritageLock.checked) {
        let heritages = getLineages();
        heritageInput.value = heritages[Math.floor(Math.random() * heritages.length)]
    }
}

function generateCulture() {
    let cultureLock = document.getElementById("cultureLock");
    let cultureInput = document.getElementById("characterCultureInput")
    if (!cultureLock.checked) {
        let cultures = getCultures();
        cultureInput.value = cultures[Math.floor(Math.random() * cultures.length)]
    }
}

function generateProfession(culture) {
    let professionLock = document.getElementById("professionLock");
    let professionInput = document.getElementById("characterProfessionInput")
    culture = document.getElementById("characterCultureInput").value;
    if (!professionLock.checked) {
        let cultures = getCultures();
        let professions = [];
        if (cultures.includes(culture)) {
            professions = getProfessions(culture);
        } else {
            cultures.forEach(culture => professions.push(...getProfessions(culture)));
        }
        professionInput.value = professions[Math.floor(Math.random() * professions.length)]
    }
}
