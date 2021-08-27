import { createContext, useState } from 'react';

import { menuKeys } from 'configs/configs';

// TODO const {state} = useMenuContext(MenuContext)
export const MenuContext = createContext([]);
const useMenuContext = () => {
  const [menuState, setMenuState] = useState({
    active: menuKeys.MESSAGES,
    [menuKeys.MESSAGES]: {},
  }); // {active, conversationId, ...opts }
  return [menuState, setMenuState];
};
export default useMenuContext;
