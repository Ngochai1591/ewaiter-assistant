
const slugify = require('slugify')

let foodList = ["caramel", "chà bông cay"];
let allDishes = [
    {
        "id": 1,
        "name": "chà bông cay"
    }, 
    {
        "id": 2,
        "name": "caramel"
    },
    {
        "id": 3,
        "name": "coffee"
    },
    {
        "id": 4,
        "name": "latte"
    }
];

let change_list_object_to_list = (object_list) =>{
    var newList = [];
    object_list.forEach((object)=>{
        console.log(object['name'])
        var en_name = replace_vietnamese_text(object["name"])
        newList.push(en_name);
    });

    return newList;
}

var newFoodList = change_list_object_to_list(allDishes);


let isValid = (arr, target) => target.every( v =>  {
    console.log(v)
    return arr.includes(v)
})

let change_foodList_to_en_text = (foodList) =>{
    // console.log(foodList.length)
    var newFoodList = []
    foodList.forEach((food) =>{
        var newText = replace_vietnamese_text(food);
        // console.log(newText)
        newFoodList.push(newText)
    });
    // console.log("NEW FOOD LIST", newFoodList)
    return newFoodList;
}

const replace_vietnamese_text = (vietnamese_text) =>{
    var en_text = slugify(vietnamese_text, {locale: 'vi'});
    en_text = en_text.toLowerCase();
    en_text = en_text.split('-').join(' ');
    return en_text
} 

var newList = change_foodList_to_en_text(foodList);
console.log("NEW_LIST", newList)
console.log("NEW_FOOD_LIST", newFoodList)
console.log(isValid(newFoodList, newList));