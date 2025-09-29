import oakImage from "./Images/homePage_oak.webp";
import coconutImage from "./Images/homePage_coconut.webp";
import acaciaImage from "./Images/homePage_acacia.webp";

const trees = [
    {
        tree_id: 1,
        name: "Chêne",
        image: oakImage,
        price: 100,
        localization: "Europe",
        project_name: "Forêt du Morvan",
    },
    {   
        tree_id: 2,
        name: "Acacia",
        image: acaciaImage,
        price: 90,
        localization: "Asie",
        project_name: "Plantation Dong Chau",
    },
    {   
        tree_id: 3,
        name: "Cocotier",
        image: coconutImage,
        price: 125,
        localization: "Afrique",
        project_name: "Plantation Grand-Bassam",
    }
]

export default trees;