import * as LocalForage from 'localforage';

export const saveState = (state) => {
  console.log('state being saved', state);
  console.log('localforage', LocalForage);
  LocalForage.setItem('state', state);
};

export const getState = () => LocalForage.getItem('state').then((state) => {
  if (state === null) {
    return undefined;
  }
  return state;
});
