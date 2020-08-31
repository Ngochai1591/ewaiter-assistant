'use strict';

const slugify = require('slugify')

const API_ENDPOINT = "http://platform.ewaiter.tech/api";

const DEFAULT_WELCOME_INTENT = "Default Welcome Intent";
const DEFAULT_FALLBACK_INTENT = "Default Fallback Intent";
const ORDER_INTENT = "Order Intent";
const GOODBYE_INTENT = "Goodbye Intent";
const ORDER_INTENT_YES = "Order Intent - yes";
const ORDER_INTENT_NO = "Order Intent - no";
const DEFAULT_WELCOME_INTENT_CUSTOMER_SAY_THEIR_NAME = "Default Welcome Intent - customer say their name";


const TOKEN = "Token a1b069a8eae8c855edb82b98830517f356c7a027";
const TABLEID = 82;
// Create an app instance
const {
    google
} = require('googleapis');
const {
    WebhookClient,
    Suggestion
} = require('dialogflow-fulfillment');
const functions = require('firebase-functions');
const axios = require('axios');
const {
    Change
} = require('firebase-functions');


process.env.DEBUG = 'dialogflow:*'; // It enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

    const agent = new WebhookClient({
        request,
        response
    });

    //==============================INTENT===============================

    //Welcome intent
    const default_welcome_intent = (agent) => {
        const asking_name_conversation = [
            `Hi guys, I'm E waiter, what's your name?`,
            `Hello there, I'm E waiter, could you tell me your name?`,
            `Hi there, How are you today?, what can i call you ? `
        ];
        agent.add(random_conversation(asking_name_conversation));
    }

    const default_fallback_intent = (agent) => {
        agent.add(`I didn't understand your request`);
    }

    const goodbye_intent = (agent) => {
        agent.add(`Goodbye, tell me when you want next order, See you later `);
    }
    //Order intent
    const order_intent = async (agent) => {
        //Get foodList and quantity list from user input
        var foodList = agent.contexts[0].parameters['TypeOfFood.original'];
        foodList = format_list(foodList);
        var quantityList = agent.contexts[0].parameters['number']
        // console.log("CONTEXTS[0] IN ORDER INTENT", agent.contexts[0])
        if (foodList.length !== quantityList.length) {
            agent.add(`I'm sorry, your order is not valid, please tell me your order again`);
        } else {
            //Create Order 
            let order = [];
            for (const food in foodList) {
                // let key = foodList[food];
                // let value = quantityList[food];
                // order[key] = value;
                let foodObject = {
                    "foodName": foodList[food],
                    "quantity": quantityList[food]
                }
                order.push(foodObject);
            }

            console.log("ORDER", order);
            //Checking order valid of not
            if (validOrder(order) === false) {
                agent.add(`I'm sorry, you order is not valid, please tell me your order again`);
            } else {
                //Check order in API
                let url = API_ENDPOINT + '/dishes/'
                let get_all_order = await getDishes(url).then((res) => {
                    if (res.data) {
                        console.log("RES.DATA", res.data)
                        return res.data.data.results
                    } else {
                        return null
                    }
                }).catch((err) => {
                    console.log("ERROR WHEN GET DISHES ", err);
                    return null
                });

                if (get_all_order === null) {
                    //Error when get all dishes
                    agent.add("I'm sorry, something happened ");
                } else {
                    //Check order of customer is valid or not
                    //Change foodList to en text
                    var newFoodList = change_to_foodList(get_all_order);
                    // console.log("NEW_FOOD_LIST ", newFoodList)
                    if (isValid(newFoodList, foodList)) {
                        console.log("[INFO] this order is valid");
                        var validString = array_to_string(foodList, quantityList);
                        agent.add(`${validString}. Is that all you'll be ordering ?`);

                        var order_info = create_order_info(foodList, quantityList, get_all_order);
                        if(order_info){
                            console.log("ORDER_INFO", order_info);
                            const order_data = {
                                "name": "orderdata",
                                "lifespan": 60,
                                "parameters": {
                                    "order_info": order_info
                                }
                            }
                            agent.setContext(order_data);
                        }
                        else{
                            console.log("[ERROR] Error when create order_info");
                            agent.add("I'm sorry, Something happened");
                        }

                        agent.add(new Suggestion('Yes'));
                        agent.add(new Suggestion('No'));
                    } else {
                        console.log('[INFO] this order is invalid');
                        var foodObject = check_invalid_food(newFoodList, foodList);
                        var inValidFoodList = foodObject['inValidFoodList'];
                        var validFoodList = foodObject['validFoodList'];
                        console.log("INVALID_FOOD_LIST", inValidFoodList);
                        console.log("VALID_FOOD_LIST", validFoodList)
                        var invalidString = array_to_string(inValidFoodList, null);

                        agent.add(`I'm sorry, we don't have ${invalidString} in our restaurant, Can you replace with something else?`);
                    }
                }
            }
        }
    }


    //oder-intent function
    const change_to_foodList = (allDishes) => {
        var foodList = []
        allDishes.forEach((dish) => {
            var newName = remove_vietnamese_sign(dish['name'])
            foodList.push(newName)
        });
        return foodList;
    }

    const format_list = (list) =>{
        var newFormatList = []
        list.forEach((item)=>{
            newFormatList.push(item.toLowerCase())
        });
        return newFormatList;
    }

    const remove_vietnamese_sign = (vietnameses_text) => {
        var newText = slugify(vietnameses_text, {
            locale: "vi"
        });
        newText = newText.split('-').join(' ');
        return newText.toLowerCase()
    }

    const isValid = (newFoodList, foodList) => {
        return foodList.every((food) => {
            // console.log(food);
            return newFoodList.includes(food);
        });
    }

    const check_invalid_food = (newFoodList, foodList) => {
        var inValidFoodList = [];
        var validFoodList = [];
        foodList.forEach((food) => {
            // console.log(food)
            if (newFoodList.includes(food)) {
                console.log(`[INFO] ${food} is valid `);
                validFoodList.push(food);
            } else {
                console.log(`[INFO] ${food} is not valid`);
                inValidFoodList.push(food);
            }
        });
        return {
            "inValidFoodList": inValidFoodList,
            "validFoodList": validFoodList
        };
    }

    const array_to_string = (arr, quantityList) => {
        var newString = ""
        if (quantityList === null) {
            arr.forEach((element, index, array) => {
                if (index !== array.length - 1) {
                    newString += element + ", ";
                } else {
                    newString += element;
                }
            });
        } else {
            arr.forEach((element, index, array) => {
                if (index !== array.length - 1) {
                    newString += quantityList[index] + " " + element + ", ";
                } else {
                    newString += quantityList[index] + " " + element;
                }
            })
        }
        return newString
    }


    const create_temp_order = (foodList, quantityList) =>{
        var tempOrderList = []
        foodList.forEach((element, index, array)=>{
            var tempObject = {
                "name": element, 
                "quantity": quantityList[index]
            }
            tempOrderList.push(tempObject);
        });
        return tempOrderList;
    }
    
    const create_order_info = (foodList, quantityList, get_all_order) =>{
        var tempOrder = create_temp_order(foodList, quantityList);
        console.log("TEMP_ORDER", tempOrder);
        var order_info = []
        get_all_order.forEach((foodDetail)=>{
            // console.log(foodDetail);
            var newFoodName = remove_vietnamese_sign(foodDetail["name"])
            // console.log(newFoodList)
            if(foodList.includes(newFoodName)){
                // console.log("VALID", foodDetail)
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
                // console.log("INVALID", foodDetail)
            }
        });
    
        return order_info
    }
    
