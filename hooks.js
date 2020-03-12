/**
 * @typedef VNode
 * @type {import("./createElement").VNode}
 */

import { getHook, renderComponent } from "./component.js";

/**
 * @typedef StateHook
 * @type {object}
 * @property {any} state
 * @property {(action:any)=>void} dispatch
 */

/**
 * useReducer hook
 * @param {(prevState:State,action:Action)=>State} reducer
 * @param {State|(()=>State)} init
 * @returns {[State,(action:Action)=>void]}
 * @template State,Action
 */
function useReducer(reducer, init) {
  /**
   * @type {[StateHook,VNode]}
   */
  const [hookState, currentComponent] = getHook();

  if (!hookState.dispatch) {
    // Initialize hook
    Object.assign(hookState, {
      // State
      state: typeof init === "function" ? init() : init,
      // Update function aka `dispatch`
      dispatch: action => {
        // Calculate new state
        const newValue = reducer(hookState.state, action);
        if (newValue !== hookState.state) {
          // Update state if it has changed
          hookState.state = newValue;
          if (currentComponent.dom) {
            // This check is to ensure vnode is still mounted
            // See utils.js -> unmountComponent
            // Re-render the component
            renderComponent(
              currentComponent,
              currentComponent.dom,
              currentComponent
            );
          }
        }
      }
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
function reducerForuseState(prevState, newStateOrCallback) {
  return typeof newStateOrCallback === "function"
    ? newStateOrCallback(prevState)
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
  return useReducer(reducerForuseState, init);
}

/**
 * @typedef EffectHook
 * @type {object}
 * @property {any[]} args dependecy array of the effect
 * @property {()=>void|VoidFunction} value effect function
 * @property {VoidFunction|null} cleanup effect cleanup function, returned from effect fuction
 */

/**
 * useEffect hook
 * @param {()=>void|VoidFunction} callback effect
 * @param {any[]} args dependecy array of the effect
 */
async function useEffect(callback, args) {
  /**
   * @type {[EffectHook]}
   */
  const [hookState] = getHook();

  if (hasChanged(hookState.args, args)) {
    // Run cleanup for previous effect
    invokeEffectCleanup(hookState);
    // update hookState
    Object.assign(hookState, {
      args,
      value: callback,
      cleanup: null
    });

    // Invoke the new effect
    invokeEffect(hookState);
  }
}

/**
 * Check if useEffect arguments has changed
 * @param {any[]|undefined} prevArgs
 * @param {any[]} args
 */
function hasChanged(prevArgs, args) {
  return !prevArgs || prevArgs.some((prevArg, i) => prevArg !== args[i]);
}

/**
 * Run an effect
 * @param {EffectHook} hook
 */
async function invokeEffect(hook) {
  // Defer the effect execution
  await Promise.resolve();
  const cleanup = hook.value();
  if (typeof cleanup === "function") {
    hook.cleanup = cleanup;
  }
}

/**
 * Given an effect hook,run it's cleanup function
 * @param {EffectHook} hook
 */
function invokeEffectCleanup(hook) {
  if (hook.cleanup) {
    // This is a useEffect hook
    hook.cleanup();
  }
}

/**
 * @typedef RefHook
 * @type {object}
 * @property {any} current value
 */

/**
 * useRef hook
 * @param {T} initialValue
 * @returns {{current:T}}
 * @template T
 */
function useRef(initialValue) {
  /**
   * @type {[RefHook]}
   */
  const [hookState] = getHook();
  if (!("current" in hookState)) {
    // Initialize hook
    hookState.current = initialValue;
  }
  return hookState;
}

export { useReducer, useState, useEffect, useRef, invokeEffectCleanup };
