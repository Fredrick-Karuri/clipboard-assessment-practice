export class LoggerService{
    log(message:string){
        console.log(message)
    }
    error(message:string, error?:any){
        console.error(message,error)
    }
}