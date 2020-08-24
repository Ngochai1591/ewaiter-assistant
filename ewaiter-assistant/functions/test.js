
const slugify = require('slugify');
const { NewSurface } = require('actions-on-google');

let foodList = ["caramel", "cha bong cay"];
let quantityList = [5, 4];
let allDishes = [
    {
        "id": 1,
        "name": "Chà Bông Cay"
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

const change_to_foodList = (allDishes) =>{
    var foodList = []
    allDishes.forEach((dish)=>{
        var newName = remove_vietnamese_sign(dish['name'].toLowerCase())
        foodList.push(newName)
    });

    return foodList;
}

const remove_vietnamese_sign = (vietnameses_text) =>{
    var newText = slugify(vietnameses_text, {locale: "vi"});
    newText  = newText.split('-').join(' ');
    return newText
}

const isValid = (newFoodList, foodList) =>{
    return foodList.every((food) => {
        // console.log(food);
        return newFoodList.includes(food);
    });
}

const check_invalid_food = (newFoodList, foodList) =>{
    inValidFoodList = [];
    validFoodList = [];
    foodList.forEach((food) =>{
        // console.log(food)
        if(newFoodList.includes(food)){
            console.log(`[INFO] ${food} is valid `);
            validFoodList.push(food);
        }
        else{
            console.log(`[INFO] ${food} is not valid`);
            inValidFoodList.push(food);
        }
    });
    return {"inValidFoodList": inValidFoodList, "validFoodList": validFoodList};
}

const array_to_string = (arr, quantityList) =>{
    var newString = ""
    if(quantityList === null){
        arr.forEach((element, index, array)=>{
            if(index !== array.length-1){
                newString += element + ", ";
            }else{
                newString += element;
            }
        });
    }
    else{
        arr.forEach((element, index, array) =>{
            if( index !== array.length-1){
                newString += quantityList[index] + " " + element + ", ";
            }
            else{
                newString += quantityList[index] + " " + element;
            }
        })
    }
    return newString
}

const create_order_info = (foodList, quantityList, get_all_order) =>{
    get_all_order.forEach((foodDetail)=>{
        // console.log(foodDetail);
        var newFoodName = remove_vietnamese_sign(foodDetail["name"].toLowerCase())
        console.log(newFoodList)
        if(foodList.includes(newFoodName)){
            console.log("VALID", foodDetail)
        }
        else{
            console.log("INVALID", foodDetail)
        }
    })
}

var newFoodList = change_to_foodList(allDishes);
console.log("FOOD_LIST", foodList)
console.log("NEW_FOOD_LIST", newFoodList)

if(isValid(newFoodList, foodList)){
    console.log("VALID")
    var order_arr = array_to_string(foodList, quantityList);
    console.log(order_arr)
    var order_info = create_order_info(foodList, quantityList, allDishes);
}else{
    console.log("NOT VALID")
    var foodObject = check_invalid_food(newFoodList, foodList);
    inValidFoodList = foodObject['inValidFoodList'];
    validFoodList = foodObject['validFoodList'];
    console.log("INVALID_FOOD_LIST", inValidFoodList);
    console.log("VALID_FOOD_LIST", validFoodList)
}

