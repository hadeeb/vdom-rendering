/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { getHook, renderComponent } from "./component.js";
import { microTask, macroTask } from "./utils.js";

/**
 * @typedef StateHook
 * @type {object}
 * @property {State} state
 * @property {(action?:Action)=>void} dispatch
 * @property {(prevState:State,action?:Action)=>State} reducer
 * @template State,Action
 */

/**
 * useReducer hook
 * @param {(prevState:State,action:Action)=>State} reducer
 * @param {State|(()=>State)|T} initialState
 * @param {(x:T)=>State} [init]
 * @returns {[State,(action?:Action)=>void]}
 * @template State,Action,T
 */
function useReducer(reducer, initialState, init) {
  /**
   * @type {[StateHook<State,Action>,VNode]}
   */
  const [hookState, currentComponent] = getHook();

  hookState.reducer = reducer;

  if (!hookState.dispatch) {
    // Initialize hook
    Object.assign(hookState, {
      // State
      state: init
        ? init(initialState)
        : reducerForUseState(
            undefined,
            /**@type {State|(()=>State)} */ (initialState)
          ),
      // Update function aka `dispatch`
      dispatch: (action) => {
        // Calculate new state
        const newValue = hookState.reducer(hookState.state, action);

        if (newValue !== hookState.state) {
          // Update state if it has changed
          hookState.state = newValue;

          // Re-render the component
          renderComponent(
            currentComponent,
            currentComponent.dom,
            currentComponent
          );
        }
      },
    });
  }

  return [hookState.state, hookState.dispatch];
}

/**
 *
 * @param {T} prevState
 * @param {T|((prev:T)=>T)} newStateOrCallback
 * @template T
 */
function reducerForUseState(prevState, newStateOrCallback) {
  return typeof newStateOrCallback === "function"
    ? /**@type {(prev:T)=>T}*/ (newStateOrCallback)(prevState)
    : newStateOrCallback;
}

/**
 * useState hook
 * @example
 * const [count,setCount] = useState(0)
 * @param {T|(()=>T)} init
 * @returns {[T,(update:T|((prev:T)=>T))=>void]}
 * @template T
 */
function useState(init) {
  return useReducer(reducerForUseState, init);
}

/**
 * @typedef EffectHook
 * @type {object}
 * @property {any[]} args dependecy array of the effect
 * @property {()=>void|VoidFunction} value effect function
 * @property {VoidFunction|void} cleanup effect cleanup function, returned from effect fuction
 */

/**
 * useEffect hook
 * @param {()=>void|VoidFunction} callback effect
 * @param {any[]} [args] dependecy array of the effect
 */
function useEffect(callback, args) {
  effectHook(callback, args, macroTask);
}

/**
 * useLayoutEffect hook
 * @param {()=>void|VoidFunction} callback effect
 * @param {any[]} [args] dependecy array of the effect
 */
function useLayoutEffect(callback, args) {
  effectHook(callback, args, microTask);
}

/**
 * Effect hook
 * @param {()=>void|VoidFunction} callback effect
 * @param {any[]} [args] dependecy array of the effect
 * @param {(callback: () => void) => void} delayFn when to execute the effect
 */
function effectHook(callback, args, delayFn) {
  /**
   * @type {[EffectHook,VNode]}
   */
  const [hookState] = getHook();

  if (hasArgsChanged(hookState.args, args)) {
    // Run cleanup for previous effect
    invokeEffectCleanup(hookState);
    // update hookState
    Object.assign(hookState, {
      args,
      value: callback,
      cleanup: null,
    });

    // Invoke the new effect
    invokeEffect(hookState, delayFn);
  }
}

/**
 * Check if any of the dependencies of a hook has changed
 * @param {any[]|undefined} prevArgs previous dependencies of the hook
 * @param {any[]} args current dependencies of the hook
 */
function hasArgsChanged(prevArgs, args) {
  if (!prevArgs) {
    // 1. When the hook is initializing prevArgs will be undefined
    // 2. If the hook does not have any dependencies declared, prevArgs will be undefined
    // In both cases hook should run
    return true;
  }
  // Check if any of the items in the dependencies array has changed
  return prevArgs.some((prevArg, i) => prevArg !== args[i]);
}

/**
 * Run an effect
 * @param {EffectHook} hook
 * @param {(callback: () => void) => void} delayFn
 */
function invokeEffect(hook, delayFn) {
  // Defer the effect execution
  delayFn(() => {
    hook.cleanup = hook.value();
  });
}

/**
 * Given an effect hook,run it's cleanup function
 * @param {EffectHook} hook
 */
function invokeEffectCleanup(hook) {
  if (typeof hook.cleanup === "function") {
    hook.cleanup();
  }
}

/**
 * @typedef RefHook
 * @type {object}
 * @property {T} current value
 * @template T
 */

/**
 * useRef hook
 * @param {T} initialValue
 * @returns {RefHook<T>}
 * @template T
 */
function useRef(initialValue) {
  /**
   * @type {[RefHook<T>,VNode]}
   */
  const [hookState] = getHook();
  if (!("current" in hookState)) {
    // Initialize hook
    // @ts-ignore
    hookState.current = initialValue;
  }
  return hookState;
}

/**
 * @typedef MemoHook
 * @type {object}
 * @property {any[]} args dependecy array of the hook
 * @property {T} value value
 * @template T
 */

/**
 * useMemo hook
 * @param {()=>T} callback effect
 * @param {any[]} [args] dependecy array of the effect
 * @template T
 */
function useMemo(callback, args) {
  /**
   * @type {[MemoHook<T>,VNode]}
   */
  const [hookState] = getHook();
  if (hasArgsChanged(hookState.args, args)) {
    hookState.args = args;
    hookState.value = callback();
  }
  return hookState.value;
}

/**
 * useCallback hook
 * @param {T} callback effect
 * @param {any[]} [args] dependecy array of the effect
 * @template T
 */
function useCallback(callback, args) {
  return useMemo(() => callback, args);
}

export {
  useReducer,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
  invokeEffectCleanup,
};
