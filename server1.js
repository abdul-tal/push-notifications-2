const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const models = require('./models');

const app = express();

//set static path
app.use(express.static(path.join(__dirname, "client"), {index: 'index2.html'}));
// app.use(express.static(path.join(__dirname, "client")));


app.use(bodyParser.json());

const publicVapidKey = 'BNgIM2bPgDqArtLaOlhmYZtDYmD3TTMzudNwc6tD6Yz9H6PoOcu2Xm8-MHlHcgzMB8D2yNUYcx_c-Hpcq0QKTI8';
const privateVapidKey = 'PAuMmgLsj5ZXC2A4aJR7xW8xW2GJ12Yrs79RDWEvTM4';

webpush.setVapidDetails('mailto:abdul.rahman@talentica.com', publicVapidKey, privateVapidKey);

app.post('/subscribe', async (req, res) => {
    const { subscription, category } = req.body;
    console.log('subscription.endpoint', subscription.endpoint)
    // const result = await models.subscriptions.findOne({
    //     where: {
    //         endpoint: subscription.endpoint
    //     }
    // })

    res.status(201).json({});
    const result = await models.subscriptions.findOrCreate({
        where: {
            endpoint: subscription.endpoint
        },
        defaults: {
            subscription: JSON.stringify(subscription),
            category: category,
            endpoint: subscription.endpoint
        }
    })
    // const pushid = subscription.endpoint.substr((subscription.endpoint.length - 8), subscription.endpoint.length);
    // const payload = JSON.stringify({ title: 'web push test from SERVER1'});
    console.log('SERVER1', JSON.stringify({
result
    }, null, 2));
    console.log('subscription', result[0].subscription)
})



app.post('/sendNotifications', async (req, res) => {
    const { category, title } = req.body;

    const subscriptionData = await models.subscriptions.findAll({
        where: {
            category
        }
    });
    // console.log('subscriptionData',JSON.stringify(subscriptionData, null,4))

    subscriptionData.forEach(subscriberObj => {
        // console.log('subscriberObj.payload', subscriberObj.payload)
        // const payload = JSON.parse(subscriberObj.payload);
        // const finalPayload = {...payload, url: 'localhost:5000'}
        const payload = {
            title,
            category
        };

        console.log('\n\n\nsubscriberObj.subscription', subscriberObj.subscription)
        console.log('\n\n\nsubscriberObj.subscription typeof', typeof subscriberObj.subscription)
        console.log('\n\n\nsubscriberObj.subscription parse', JSON.parse(subscriberObj.subscription))
        console.log('\n\n\nsubscriberObj.subscription typeof', typeof subscriberObj.subscription)
        console.log('\n\n\nsubscriberObj.subscription.endpoint', subscriberObj.subscription.endpoint)

        const subscription = JSON.parse(subscriberObj.subscription);

        webpush.sendNotification(subscription, JSON.stringify(payload)).then(result => {
            console.log("notificantion sent for", result)
          });
          setTimeout(function(){ console.log("After 5 seconds!"); }, 10000);
    })
    
    // subscribedTo.forEach(publisher => {
    //     const subscribers = storage.getSubscribers(publisher);
    //     console.log(publisher, subscribers)
    //     subscribers.forEach(subscriberObj => {
    //         console.log('subscriberObj.payload', subscriberObj.payload)
    //         const payload = JSON.parse(subscriberObj.payload);
    //         const finalPayload = {...payload, url: 'localhost:5000'}
    //         console.log('parsed.payload', payload)
    //         webpush.sendNotification(subscriberObj.subscriber, JSON.stringify(finalPayload)).then(result => {
    //             console.log("notificantion sent for", finalPayload)
    //           });
    //           setTimeout(function(){ console.log("After 5 seconds!"); }, 10000);
    //     })
    //     setTimeout(function(){ console.log("After 5 seconds!"); }, 10000);
    // });
    res.send({})
})


const port = process.env.PORT || 5002;

app.listen(port, () => {
    console.log(`server listening on port ${port}`)
})
