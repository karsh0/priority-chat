import { connection } from "websocket"

interface User{
    name: string,
    id: string,
    socket: connection
}

interface Room{
    users: User[]
}

export class UserManager{
    private rooms: Map<string,Room>
    constructor(){
        this.rooms = new Map<string, Room>()
    }

    addUser(name: string, userId: string, roomId: string, socket: connection){
        if(!this.rooms.get(roomId)){
            this.rooms.set(roomId,{
                users: []
            })
        }

        this.rooms.get(roomId)?.users.push({
            name,
            id: userId,
            socket
        })
    }

    removeUser(userId: string, roomId: string){
        const users = this.rooms.get(roomId);
        if(users){
            this.rooms.get(roomId)?.users.filter(({id}) => id !== userId)
        }
    }

    getUser(userId: string, roomId: string): User | null{
        const user = this.rooms.get(roomId)?.users.find((({id}) => id === userId))
        return user ?? null
    }

    broadcast(roomId: string, userId: string, message: string){
        const user = this.getUser(userId, roomId);
        if(!user){
            console.error('User not found!')
            return
        }
        const rooms = this.rooms.get(roomId);
        rooms?.users.forEach(({socket}) => socket.sendUTF(JSON.stringify({message})))
    }
}