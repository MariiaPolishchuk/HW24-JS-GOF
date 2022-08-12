class PubSub {
    constructor() {
        this.handlers = [];
    }

    subscribe(event, handler, context) {
        if (typeof context === 'undefined') { context = handler; }
        this.handlers.push({ event: event, handler: handler.bind(context) });
    }

    publish(event, msg, sender) {
        this.handlers.forEach((topic) => {
            if (topic.event === event) {
                topic.handler(msg, sender)
            }
        })
    }
}

class Rose {
    constructor(pubsub) {
        this.name = 'Rose';
        this.pubsub = pubsub;
        this.pubsub.subscribe('jack-to-rose', this.sendMessage, this);
        this.pubsub.subscribe('billy-to-rose', this.sendMessage, this);
    }

    sendMessage(msg, sender) {
        console.log(sender + ': ', msg);
        const event = sender === 'Jack' ? 'rose-to-billy' : 'rose-to-jack';
        const recipient = sender === 'Jack' ? 'Billy' : 'Jack'
        this.publishMessage(event, `${recipient} sorry I'm in love with ${sender}`);
    }

    publishMessage(event, msg) {
        this.pubsub.publish(event, msg, this.name);
    }
}

class Billy {
    constructor(pubsub) {
        this.name = 'Billy';
        this.pubsub = pubsub;
        this.pubsub.subscribe('rose-to-billy', this.sendMessage, this);
    }

    sendMessage(msg, sender) {
        console.log(sender + ': ' + msg);
        console.log(`${this.name} left the chat`);
    }

    publishMessage(event, msg) {
        this.pubsub.publish(event, msg, this.name);
    }
}

class Jack {
    constructor(pubsub) {
        this.name = 'Jack';
        this.pubsub = pubsub;
        this.pubsub.subscribe('rose-to-jack', this.sendMessage, this);
    }

    sendMessage(msg, sender) {
        console.log(sender + ': ' + msg);
        if (sender === 'Rose') {
            console.log(`${this.name} left the chat`);
        }

    }

    publishMessage(event, msg) {
        this.pubsub.publish(event, msg, this.name);
    }
}

const pubsub = new PubSub();
const rose = new Rose(pubsub);
const billy = new Billy(pubsub);
const jack = new Jack(pubsub);

jack.publishMessage('billy-to-rose', 'Rose, I love you!');