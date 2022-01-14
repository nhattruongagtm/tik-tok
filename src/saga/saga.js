import {takeLatest,put,all,takeEvery,delay,call} from 'redux-saga/effects'
import { editProfile } from '../utils/database'

export function* updateProfile(action){
    yield call(editProfile,action.payload);
    console.log("ok")
}

function* updateUser(){
    yield takeLatest("session/updateUser",updateProfile)
}

function* mySaga(){
    console.log("saga")
    yield all([
        updateUser(),
    ]);
}

export default mySaga;