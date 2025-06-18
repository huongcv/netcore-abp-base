import CustomerStore from "./Customer/customerStateStore";
import GolfAreaStore from "./golfAreaStore";
import GolfBuggyGroupStore from "./GolfBuggyGroupStore";
import CaddyGroupStore from "./GolfCaddyGroupStore";
import GolfCaddyStore from "./GolfCaddyStore";
import GolfBuggyStore from "./GolfCart/GolfBuggyStore";
import GolfCourseStore from "./golfCourseStore";
import GolfMaintenanceStore from "./golfMaintenanceStore";
import GolfBookingStore from "@ord-store/Golf/TeeSheet/Booking/GolfBookingStore";
import GolfServicesStore from "./golfServicesStore";
import GolfProductGroupStore from "./golfProductGroupStore";
import GolfTeeTimeStore from "./golfTeeTimeStore";
import CustomerGroupStore from "./Customer/customerGroupStore";
import GolfReasonStore from "./GolfSystem/GolfReason/GolfReasonStore";
import GolfLockerStore from "./golfLockerStore";
import GolfLockerHistoryStore from "./golfLockerHistoryStore";
import GolfLockerGroupStore from "./golfLockerGroupStore";
import GolfAccessCardStore from "./AccessCard/golfAccessCardStore";
import GolfAccessCardColorStore from "./AccessCard/golfAccessColorCardStore";
import GolfCheckInOutStore from "@ord-store/Golf/TeeSheet/Booking/GolfCheckInOutStore";
import GolfValetStore from "./TeeSheet/Valet/GolfValetStore";
import GolfSelectProductStore from "@ord-store/Golf/TeeSheet/Booking/GolfSelectProductStore";

export const commonGolfStorePart = {
  golfCourseStore: new GolfCourseStore(),
  golfAreaStore: new GolfAreaStore(),
  golfMaintenanceStore: new GolfMaintenanceStore(),
  golfBookingStore: new GolfBookingStore(),
  golfSelectProductStore: new GolfSelectProductStore(),
  golfCheckInOutStore: new GolfCheckInOutStore(),
  golfValetStore: new GolfValetStore(),

  //category
  golfBuggyStore: new GolfBuggyStore(),
  golfCaddyStore: new GolfCaddyStore(),
  golfCaddyGroupStore: new CaddyGroupStore(),
  golfBuggyGroupStore: new GolfBuggyGroupStore(),
  golfServicesStore: new GolfServicesStore(),
  golfProductGroupStore: new GolfProductGroupStore(),
  golfTeeTimeStore: new GolfTeeTimeStore(),
  golfLockerStore: new GolfLockerStore(),
  golfLockerHistoryStore: new GolfLockerHistoryStore(),
  golfLockerGroupStore: new GolfLockerGroupStore(),
  //customer
  golfCustomerStore: new CustomerStore(),
  golfCustomerGroupStore: new CustomerGroupStore(),
  golfAccessCardStore : new GolfAccessCardStore(),
  golfAccessCardColorStore : new GolfAccessCardColorStore(),

  //golf system
  golfReasonStore: new GolfReasonStore(),
};
