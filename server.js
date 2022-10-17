const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const models = require('./models');

const app = express();

//set static path
app.use(express.static(path.join(__dirname, "client"), {index: 'index.html'}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const publicVapidKey = 'BNgIM2bPgDqArtLaOlhmYZtDYmD3TTMzudNwc6tD6Yz9H6PoOcu2Xm8-MHlHcgzMB8D2yNUYcx_c-Hpcq0QKTI8';
const privateVapidKey = 'PAuMmgLsj5ZXC2A4aJR7xW8xW2GJ12Yrs79RDWEvTM4';

webpush.setVapidDetails('mailto:abdul.rahman@talentica.com', publicVapidKey, privateVapidKey);

app.post('/subscribe', async (req, res) => {
    try {
        const { subscription, customer, topics } = req.body;
        console.log('subscription.....from client...', subscription)
        console.log('checkedBoxes....', topics);
        const subscriptionsResult = await models.subscriptions.findOrCreate({
            where: {
                endpoint: subscription.endpoint
            },
            defaults: {
                subscription: JSON.stringify(subscription),
                customer,
                endpoint: subscription.endpoint
            }
        });
        topics.forEach(async topic => {
            const topicsResult = await models.topics.findOrCreate({
                where: {
                    customer,
                    topic,
                    subscriptionId: subscriptionsResult[0].dataValues.id
                },
                defaults: {
                    customer,
                    topic,
                    subscriptionId: subscriptionsResult[0].dataValues.id
                }
            });
        });
        res.status(201).json({
            msg: 'subscription added'
        });
    } catch (error) {
        console.log(error)
        res.send({
            error
        })
    }
})



app.post('/sendNotifications', async (req, res) => {
    try {
        console.log('\n\n\nreq.body', req.body)
        const { customer, title } = req.body;
    
        const subscriptionData = await models.subscriptions.findAll({
            where: {
                customer
            }
        });
    
        subscriptionData.forEach(subscriberObj => {
            const payload = {
                title,
                customer
            };
            const subscription = JSON.parse(subscriberObj.subscription);
    
            webpush.sendNotification(subscription, JSON.stringify(payload)).then(result => {
                console.log("notificantion sent", result)
              });
              setTimeout(function(){ console.log("After 5 seconds!"); }, 5000);
        })
        res.send({ msg: "notifications sent" });
    } catch (error) {
        res.send({
            error
        });
    }
})

app.post('/sendTopicNotifications', async (req, res) => {
    try {
        console.log('\n\n\nsendTopicNotifications req.body', req.body)
        const { customer, title, topic } = req.body;
    
        const subscriptionData = await models.subscriptions.findAll({
            include: {
                model: models.topics,
                where: {
                    customer,
                    topic
                }
            }
        });
    
        subscriptionData.forEach(subscriberObj => {
            const payload = {
                title,
                customer
            };
            const subscription = JSON.parse(subscriberObj.subscription);
    
            webpush.sendNotification(subscription, JSON.stringify(payload)).then(result => {
                console.log("notificantion sent", result)
              });
              setTimeout(function(){ console.log("After 5 seconds!"); }, 5000);
        })
        res.send({ msg: "notifications sent" });
    } catch (error) {
        console.log(error)
        res.send({
            error
        });
    }
})

app.post('/removeSubscription', async (req, res) => {
    const { endpoint } = req.body;
    await models.subscriptions.destroy({
        where: {
            endpoint
        }
    });
    res.send({
        msg: 'subscription removed'
    })
})


const port = process.env.PORT || 5002;

app.listen(port, () => {
    console.log(`server listening on port ${port}`)
})
