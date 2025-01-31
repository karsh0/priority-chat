type UserId = string

export interface Chat{
    id: string,
    userId: UserId,
    name: string,
    message: string,
    upvotes: UserId[] //who has upvoted what
}

export abstract class Store {
    constructor(){
        
    }

    initRoom(roomId: string){

    }

    getChats(roomId: string, limit: number, offset: number){

    }

    addChat(roomId: string, chatId: string, name: string, userId: string, message: string){

    }

    upvote(roomId: string, chatId: string, userId: string){

    }
}