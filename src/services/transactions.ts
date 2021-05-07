import { SubmitTransRes } from '../interfaces/trans';
import ClientsServices from '../services/clients';
const clientsServices = new ClientsServices()

export default class TransServices {
    // submit transfer
    async makeTransfer(_id: string, receiverId: string, amount: number): Promise<any[]>{
      return new Promise(async(resolve, reject) => {
        // take the money from current client
        try {
          // takeing Money
          await clientsServices.updateClientBalance({_id, operation: false, amount: amount})
          // try to add moeny to receiver client
          try {
            await clientsServices.updateClientBalance({_id: receiverId, amount, operation: true})
            const data = await Promise.all([clientsServices.updateTransHis(_id, {amount, receiverId}), clientsServices.getClientBalance(_id)])
            resolve(data)
          } catch(err) {reject("error in adding money to receiver client")}
        } catch(err) {reject("an error in takeing")}
      })
    }
    // submit transfer
    async submitTransfer(_id: string, receiverPhone: string, amount: number){
      // transfer details comes from client
      // get the current client balance
      const currentClientBalance = await clientsServices.getClientBalance(_id);
      // if transfer amount less than current client balance
      if(currentClientBalance! > Number(amount)) {
        try {
          const receiver = await clientsServices.getReceiver(receiverPhone);
          const TransferData = await this.makeTransfer(_id, receiver?._id!, amount);
          // res data
          const resData: SubmitTransRes = {error: false, data: {newTransaction: TransferData[0], newBalance: TransferData[1]}}
          return resData
        } catch(err) {
            const resObj: SubmitTransRes = {error: true, data: {newBalance: null, newTransaction: null}};
            return resObj
          }
      } else {
          // the current client balance is not enoghp
          const resObj: SubmitTransRes = {error: true, data: {newBalance: null, newTransaction: null}}
          return resObj
        }
    }
}