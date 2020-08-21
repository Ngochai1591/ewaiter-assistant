'use strict';



const API_ENDPOINT = "http://54.254.255.101";

const DEFAULT_WELCOME_INTENT = "Default Welcome Intent";
const DEFAULT_FALLBACK_INTENT = "Default Fallback Intent";
const ORDER_INTENT = "Order Intent";
const GOODBYE_INTENT = "Goodbye Intent";
const ORDER_INTENT_YES = "Order Intent - yes";
const ORDER_INTENT_NO = "Order Intent - no";
const DEFAULT_WELCOME_INTENT_CUSTOMER_SAY_THEIR_NAME = "Default Welcome Intent - customer say their name";
const VIETNAMESE__TEST_INTENT = "Vietnamese Test Intent";


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
        const foodList = agent.contexts[0].parameters['TypeOfFood.original'];
        const quantityList = agent.parameters.number;
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
                let url = API_ENDPOINT + '/getOrderInfo'
                let invalid_order_string = "";
                let order_string = "";
                let order_data = await getOrderInfo(url, order).then((res)=>{
                    if(res.data){
                        return res.data
                    }
                    else{
                        return null
                    }
                }).catch((err)=>{
                    console.log(err);
                    return null
                });

                console.log("ORDER_DATA", order_data)
                //Checking response data is valid or not
                if(order_data !== null){
                    let order_info = order_data['order_info']
                    order_info.forEach((food)=>{
                        order_string += food['quantity'] + " "+ food['foodName']+ ", ";
                        if(food['quantity'] === 0){
                            console.log(food)
                            invalid_order_string += food['foodName']+ ", ";
                        }
                    });
                    console.log("ORDER_INFO", order_info);
                    console.log("INVALID_ORDER_STRING", invalid_order_string);
                    
                    //If don't have any invalid food
                    if(invalid_order_string !== ""){
                        console.log('[INFO] this is invalid order!')
                        agent.add(`I'm sorry that we don't have ${invalid_order_string} in our restaurant, can you change it please`);
                    }
                    else{
                        console.log("[INFO] This is valid order!")
                        

                        //save to context of dialogflow
                        const order_data = {
                            "name": "orderdata",
                            "lifespan": 60,
                            "parameters": {
                                "order_info": order_info
                            }
                        }
                        agent.setContext(order_data);
                        


                        agent.add(`${order_string}. Is that all you'll be ordering ?`);
                        agent.add(new Suggestion('Yes'));
                        agent.add(new Suggestion('No'));
                    }
                }
                else{
                        agent.add("Sorry, something happened !!!")
                }
            }
        }
    }
        

    const order_intent_yes = async (agent) => {
        //get data from context
        const orderdata = getItem("orderdata", agent);
        const order = orderdata['order_info']

        let url = API_ENDPOINT + '/orderFood';
        let result = await orderFood(url, order).then((res)=>{
            if(res.data){
                return res.data;
            }else{
                return "ERROR";
            }
        }).catch((err)=>{
            console.log("ERROR WHEN CALL API", err);
            return "ERROR"
        });

        if(result === "ERROR"){
            agent.add(`I'm sorry, something happened`)
        }
        else{
            if(result === "SUCCESS"){
                agent.add(`Ok, your order is in processing, please wait for a while`)
            }
            else{
                agent.add(`I'm sorry, your order is canceled`)
            }
        }
        

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


   

    const vietnamese_test_intent = (agent) =>{
        console.log("VIETNAMESE INTENT");
        agent.add("Xin chào, Tôi là E Waiter, Tôi có thể giúp bạn những gì ");
    }



    //====================OTHER FUNCTION=============================
    const getItem = (item, agent) =>{
        const context_data = agent.context.get(item);
        const data = context_data.parameters;
        return data
    }

    const validOrder = (order) => {
        order.forEach((food)=>{
            if(food['quantity'] === 0){
                return false;
            }
        });
        return true;
    }

    const random_conversation = (conversion_list) => {
        return conversion_list[Math.floor(Math.random() * conversion_list.length)]
    }



    //=====================API FUNCTION===========================
    const getOrderInfo = (url, order) => {
        return axios.post(url, {
            "order":order
        })
    }

    const orderFood = (url, order) =>{
        return axios.post(url,{
            "order":order
        });
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
    intentMap.set(VIETNAMESE__TEST_INTENT, vietnamese_test_intent);
    
    
    agent.handleRequest(intentMap);
});