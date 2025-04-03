const initialState = {
  showMenu: false
};

const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return {
        ...state,
        showMenu: !state.showMenu
      };
    case 'CLOSE_MENU':
      return {
        ...state,
        showMenu: false
      };
    default:
      return state;
  }
};

export default menuReducer; 