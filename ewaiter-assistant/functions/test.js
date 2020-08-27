
// // const slugify = require('slugify');
// // const { NewSurface } = require('actions-on-google');

// // let foodList = ["caramel", "cha bong cay", "ca phe chon"];
// // let quantityList = [5, 4, 3];
// // let allDishes = [
// //     {
// //         "id": 1,
// //         "name": "Chà Bông Cay"
// //     }, 
// //     {
// //         "id": 2,
// //         "name": "caramel"
// //     },
// //     {
// //         "id": 3,
// //         "name": "coffee"
// //     },
// //     {
// //         "id": 4,
// //         "name": "latte"
// //     },
// //     {
// //         "id": 5,
// //         "name": "cà phê chồn"
// //     }
// // ];

// // const change_to_foodList = (allDishes) =>{
// //     var foodList = []
// //     allDishes.forEach((dish)=>{
// //         var newName = remove_vietnamese_sign(dish['name'].toLowerCase())
// //         foodList.push(newName)
// //     });

// //     return foodList;
// // }

// // const remove_vietnamese_sign = (vietnameses_text) =>{
// //     var newText = slugify(vietnameses_text, {locale: "vi"});
// //     newText  = newText.split('-').join(' ');
// //     return newText
// // }

// // const isValid = (newFoodList, foodList) =>{
// //     return foodList.every((food) => {
// //         // console.log(food);
// //         return newFoodList.includes(food);
// //     });
// // }

// // const check_invalid_food = (newFoodList, foodList) =>{
// //     inValidFoodList = [];
// //     validFoodList = [];
// //     foodList.forEach((food) =>{
// //         // console.log(food)
// //         if(newFoodList.includes(food)){
// //             console.log(`[INFO] ${food} is valid `);
// //             validFoodList.push(food);
// //         }
// //         else{
// //             console.log(`[INFO] ${food} is not valid`);
// //             inValidFoodList.push(food);
// //         }
// //     });
// //     return {"inValidFoodList": inValidFoodList, "validFoodList": validFoodList};
// // }

// // const array_to_string = (arr, quantityList) =>{
// //     var newString = ""
// //     if(quantityList === null){
// //         arr.forEach((element, index, array)=>{
// //             if(index !== array.length-1){
// //                 newString += element + ", ";
// //             }else{
// //                 newString += element;
// //             }
// //         });
// //     }
// //     else{
// //         arr.forEach((element, index, array) =>{
// //             if( index !== array.length-1){
// //                 newString += quantityList[index] + " " + element + ", ";
// //             }
// //             else{
// //                 newString += quantityList[index] + " " + element;
// //             }
// //         })
// //     }
// //     return newString
// // }

// // const create_temp_order = (foodList, quantityList) =>{
// //     var tempOrderList = []
// //     foodList.forEach((element, index, array)=>{
// //         var tempObject = {
// //             "name": element, 
// //             "quantity": quantityList[index]
// //         }
// //         tempOrderList.push(tempObject);
// //     });
// //     return tempOrderList;
// // }

// // const create_order_info = (foodList, quantityList, get_all_order) =>{
// //     var tempOrder = create_temp_order(foodList, quantityList);
// //     // console.log("TEMP_ORDER", tempOrder);
// //     var order_info = []
// //     get_all_order.forEach((foodDetail)=>{
// //         // console.log(foodDetail);
// //         var newFoodName = remove_vietnamese_sign(foodDetail["name"].toLowerCase())
// //         // console.log(newFoodList)
// //         if(foodList.includes(newFoodName)){
// //             console.log("VALID", foodDetail)
// //             tempOrder.forEach((order)=>{
// //                 if(order['name'] === newFoodName){
// //                     // console.log("ORDER", order)
// //                     foodDetail["quantity"] = order['quantity'];
// //                     // console.log(foodDetail)
// //                     order_info.push(foodDetail)
// //                 }
// //             })
// //         }
// //         else{
// //             console.log("INVALID", foodDetail)
// //         }
// //     });

// //     return order_info
// // }

// // var newFoodList = change_to_foodList(allDishes);
// // console.log("FOOD_LIST", foodList)
// // console.log("NEW_FOOD_LIST", newFoodList)

// // if(isValid(newFoodList, foodList)){
// //     console.log("VALID")
// //     var order_arr = array_to_string(foodList, quantityList);
// //     console.log(order_arr)
// //     var order_info = create_order_info(foodList, quantityList, allDishes);
// //     // console.log(order_info)
// //     if(order_info){
// //         console.log("ORDER_INFO", order_info);
        
