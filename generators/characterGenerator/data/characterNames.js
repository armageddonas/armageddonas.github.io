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
                "Darcel",
                "Denos",
                "Fleras",
                "Harkel",
                "Koronios",
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
                "Darcel",
                "Denan",
                "Harkel",
                "Jeron",
                "Koran",
                "Mikal",
                "Memor",
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
        case "Ad'Ashani":
            names = [
                "Ahewa",
                "Arhan",
                "Asharajan",
                "Kahan",
                "Kehar",
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
                "Denia",
                "Fleryanna",
                "Frieda",
                "Imrodel",
                "Irisa",
                "Koritha",
                "Koronia",
                "Liann",
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
    }

    return names;
}