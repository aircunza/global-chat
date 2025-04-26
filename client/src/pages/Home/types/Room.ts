export interface IRoom{
     roomId: string
     roomName: string
     createdBy: string;
}
export class Room{
    private _roomId: string
    private _roomName: string

    constructor( {roomId, roomName}:IRoom){
        this._roomId=roomId
        this._roomName= roomName
    }

    get roomId(){
        return this._roomId
    }
    get roomNae(){
        return this._roomName
    }

}