// //     }
// //     else{
// //         console.log("SOMETHING HAPPENED");
// //     }
// // }else{
// //     console.log("NOT VALID")
// //     var foodObject = check_invalid_food(newFoodList, foodList);
// //     inValidFoodList = foodObject['inValidFoodList'];
// //     validFoodList = foodObject['validFoodList'];
// //     console.log("INVALID_FOOD_LIST", inValidFoodList);
// //     console.log("VALID_FOOD_LIST", validFoodList)
// // }


// const TOKEN = "Token 4c9d8c4423f12e4fa0084302b145fd94983001fa";
// const axios = require('axios');

// const orders = [
//     {
//       "size": null,
//       "id": 20,
//       "name": "Chà Bông Cay",
//       "avatarUrl": "https://ewaiter-prod.s3.amazonaws.com/django/cha_bong_cay.jpg",
//       "isAvailable": true,
//       "extraOption": null,
//       "vendor": 4,
//       "category": 1,
//       "quantity": 2,
//       "description": "Rousong, also known as meat wool, meat floss, pork floss, beef floss, abon, pork sung or yuk sung, is a dried meat product with a light and fluffy texture similar to coarse cotton, originating from China.",
//       "basePrice": 1.2
//     },
//     {
//       "basePrice": 2.75,
//       "category": 1,
//       "name": "Latte",
//       "avatarUrl": "https://ewaiter-prod.s3.amazonaws.com/django/latte.jpg",
//       "quantity": 1,
//       "isAvailable": true,
//       "vendor": 4,
//       "size": null,
//       "id": 17,
//       "extraOption": null,
//       "description": "Caffe latte is a coffee drink made with espresso and steamed milk. The word comes from the Italian caffè e latte, caffelatte or caffellatte, which means \"coffee & milk\"."
//     }
// ]


// var newOrderList = []
// orders.forEach((order)=>{
//     // console.log(order)
//     //get id and quantity
//     console.log("ID", order['id']);
//     console.log("QUANTITY", order['quantity']);
//     var orderObject = {};
//     orderObject['dishId'] = order['id']
//     orderObject['quantity'] = order['quantity']
//     newOrderList.push(orderObject)
// });

// console.log(newOrderList)

// const orderFood = (url, order, tableId) => {
//     var data = {
//         "tableId": tableId,
//         "orderDetails": order
//     };
    
//     var headers = {
//         "headers": {
//             'Content-Type': 'application/json',
//             'Authorization': TOKEN
//         }
//     };
//     return axios.post(url, data,headers);
// }
// let API_ENDPOINT = "http://platform.ewaiter.tech/api";
// let url = API_ENDPOINT + '/orders/';
// let result = orderFood(url, newOrderList, 65).then((res)=>{
//     if(res.data){
//         console.log(res.data);
//         return res.data
//     }
// }).catch((err)=>{
//     console.log("ERROR",err)
// });

// console.log(result)



const slugify = require('slugify');

