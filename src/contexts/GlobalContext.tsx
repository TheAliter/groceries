import { createContext, ReactElement, useReducer } from "react";

export const GlobalContext = createContext<ContextInterface | null>(null);

const initialState = {
  useShoppingListGuard: true,
};

function globalReducer(state: ContextInterface, action: Actions) {
  switch (action.type) {
    case ActionType.CHANGE_USE_SHOPPING_LIST_GUARD:
      return { ...state, useShoppingListGuard: action.payload };

    default:
      return state;
  }
}

export function GlobalProvider({ children }: Props) {
  const [state, dispatch] = useReducer(globalReducer, {
    ...initialState,
    updateUseShoppingListGuard,
  });

  function updateUseShoppingListGuard(shouldUse: boolean) {
    dispatch({
      type: ActionType.CHANGE_USE_SHOPPING_LIST_GUARD,
      payload: shouldUse,
    });
  }

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
}

interface Props {
  children: ReactElement;
}

interface ContextInterface {
  useShoppingListGuard: boolean;
  updateUseShoppingListGuard: Function;
}

enum ActionType {
  "CHANGE_USE_SHOPPING_LIST_GUARD",
}

type Actions = {
  type: ActionType.CHANGE_USE_SHOPPING_LIST_GUARD;
  payload: boolean;
};
