const initialState = {
  fullScreen: false,
  text: 'Loading...'
};

const pageLoaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_LOADER':
      return {
        ...state,
        fullScreen: true,
        text: action.payload?.text || 'Loading...'
      };
    case 'HIDE_LOADER':
      return {
        ...state,
        fullScreen: false
      };
    case 'UPDATE_LOADER_TEXT':
      return {
        ...state,
        text: action.payload?.text || 'Loading...'
      };
    default:
      return state;
  }
};

export default pageLoaderReducer; 