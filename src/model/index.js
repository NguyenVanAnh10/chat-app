import { useEffect as useReactEffect, useState, useRef } from 'react';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import isEqual from 'lodash.isequal';

const models = {
  modelNames: [],
  states: {},
  initStore() {
    const allReducers = this.modelNames.reduce((s, modelName) => {
      const model = this[modelName];
      return {
        ...s,
        [modelName]: (state = model.state, { type, payload }) => {
          const [prefix, actionName, status] = type.split('/');
          if (prefix !== modelName) {
            return state;
          }
          return model.reducers[actionName](state, {
            status,
            payload,
          });
        },
      };
    }, {});

    this.actions = this.modelNames.reduce((s, modelName) => {
      const model = this[modelName];
      const actionsModel = Object.keys(model.actions).reduce(
        (ss, actionName) => ({
          ...ss,
          [actionName]: (...args) => this.store.dispatch({
            type: `${modelName}/${actionName}`,
            payload: model.actions[actionName](...args),
          }),
        }),
        {},
      );
      return { ...s, ...actionsModel };
    }, {});

    const middleware = store => next => action => {
      const state = next(action);
      const [prefix, actionName, status] = action.type.split('/');

      if (status) {
        return state;
      }
      // eslint-disable-next-line no-shadow
      const onFinish = status => payload => {
        store.dispatch({
          type: `${prefix}/${actionName}/${status}`,
          payload,
        });
      };
      models[prefix].effects[actionName](
        action.payload,
        onFinish('success'),
        onFinish('error'),
      );
      return state;
    };
    const composeEnhancers = (typeof window !== 'undefined'
        && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
      || compose;

    const enhancer = composeEnhancers(applyMiddleware(middleware));
    this.store = createStore(combineReducers(allReducers), enhancer);
  },
};

export const initRegisters = registerModels => Object.keys(registerModels).forEach(m => {
  // TODO delete registerModels[m].state;
  //   TODO try catch .name
  models[registerModels[m].name] = registerModels[m];
  models.modelNames.push(registerModels[m].name);
});

export const useModel = (name, selector, cachedKey = []) => {
  const [, forceRender] = useState({});
  if (!models.store) {
    models.initStore();
  }

  const currentStateRef = useRef(selector(models.store.getState()[name]));

  useReactEffect(() => {
    const unsub = models.store.subscribe(() => {
      const nextState = selector(models.store.getState()[name]);
      if (!isEqual(nextState, currentStateRef.current)) {
        currentStateRef.current = { ...nextState };
        forceRender({});
      }
    });
    return unsub;
  }, cachedKey);
  return [currentStateRef.current, models.actions];
};
