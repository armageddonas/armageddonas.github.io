function getAllNames(culture) {
    let maleNames = getMaleNames(culture);
    return maleNames.concat(getFemaleNames(culture));
}

function getMaleNames(culture) {
    let names = []
    switch (culture) {
        case "Athelian":
            names = [
                "Aldin",
                "Argal",
                "Atharon",
                "Athyer",
                "Beren",
                "Bobart",
                "Crast",
                "Darathan",
                "Darcel",
                "Denos",
                "Esrel",
                "Fleras",
                "Harkel",
                "Koronios",
                "Marten",
                "Memor",
                "Nimber",
                "Nosten",
                "Otto",
                "Sennet",
                "Silan",
                "Tanos",
                "Teren",
                "Thomas"
            ]
            break;
        case "Dernian":
            names = [
                "Argal",
                "Athyer",
                "Beren",
                "Bethend",
                "Bobart",
                "Cillian",
                "Darathan",
                "Darcel",
                "Denan",
                "Harkel",
                "Jeron",
                "Koran",
                "Marten",
                "Memor",
                "Mikal",
                "Nimber",
                "Nosten",
                "Rurik",
                "Sirik",
                "Syras",
                "Tarkan",
                "Taren",
                "Tarestan",
                "Thomas"
            ]
            break;
        case "Ad'Ashani":
            names = [
                "Ahewa",
                "Arhan",
                "Asharajan",
                "Hamar",
                "Kahan",
                "Kehar",
                "Nori’kawua",
                "Oshowa",
                "Ramar"
            ]
            break;
        case "Imperial":
            names = [
                "Aldas",
                "Argal",
                "Atharos",
                "Athyer",
                "Beren",
                "Darcel",
                "Denavas",
                "Denos",
                "Fleras",
                "Fleravas",
                "Gellen",
                "Harakel",
                "Kazmodus",
                "Kathvas",
                "Koronios",
                "Koronvas",
                "Magnus",
                "Nosten",
                "Otto",
                "Silas",
                "Syras",
                "Tanogvas",
                "Tanos",
                "Teren",
                "Tharestas",
                "Thomas",
                "Vanecas"
            ]
            break;
        case "Sonorian":
            names = [
                "Crast",
                "Makr",
                "Memor",
                "Rodgar",
                "Rurik",
                "Sirik",
                "Sravian",
                "Sveranek"
            ]
            break;
        case "Dortook":
            names = [
                "Gorash"
            ]
    }

    return names;
}

function getFemaleNames(culture) {
    let names = []
    switch (culture) {
        case "Athelian":
            names = [
                "Alva",
                "Amelia",
                "Anna",
                "Anyale",
                "Denia",
                "Esrela",
                "Fleryanna",
                "Frieda",
                "Imrodel",
                "Irisa",
                "Koritha",
                "Koronia",
                "Lian",
                "Meline",
                "Miranya",
                "Tania"
            ]
            break;
        case "Ad'Ashani":
            names = [
                "Niya",
                "Surna"
            ]
            break;
        case "Dernian":
            names = [
                "Anna",
                "Athara",
                "Dara",
                "Denia",
                "Fleryanna",
                "Ithrelana",
                "Irisa",
                "Irna",
                "Jera",
                "Kaela",
                "Koria",
                "Mirian",
                "Nira",
                "Nostera",
                "Tania"
            ]
            break;
        case "Imperial":
            names = [
                "Alva",
                "Anna",
                "Aria",
                "Athara",
                "Breka",
                "Denia",
                "Estee",
                "Fleryanna",
                "Irisa",
                "Kaela",
                "Koritha",
                "Koronia",
                "Nostera",
                "Stora",
                "Tania",
                "Tharesia"
            ]
            break;
        case "Sonorian":
            names = [
                "Audreys",
                "Frieda",
                "Lian"
            ]
            break;
    }

    return names;
}