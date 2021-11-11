import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLink,
  faPowerOff,
  faUser,
  faCar,
  faRoad,
  faGasPump,
} from "@fortawesome/free-solid-svg-icons";

function initFontAwesome() {
  library.add(faLink);
  library.add(faUser);
  library.add(faPowerOff);
  library.add(faCar);
  library.add(faRoad);
  library.add(faGasPump)
}

export default initFontAwesome;
