import SummaryApi from "../common/SummaryApi";
import Axios from "./Axios";


const fetchAllOrders = async () => {
  try {
    const response = await Axios({
      ...SummaryApi.getAllOrders
    })
    return response.data
  } catch (error) {
    console.log(error);
  }
}


export default fetchAllOrders;