import { createContext, useState } from "react";

import { menuKeys } from "configs/configs";

export const MenuContext = createContext([]);
const useMenuContext = () => {
  const [menuState, setMenuState] = useState({
    active: menuKeys.MESSAGES,
    [menuKeys.MESSAGES]: {},
  }); // {active, roomId, ...opts }
  return [menuState, setMenuState];
};
export default useMenuContext;
