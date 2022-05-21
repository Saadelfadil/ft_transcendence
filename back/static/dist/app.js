const app = new Vue({
    el: '#app',
    data: {
        title: 'Nestjs Websockets Chat',
        username: '',
        message: '',
        messages: [],
        socket: null
    },
    methods: {
        sendMessage() {
            if(this.validateInput()) {

                const messageData = {
                    isInvite: false,
                    inviteStatus: 0,
                    from: 59490,
                    to: 58616,
                    username: 'ler-rech',
                    avatar: 'https://cdn.intra.42.fr/users/ler-rech.jpg',
                    roomName: '58616-59490',
                    message: this.message,
                };

               
                this.socket.emit('private-chat', { 
					data: messageData
				})
                this.message = ''
            }
        },
        receivedMessage(msg) {
            this.messages.push(msg)
        },
        validateInput() {
            return this.message.length > 0
        }
    },
    created() {
        this.socket = io('http://localhost:3000/privateChat')
        this.socket.on('58616-59490', ({data}) => {
            this.receivedMessage(data)
        })
    }
})