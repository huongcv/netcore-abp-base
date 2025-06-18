import FnbAreaStore from "./fnbAreaStore";
import FnbProcessingAreaStore from "./fnbProcessingArea";
import FnbTableStore from "./fnbTableStore";

export const commonRestaurantStorePart = {
  fnbAreaStore: new FnbAreaStore(),
  fnbTableStore: new FnbTableStore(),
  fnbProcessingAreaStore: new FnbProcessingAreaStore(),
  
}