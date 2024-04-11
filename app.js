//WebSocket server,allowing dynamic clients to connect to dynamic chatrooms and send messages
//https://www.npmjs.com/package/express-ws
//https://github.com/HenningM/express-ws
//https://github.com/websockets/ws
const express = require('express')
const app = express()
const wsExpress = require('express-ws')(app)
const ChatUser = require('./ChatUser')
app.ws('/chat/:roomName',(ws, req, next)=>{//when connection is established at this endpoint,create chat user
    try {
        const user = new ChatUser(ws.send.bind(ws),req.params.roomName)
        ws.on('message',data=>{//listen for incoming message and handle it
            try {user.handleMessage(data)} 
            catch (err) {console.error(err)}
        })
        ws.on('close',()=>{//listen for connection closure event and handle it
            try {user.handleClose()} 
            catch (err) {console.error(err)}
        })
    } 
    catch (err) { console.error(err) }
})
//frontend: at this endpoint,serve chat.html
app.get('/:roomName',(req,res,next)=>res.sendFile(`${__dirname}/chat.html`))

app.listen(3000,()=>console.log("Server started on localhost:3000"))