/////




    const order_intent_yes = async (agent) => {
        //get data from context
        const orderdata = getItem("orderdata", agent);
        const order = orderdata['order_info'];
        let url = API_ENDPOINT + '/orders/';

        const orderList = create_order_list(order)


        let result = await orderFood(url, orderList, TABLEID).then((res) => {
            if (res.data) {
                return res.data;
            } else {
                return null;
            }
        }).catch((err) => {
            console.log("ERROR WHEN CALL API", err);
            return null
        });

        if (result === null) {
            agent.add(`I'm sorry, something happened`)
        } else {
            agent.add(`Your order is pending, please wait for a while, thanks for using our service`);
        }
    }

    const create_order_list = (orders) =>{
        var newOrderList = []
        orders.forEach((order)=>{
            // console.log(order)
            //get id and quantity
            console.log("ID", order['id']);
            console.log("QUANTITY", order['quantity']);
            var orderObject = {};
            orderObject['dishId'] = order['id']
            orderObject['quantity'] = order['quantity']
            newOrderList.push(orderObject)
        });
        return newOrderList;
    }





    const order_intent_no = (agent) => {
        agent.add("Could you tell me your order again please ?");
    }

    const default_welcome_intent_customer_say_their_name = (agent) => {
        const customerName = agent.contexts[0].parameters['name.original'];
        const customerNameData = {
            "name": "customernamedata",
            "lifespan": 60,
            "parameters": {
                "customerName": customerName
            }
        }
        const welcome_conversation = [
            `Hello ${customerName}, how can I help you now?`,
            `Hi ${customerName}, What a nice name, how can i serve you now?`,
            `Hola ${customerName}, what would you like to use ? `
        ];
        agent.add(random_conversation(welcome_conversation));
        agent.setContext(customerNameData);
    }








    //====================OTHER FUNCTION=============================
    const getItem = (item, agent) => {
        const context_data = agent.context.get(item);
        const data = context_data.parameters;
        return data
    }

    const validOrder = (order) => {
        order.forEach((food) => {
            if (food['quantity'] === 0) {
                return false;
            }
        });
        return true;
    }

    const random_conversation = (conversion_list) => {
        return conversion_list[Math.floor(Math.random() * conversion_list.length)]
    }



    //=====================API FUNCTION===========================
    const getDishes = (url) => {
        return axios.get(url, {
            "headers": {
                "Authorization": TOKEN,
                "Accept": "application/json"
            }
        })
    }

    const orderFood = (url, order, tableId) => {
        var data = {
            "tableId": tableId,
            "orderDetails": order
        };
        
        var headers = {
            "headers": {
                'Content-Type': 'application/json',
                'Authorization': TOKEN
            }
        };
        return axios.post(url, data,headers);
    }






    //===========================MAPING INTENT=================================
    let intentMap = new Map();
    intentMap.set(DEFAULT_WELCOME_INTENT, default_welcome_intent);
    intentMap.set(DEFAULT_FALLBACK_INTENT, default_fallback_intent);
    intentMap.set(GOODBYE_INTENT, goodbye_intent);
    intentMap.set(ORDER_INTENT, order_intent);
    intentMap.set(ORDER_INTENT_NO, order_intent_no);
    intentMap.set(ORDER_INTENT_YES, order_intent_yes)
    intentMap.set(DEFAULT_WELCOME_INTENT_CUSTOMER_SAY_THEIR_NAME, default_welcome_intent_customer_say_their_name);

    agent.handleRequest(intentMap);
});