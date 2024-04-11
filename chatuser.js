const ROOMS = new Map()//to store rooms 
class Room {
    static get(roomName) {
        if (!ROOMS.has(roomName)) ROOMS.set(roomName, new Room(roomName))
        return ROOMS.get(roomName)
    }
    constructor(roomName) {
        this.name = roomName
        this.members = new Set()
    }
    join(member) {this.members.add(member)}
    leave(member){this.members.delete(member)}
    broadcast(data){for(let member of this.members) member.send(JSON.stringify(data))}
}
class ChatUser {
    constructor(send, roomName) {
        this._send = send
        this.room = Room.get(roomName)
        this.name = null
        console.log(`Create chatroom: ${this.room.name}`)
    }
    send(data) {
        try {this._send(data)}
        catch {}//if fail sending message,do nothing
    }
    handleJoin(name) {
        this.name = name
        this.room.join(this)
        this.room.broadcast({type:'note',text:`${this.name}:joined room ${this.room.name}`})
    }
    handleChat(text){this.room.broadcast({name:this.name,type:'chat',text:text})}
    handleMessage(jsonData) {
        let msg = JSON.parse(jsonData)

        if (msg.type === 'join') this.handleJoin(msg.name)
        else if (msg.type === 'chat') this.handleChat(msg.text)
        else throw new Error(`bad message: ${msg.type}`)
    }
    handleClose() {
        this.room.leave(this)
        this.room.broadcast({type:'note',text:`${this.name} left room ${this.room.name}`})
    }
}
module.exports = ChatUser
