import {Client} from 'twilio-chat';
export class TwilioService {
  static serviceInstance;
  static chatClient;

  constructor() {}

  static getInstance() {
    if (!TwilioService.serviceInstance) {
      TwilioService.serviceInstance = new TwilioService();
    }
    console.log(
      'TwilioService.serviceInstance',
      TwilioService.serviceInstance,
      'new TwilioService();',
      new TwilioService(),
    );
    return TwilioService.serviceInstance;
  }

  async getChatClient(twilioToken) {
    if (!TwilioService.chatClient && !twilioToken) {
      throw new Error('Twilio token is null or undefined');
    }
    if (!TwilioService.chatClient && twilioToken) {
      // console.log('getting TwilioService =', twilioToken);
      return Client.create(twilioToken).then((client) => {
        console.log('client inner =', client);
        TwilioService.chatClient = client;
        return TwilioService.chatClient;
      });
    }
    return Promise.resolve().then(() => TwilioService.chatClient);
  }

  clientShutdown() {
    TwilioService.chatClient?.shutdown();
    TwilioService.chatClient = null;
  }

  addTokenListener(getToken) {
    if (!TwilioService.chatClient) {
      throw new Error('Twilio client is null or undefined');
    }
    TwilioService.chatClient.on('tokenAboutToExpire', () => {
      getToken().then(TwilioService.chatClient.updateToken);
    });

    TwilioService.chatClient.on('tokenExpired', () => {
      getToken().then(TwilioService.chatClient.updateToken);
    });
    return TwilioService.chatClient;
  }

  parseChannels(channels) {
    return channels.map(this.parseChannel);
  }

  parseChannel(channel) {
    return {
      id: channel.sid,
      name: channel.friendlyName,
      createdAt: channel.dateCreated,
      updatedAt: channel.dateUpdated,
      lastMessageTime:
        channel.lastMessage?.dateCreated ??
        channel.dateUpdated ??
        channel.dateCreated,
    };
  }

  parseMessages(messages) {
    return messages.map(this.parseMessage).reverse();
  }

  parseMessage(message) {
    return {
      _id: message.sid,
      text: message.body,
      createdAt: message.dateCreated,
      user: {
        _id: message.author,
        name: message.author,
      },
      received: true,
    };
  }

  // async getToken(identity = null) {
  //   console.log('hello service', identity);
  //   if (!identity) {
  //     identity = await AsyncStorage.getItem('userId');
  //   }
  //   let response = await fetch(
  //     'https://teal-dotterel-7600.twil.io/chat-token?identity=' + identity,
  //     {
  //       method: 'GET',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //     },
  //   );
  //   let json = await response.json();
  //   console.log('Twilio service getToken()', json);
  //   return json.token;
  // }

  //  getToken = async (identity) => {
  //   let response = await fetch(
  //     'https://teal-dotterel-7600.twil.io/chat-token?identity=' + identity,
  //     {
  //       method: 'GET',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //     },
  //   );
  //   let json = await response.json();
  //   return json.token;
  // };
}

// import {Client} from 'twilio-chat';

// const TwilioService = () => {
//   const [serviceInstance, setServiceInstance] = useState();
//   const [chatClient, setChatClient] = useState();
//   //   const chatClient;

//   //   constructor() {}

//   const getInstance = () => {
//     // if (!TwilioService.serviceInstance) {
//     //   TwilioService.serviceInstance = new TwilioService();
//     //   setServiceInstance
//     // }
//     // return TwilioService.serviceInstance;
//     if (!serviceInstance) {
//       setServiceInstance(new TwilioService());
//     }
//     return serviceInstance;
//   };

//   const getChatClient = async (twilioToken) => {
//     if (!TwilioService.chatClient && !twilioToken) {
//       throw new Error('Twilio token is null or undefined');
//     }
//     if (!TwilioService.chatClient && twilioToken) {
//       return Client.create(twilioToken).then((client) => {
//         TwilioService.chatClient = client;
//         return TwilioService.chatClient;
//       });
//     }
//     return Promise.resolve().then(() => TwilioService.chatClient);
//   };

//   const clientShutdown = () => {
//     TwilioService.chatClient?.shutdown();
//     TwilioService.chatClient = null;
//   };

//   const addTokenListener = (getToken) => {
//     if (!TwilioService.chatClient) {
//       throw new Error('Twilio client is null or undefined');
//     }
//     TwilioService.chatClient.on('tokenAboutToExpire', () => {
//       getToken().then(TwilioService.chatClient.updateToken);
//     });

//     TwilioService.chatClient.on('tokenExpired', () => {
//       getToken().then(TwilioService.chatClient.updateToken);
//     });
//     return TwilioService.chatClient;
//   };

//   const parseChannels = (channels) => {
//     return channels.map(this.parseChannel);
//   };

//   const parseChannel = (channel) => {
//     return {
//       id: channel.sid,
//       name: channel.friendlyName,
//       createdAt: channel.dateCreated,
//       updatedAt: channel.dateUpdated,
//       lastMessageTime:
//         channel.lastMessage?.dateCreated ??
//         channel.dateUpdated ??
//         channel.dateCreated,
//     };
//   };

//   const parseMessages = (messages) => {
//     return messages.map(this.parseMessage).reverse();
//   };

//   const parseMessage = (message) => {
//     return {
//       _id: message.sid,
//       text: message.body,
//       createdAt: message.dateCreated,
//       user: {
//         _id: message.author,
//         name: message.author,
//       },
//       received: true,
//     };
//   };
// };

// export default TwilioService;
