function getProfessions(culture) {
    let profs = []
    switch (culture) {
        case "Ad'Ashani":
            profs = [
                "Agent",
                "Alchemist",
                "Beast Handler",
                "Courtesan",
                "Courtier",
                "Crafter",
                "Entertainer",
                "Farmer",
                "Fisher",
                "Herder",
                "Hunter",
                "Landlord",
                "Magician",
                "Merchant",
                "Miner",
                "Official",
                "Physician",
                "Priest",
                "Sailor",
                "Scholar",
                "Scout",
                "Thief",
                "Warrior",
                "Wise One"
            ]
            break;
        case "Athelian":
            profs = [
                "Agent",
                "Alchemist",
                "Beast Handler",
                "Courtesan",
                "Courtier",
                "Crafter",
                "Entertainer",
                "Farmer",
                "Fisher",
                "Forester",
                "Herder",
                "Hunter",
                "Landlord",
                "Magician",
                "Merchant",
                "Miner",
                "Official",
                "Physician",
                "Priest",
                "Sailor",
                "Scholar",
                "Scout",
                "Thief",
                "Warrior"
            ]
            break;
        case "Dernian":
            profs = [
                "Agent",
                "Alchemist",
                "Beast Handler",
                "Courtesan",
                "Courtier",
                "Crafter",
                "Entertainer",
                "Farmer",
                "Fisher",
                "Forester",
                "Herder",
                "Hunter",
                "Landlord",
                "Merchant",
                "Miner",
                "Official",
                "Physician",
                "Priest",
                "Sailor",
                "Scholar",
                "Scout",
                "Thief",
                "Warrior"
            ]
            break;
        case "Sonorian":
            profs = [
                "Agent",
                "Alchemist",
                "Beast Handler",
                "Courtesan",
                "Crafter",
                "Entertainer",
                "Farmer",
                "Fisher",
                "Forester",
                "Herder",
                "Hunter",
                "Landlord",
                "Merchant",
                "Miner",
                "Official",
                "Physician",
                "Priest",
                "Runesmith",
                "Sailor",
                "Scholar",
                "Scout",
                "Thief",
                "Warrior",
                "Wise One"
            ]
            break;
        case "Tali":
            profs = [
                "Alchemist",
                "Beast Handler",
                "Courtesan",
                "Crafter",
                "Entertainer",
                "Fisher",
                "Forester",
                "Herder",
                "Hunter",
                "Magician",
                "Merchant",
                "Physician",
                "Priest",
                "Sailor",
                "Scholar",
                "Scout",
                "Thief",
                "Warrior",
                "Wise One"
            ]
            break;
        case "Imperial":
            profs = [
                "Agent",
                "Alchemist",
                "Beast Handler",
                "Courtesan",
                "Courtier",
                "Crafter",
                "Entertainer",
                "Farmer",
                "Fisher",
                "Forester",
                "Herder",
                "Hunter",
                "Landlord",
                "Magician",
                "Merchant",
                "Miner",
                "Official",
                "Physician",
                "Priest",
                "Sailor",
                "Scholar",
                "Scout",
                "Thief",
                "Warrior"
            ]
            break;
    }
    return profs;
}