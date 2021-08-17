import { getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';

const { hasCommandModifier } = KeyBindingUtil;

/**
 *
 * @param {Array<string> | string} command
 * @param {string} code
 * @param {{isModifier?: boolean, shiftKey?: boolean}} [options]
 * @returns {IKeyBindingFn}
 */
function bindOneKey(command, code, options = { isModifier: false, shiftKey: false }) {
  const { isModifier, shiftKey } = options;
  return e => {
    if (
      e.key !== code ||
      (typeof command === 'string' && shiftKey && !e.shiftKey) ||
      (typeof command === 'string' && isModifier && !hasCommandModifier(e))
    ) {
      return getDefaultKeyBinding(e);
    }

    if (typeof command === 'string') return command;

    if ((shiftKey && e.shiftKey) || (isModifier && hasCommandModifier(e))) {
      return command[1];
    }
    return command[0];
  };
}

export default { bindOneKey };
