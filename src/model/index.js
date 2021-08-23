// TODO use Redux saga
import { useEffect as useReactEffect, useState } from 'react';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import isEqual from 'lodash.isequal';

const models = {
  modelNames: [],
  states: {},
  initStore() {
    this.modelNames.forEach(modelName => {
      models[modelName].getState = selector => selector(models.store.getState()[modelName]);
    });

    const allReducers = this.modelNames.reduce((s, modelName) => {
      const model = this[modelName];
      return {
        ...s,
        [modelName]: (state = model.state, { type, payload }) => {
          const [prefix, actionName, status] = type.split('/');
          if (prefix !== modelName || typeof model.reducers[actionName] !== 'function') {
            return state;
          }
          return {
            ...state,
            ...model.reducers[actionName](state, status, payload),
          };
        },
      };
    }, {});

    const crossSliceReducer = (state, { payload, type }) => {
      const [prefix, actionName, status] = type.split('/');
      const model = this[prefix];

      if (
        !payload ||
        status !== 'success' ||
        !model.crossReducers ||
        typeof model.crossReducers[actionName] !== 'function'
      )
        return state;

      return {
        ...state,
        ...model.crossReducers[actionName](state, payload),
      };
    };

    this.actions = this.modelNames.reduce((s, modelName) => {
      const model = this[modelName];
      const actionsModel = Object.keys(model.actions).reduce(
        (ss, actionName) => ({
          ...ss,
          [actionName]: (...args) =>
            this.store.dispatch({
              type: `${modelName}/${actionName}`,
              payload: model.actions[actionName](...args),
            }),
        }),
        {},
      );
      return { ...s, [modelName]: actionsModel };
    }, {});

    const middleware = store => next => action => {
      const state = next(action);
      const [prefix, actionName, status] = action.type.split('/');

      if (status || typeof models[prefix].effects[actionName] !== 'function') {
        return state;
      }
      // eslint-disable-next-line no-shadow
      const onFinish = status => payload => {
        store.dispatch({
          type: `${prefix}/${actionName}/${status}`,
          payload,
        });
      };
      models[prefix].effects[actionName](action.payload, onFinish('success'), onFinish('error'));
      return state;
    };

    const composeEnhancers =
      (process.env.NODE_ENV === 'development' &&
        typeof window !== 'undefined' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
      compose;

    const enhancer = composeEnhancers(applyMiddleware(middleware));

    const combinedReducer = combineReducers(allReducers);

    const rootReducer = function rootReducer(state, action) {
      return crossSliceReducer(combinedReducer(state, action), action);
    };

    this.store = createStore(rootReducer, enhancer);
  },
};

export const initRegisters = registerModels =>
  Object.keys(registerModels).forEach(m => {
    models[registerModels[m].name] = registerModels[m];
    models.modelNames.push(registerModels[m].name);
  });

export const useModel = (name, selector) => {
  if (!models.store) {
    models.initStore();
  }
  const model = models[name];
  const [state, setState] = useState(model.getState(selector));

  // TODO
  useReactEffect(() => {
    if (!isEqual(state, model.getState(selector))) {
      setState(model.getState(selector));
    }
    const unsub = models.store.subscribe(() => {
      if (!isEqual(state, model.getState(selector))) {
        setState(model.getState(selector));
      }
    });
    return () => unsub();
  }, [state, isEqual(state, model.getState(selector))]);

  return [state, models.actions[name]];
};
