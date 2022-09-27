const publicVapidKey = 'BNgIM2bPgDqArtLaOlhmYZtDYmD3TTMzudNwc6tD6Yz9H6PoOcu2Xm8-MHlHcgzMB8D2yNUYcx_c-Hpcq0QKTI8';

function highlightUnsubscribeButton() {
    document.getElementById("subscribeButton").disabled = true;
    document.getElementById("unsubscribeButton").disabled = false;
}

function highlightSubscribeButton() {
    document.getElementById("subscribeButton").disabled = false;
    document.getElementById("unsubscribeButton").disabled = true;
}

async function checkIfAlreadySubscribed() {
    console.info('Checking if already subscribed');
    if('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscribed = registration && registration.pushManager && await registration.pushManager.getSubscription();
        if(subscribed) {
            console.info('Already subscribed to push notifications');
            highlightUnsubscribeButton();
        }
    }
}
checkIfAlreadySubscribed()


function subscribe() {
    if('serviceWorker' in navigator) {
        checkNotifs().catch(err => console.error(err))
    }
}

async function checkNotifs(){
    if (!("Notification" in window)) {                                             //1
         console.error("This browser does not support desktop notification");
       }
       // Let's check whether notification permissions have already been granted
       else if (Notification.permission === "granted") {                           //2
         console.log("Permission to receive notifications has been granted");
         return send();  
       }
       // Otherwise, we need to ask the user for permission
       else if (Notification.permission !== 'denied') {                            //3
         Notification.requestPermission(function (permission) {                    
               // If the user accepts, let's create a notification
           if (permission === "granted") {                                         //4
             console.log("Permission to receive notifications has been granted");
             return send();                                                       
           } 
         });
      }
 }

async function send() {
    console.log('Registering service worker');
    const register = await navigator.serviceWorker.register('./worker.js', {
        scope: '/'
    });
    console.log('Service worker registered', register);
    //await registration.pushManager.getSubscription();
    console.log('Subscribing...');
    let subscription;
    try {
        subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicVapidKey
        })
    } catch (error) {
        console.log(error)
        console.log('error in client', error)
    }
    console.log('PushSubscription', subscription);
    console.log('window.location.href', window.location.href);

    console.log('Sending PushSubscription to backend');
    const url = window.location.href;
    const subdomain = url.split('.')[0].slice(url.indexOf('//')+2);

    //checked boxes
    const t1 = document.getElementById("topic1");
    const t2 = document.getElementById("topic2");
    const t3 = document.getElementById("topic3");  
    const t4 = document.getElementById("topic4"); 
    const checkedBoxes = [];

    for(const t of [t1, t2, t3, t4]) {
        t.checked && checkedBoxes.push(t.value);
    }
    console.log('checkedBoxes.....', checkedBoxes)
    const response = await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify({ subscription, customer: subdomain, topics: checkedBoxes }),
        headers: {
            'content-type': 'application/json'
        }
    })
    highlightUnsubscribeButton();
    console.log('PushSubscription Sent to backend');
}

async function unsubscribe() {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration.pushManager.getSubscription();
    fetch('/removeSubscription', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({endpoint: subscription.endpoint})
    });
    const unsubscribed = await subscription.unsubscribe();
    if (unsubscribed) {
    console.info('Successfully unsubscribed from push notifications.');
    highlightSubscribeButton()
    }
}