const get_all_order = [
    {
        "id": 24,
        "name": "shrimp",
        "description": null,
        "vendor": 4,
        "category": 1,
        "size": null,
        "basePrice": null,
        "isAvailable": true,
        "avatarUrl": null,
        "extraOption": null
    },
    {
        "id": 23,
        "name": "xvbcvb",
        "description": null,
        "vendor": 4,
        "category": 1,
        "size": null,
        "basePrice": null,
        "isAvailable": true,
        "avatarUrl": null,
        "extraOption": null
    },
    {
        "id": 22,
        "name": "aaaa",
        "description": null,
        "vendor": 4,
        "category": 1,
        "size": null,
        "basePrice": null,
        "isAvailable": true,
        "avatarUrl": null,
        "extraOption": null
    },
    {
        "id": 21,
        "name": "a1",
        "description": null,
        "vendor": 4,
        "category": 1,
        "size": null,
        "basePrice": null,
        "isAvailable": true,
        "avatarUrl": null,
        "extraOption": null
    },
    {
        "id": 20,
        "name": "Chà Bông Cay",
        "description": "Rousong, also known as meat wool, meat floss, pork floss, beef floss, abon, pork sung or yuk sung, is a dried meat product with a light and fluffy texture similar to coarse cotton, originating from China.",
        "vendor": 4,
        "category": 1,
        "size": null,
        "basePrice": 1.2,
        "isAvailable": true,
        "avatarUrl": "https://ewaiter-prod.s3.amazonaws.com/django/cha_bong_cay.jpg",
        "extraOption": null
    },
    {
        "id": 19,
        "name": "Caramel",
        "description": "The recipe is simply a combination of brewed coffee and warmed milk infused with caramel and brown sugar. Top with whipped cream and extra caramel for that coffeehouse look.",
        "vendor": 4,
        "category": 1,
        "size": null,
        "basePrice": 3.75,
        "isAvailable": true,
        "avatarUrl": "https://ewaiter-prod.s3.amazonaws.com/django/caramel.jpg",
        "extraOption": null
    },
    {
        "id": 18,
        "name": "Espresso",
        "description": "Is a coffee-making method of Italian origin, in which a small amount of nearly boiling water is forced under pressure (expressed) through finely-ground coffee beans.",
        "vendor": 4,
        "category": 1,
        "size": null,
        "basePrice": 1.5,
        "isAvailable": true,
        "avatarUrl": "https://ewaiter-prod.s3.amazonaws.com/django/espresso.jpg",
        "extraOption": null
    },
    {
        "id": 17,
        "name": "Latte",
        "description": "Caffe latte is a coffee drink made with espresso and steamed milk. The word comes from the Italian caffè e latte, caffelatte or caffellatte, which means \"coffee & milk\".",
        "vendor": 4,
        "category": 1,
        "size": null,
        "basePrice": 2.75,
        "isAvailable": true,
        "avatarUrl": "https://ewaiter-prod.s3.amazonaws.com/django/latte.jpg",
        "extraOption": null
    },
    {
        "id": 16,
        "name": "Mocha",
        "description": "A caffè mocha, also called mocaccino, is a chocolate-flavoured variant of a caffè latte. Other commonly used spellings are mochaccino and also mochachino. The name is derived from the city of Mocha, Yemen, which was one of the centers of early coffee trade.",
        "vendor": 4,
        "category": 1,
        "size": null,
        "basePrice": 3.45,
        "isAvailable": true,
        "avatarUrl": "https://ewaiter-prod.s3.amazonaws.com/django/mocha.jpg",
        "extraOption": null
    },
    {
        "id": 15,
        "name": "Cappuccino",
        "description": "A cappuccino is an espresso-based coffee drink that originated in Italy, and is traditionally prepared with steamed milk foam. Variations of the drink involve the use of cream instead of milk, using non-dairy milks, and flavoring with cinnamon or chocolate powder.",
        "vendor": 4,
        "category": 1,
        "size": null,
        "basePrice": 1.72,
        "isAvailable": true,
        "avatarUrl": "https://ewaiter-prod.s3.amazonaws.com/django/capuchino.jpg",
        "extraOption": null
    }
]


const TEMP_ORDER = [ 
    { 
        "name": 'cha bong cay', 
        "quantity": 1 
    },
    {
        "name": 'latte',
        "quantity": 2
    }
]

const foodList = ['Cha bong cay', 'latte']
const quantityList = [1,2]

const remove_vietnamese_sign = (vietnameses_text) => {
    var newText = slugify(vietnameses_text, {
        locale: "vi"
    });
    newText = newText.split('-').join(' ');
    return newText
}

const change_to_foodList = (allDishes) => {
    var foodList = []
    allDishes.forEach((dish) => {
        var newName = remove_vietnamese_sign(dish['name'].toLowerCase())
        foodList.push(newName)
    });
    return foodList;
}
const isValid = (newFoodList, foodList) => {
    return foodList.every((food) => {
        // console.log(food);
        return newFoodList.includes(food.toLowerCase());
    });
}

const create_order_info = (foodList, quantityList, get_all_order) =>{
    // var tempOrder = create_temp_order(foodList, quantityList);
    // console.log("TEMP_ORDER", tempOrder);
    foodList = format_list(foodList)
    var tempOrder = TEMP_ORDER;
    var order_info = []
    get_all_order.forEach((foodDetail)=>{
        // console.log(foodDetail);
        var newFoodName = remove_vietnamese_sign(foodDetail["name"].toLowerCase())
        console.log("NEW_FOOD_NAME",newFoodName)
        if(foodList.includes(newFoodName)){
            console.log("VALID", foodDetail["name"])
            tempOrder.forEach((order)=>{
                if(order['name'] === newFoodName){
                    // console.log("ORDER", order)
                    foodDetail["quantity"] = order['quantity'];
                    // console.log(foodDetail)
                    order_info.push(foodDetail)
                }
            })
        }
        else{
            // console.log("INVALID", foodDetail["name"])
        }
    });

    return order_info
}

const format_list = (list) =>{
    var newFormatList = []
    list.forEach((item)=>{
        newFormatList.push(item.toLowerCase())
    });
    return newFormatList;
}

var order_info = create_order_info(foodList, quantityList, get_all_order);

console.log(order_info)



// var newFoodList = change_to_foodList(get_all_order);
// console.log(newFoodList)