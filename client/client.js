const publicVapidKey = 'BNgIM2bPgDqArtLaOlhmYZtDYmD3TTMzudNwc6tD6Yz9H6PoOcu2Xm8-MHlHcgzMB8D2yNUYcx_c-Hpcq0QKTI8';

async function checkIfAlreadySubscribed() {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscribed = await registration.pushManager.getSubscription();
    if(subscribed) {
        console.info('Already subscribed to push notifications');
        document.getElementById("subscribeButton").disabled = true;
        document.getElementById("unsubscribeButton").disabled = false;
    }
}
checkIfAlreadySubscribed()

function subscribe() {
    if('serviceWorker' in navigator) {
        send().catch(err => console.error(err))
    }
}

async function send() {
    console.log('Registering service worker');
    const register = await navigator.serviceWorker.register('./worker.js', {
        scope: '/'
    });
    console.log('Service worker registered');
    //await registration.pushManager.getSubscription();
    console.log('Registering Push');
    let subscription;
    try {
        subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: publicVapidKey
        })
    } catch (error) {
        console.log('error in client', error)
    }
    console.log('Push Registered', subscription);
    console.log('window.location.href', window.location.href);

    console.log('Sending Push');
    const url = window.location.href;
    const subdomain = url.split('.')[0].slice(url.indexOf('//')+2);
    await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify({ subscription, category: subdomain }),
        headers: {
            'content-type': 'application/json'
        }
    })
    document.getElementById("subscribeButton").disabled = true;
    document.getElementById("unsubscribeButton").disabled = false;
    console.log('Push Sent');
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
    document.getElementById("subscribeButton").disabled = false;
    document.getElementById("unsubscribeButton").disabled = true;
    }
}

