
const display = document.getElementById("display");
var chatId = null;
var apiSecret = null;
var apiKey = null;
var lastMessageId = null;
var url = 'https://timeforstorm.eu'
const interval = setInterval(async function(){


    if (chatId != null)
    {
        const response = await fetch(url + '/chat/api/v1/chats/' + chatId + '/messages',{
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                "apiKey" : apiKey,
                "apiSecret" : apiSecret
                }
            });
        const data = await response.json();
        console.log(data);
        if (data.messages[data.messages.length-1].source == 'Agent' && data.messages[data.messages.length-1].messageId != lastMessageId)
        {
            lastMessageId = data.messages[data.messages.length-1].messageId;
            from = data.messages[data.messages.length-1].originationName;
            message = data.messages[data.messages.length-1].messageParts[0].text;
            document.getElementById("chatMessages").insertAdjacentHTML('beforeend','<div class="col-md-7 col-sm-12 display" id="messages-right">\
<div class="p-1 m-1"><b>'+from+'</b><p>'+ message +'</p></div></div>')
        }
    }

},5000);

async function startChat(){
    apiSecret = document.getElementById("apisecret").value;
    apiKey = document.getElementById("apikey").value;

    
    const chatID = crypto.randomUUID()
    const startChatBody = {
            "id": chatID,
            "originationName": "René Chat Client",
            "subject": "New Chat with Agent",
            "additionalData": "Additional Data"
    } 
    const response = await fetch(url+'/chat/api/v1/chats/',{
        method: "PUT",
        headers: {
            "Content-Type" : "application/json",
            "apiKey" : apiKey,
            "apiSecret" : apiSecret
        },
        body: JSON.stringify(startChatBody)
    }
    
    );
    const data = await response.json();
    chatId = data.chatId
    console.log(chatId)
    display.insertAdjacentHTML("beforeend", '<br/><textarea class="form-control" aria-label="Enter Message" id="chatMessageText"></textarea>\
    <button type="button" class="btn btn-primary" id="sendMessage">Send Message</button>')
    document.getElementById("sendMessage").addEventListener("click",async ()=>{
        sendMessage()
      })
  
}
async function sendMessage(){
    const message = document.getElementById("chatMessageText").value
    const messageBody = {
        "originationName": "René Chat Client",
        "messageParts": [ 
            {
                "type" : "text",
                "text": document.getElementById("chatMessageText").value
            }
        ]
    }
 
    const response = await fetch(url + '/chat/api/v1/chats/' + chatId + '/messages',{
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "apiKey" : apiKey,
            "apiSecret" : apiSecret
        },
        body: JSON.stringify(messageBody)
        
        }
        );
    const data = await response.json();
    console.log(data)

    document.getElementById("chatMessages").insertAdjacentHTML('beforeend','<div class="col-md-7 col-sm-12 display" id="messages-left">\
    <div class="p-1 m-1"><b>You</b><p>'+ message +'</p></div></div>')
}
