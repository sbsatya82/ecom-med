import { Router } from 'express'
import auth from '../middleware/auth.js'
import { addAddressController, deleteAddresscontroller, getAddressController, updateAddressController, getAllAddress} from '../controllers/address.controller.js'
import { admin } from '../middleware/Admin.js'

const addressRouter = Router()

addressRouter.post('/create',auth,addAddressController)
addressRouter.get("/get",auth,getAddressController)
addressRouter.put('/update',auth,updateAddressController)
addressRouter.delete("/disable",auth,deleteAddresscontroller)


addressRouter.get("/get-all-address", auth, admin, getAllAddress)

export default addressRouter