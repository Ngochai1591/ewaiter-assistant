const {
    dialogflow,
    Permission,
    Suggestions,
    BasicCard,
} = require('actions-on-google');
  
  // Create an app instance
  const app = dialogflow({debug: false});
  

const functions = require('firebase-functions');

app.intent('Default Welcome Intent', (conv)=>{
    conv.ask("Welcome to the quote generator ! Ask for a quote about happines, friendship and inspirational QUOTE")
});

app.intent('Default Fallback Intent', (conv)=>{
    conv.ask(`I didn't understand your request`)
});

const quoteList = {
    "happiness": [
        "Every day is a new day.",
        `The most important thing is to enjoy your life — to be happy. It's all that matters.`,
        "The purpose of our lives is to be happy.",
        "Embrace the glorious mess that you are.",
        "Wine is constant proof that God loves us and loves to see us happy.",
        "Being happy never goes out of style.",
        "Happiness is the best makeup.",
        "Roll with the punches and enjoy every minute of it.",
        "The mere sense of living is joy enough.",
        "The only thing that will make you happy is being happy with who you are."
    ],
    "inspiration":[
        "Your limitation—it’s only your imagination.",
        " Push yourself, because no one else is going to do it for you.",
        "Sometimes later becomes never. Do it now.",
        "Great things never come from comfort zones.",
        "Dream it. Wish it. Do it.",
        "Success doesn’t just find you. You have to go out and get it.",
        "The harder you work for something, the greater you’ll feel when you achieve it.",
        "Dream bigger. Do bigger.",
        "Don’t stop when you’re tired. Stop when you’re done.",
        "Wake up with determination. Go to bed with satisfaction."
    ],
    "friendship":[
        "A real friend is one who walks in when the rest of the world walks out.",
        "I like to listen. I have learned a great deal from listening carefully. Most people never listen.",
        "If you live to be 100, I hope I live to be 100 minus 1 day, so I never have to live without you.",
        "Friendship is born at that moment when one person says to another, ‘What! You too? I thought I was the only one.",
        "True friendship comes when the silence between two people is comfortable.",
        "Sweet is the memory of distant friends! Like the mellow rays of the departing sun, it falls tenderly, yet sadly, on the heart.",
        "There’s not a word yet for old friends who’ve just met.",
        "A single rose can be my garden… a single friend, my world."
    ],
    "quote": [
        "Get busy living or get busy dying",
        "You only live once, but if you do it right, once is enough.",
        "Many of life’s failures are people who did not realize how close they were to success when they gave up",
        "If you want to live a happy life, tie it to a goal, not to people or things.",
        "Never let the fear of striking out keep you from playing the game",
        "Money and success don’t change people; they merely amplify what is already there.",
        "Your time is limited, so don’t waste it living someone else’s life. Don’t be trapped by dogma – which is living with the results of other people’s thinking."
    ]

}

app.intent('Need Quote', (conv)=>{
    const quote_type = conv.parameters['typeofquote'].toLowerCase();
    if (quote_type){
        console.log(quote_type)
        for(key in quoteList){
            if(quote_type === key){
                random_quote = quoteList[key][Math.floor(Math.random() * quoteList[key].length)];
                conv.ask(random_quote)
            }
        }
    }
    else{
        console.log("normal quote")
        random_quote = quoteList["quote"][Math.floor(Math.random() * quoteList["quote"].length)];
        conv.ask(random_quote)
    }
});

app.intent('Goodbye', (conv)=>{
    conv.close('Goodbye, tell me if you want another quote');
})

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)

