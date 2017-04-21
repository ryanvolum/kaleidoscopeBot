var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID ? process.env.MICROSOFT_APP_ID : '',
    appPassword: process.env.MICROSOFT_APP_PASSWORD ? process.env.MICROSOFT_APP_PASSWORD : ''
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);

//Creates a backchannel event
const createEvent = (eventName, value, address) => {
    var msg = new builder.Message().address(address);
    msg.data.type = "event";
    msg.data.name = eventName;
    msg.data.value = value;
    return msg;
}

bot.dialog('/', [
    (session) => {
        session.endDialog(session.message.text);
    }
]);

bot.dialog('showKaleidoscope', [
    (session) => {
        session.send("Creating Kaleidoscope Event");
        var kaleidoscopeEvent = createEvent("showKaleidoscope", session.message.text, session.message.address);
        session.endDialog(kaleidoscopeEvent);
    }
]).triggerAction({
    onFindAction: (context, callback) => {
        var score = (context.message.text.startsWith("show")) ? 200 : 0;
        callback(null, score);
    }
});

bot.dialog('changeBackground', [
    (session) => {
        session.send("Creating Change Background Event to change background to " + session.message.text.substring(10));
        var backgroundEvent = createEvent("changeBackground", session.message.text.substring(10), session.message.address);
        session.endDialog(backgroundEvent);
    }
]).triggerAction({
    onFindAction: (context, callback) => {
        var score = (context.message.text.startsWith("background")) ? 200 : 0;
        callback(null, score);
    }
});


