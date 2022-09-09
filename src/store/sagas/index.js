import {all} from 'redux-saga/effects';
import {additionalInfoSaga} from './additionalInfoSaga';
import analyticSaga from './analyticsSaga';
import {authSaga} from './authSagas';
import {bookingSaga} from './bookingSaga';
import {categoryListSaga} from './categoryListSaga';
import {clientProfileDetailsSaga} from './clientProfileDetailsSaga';
import {clientsListSaga} from './clientsListSaga';
import {cmsSaga} from './cmsPageSaga';
import {faqListSaga} from './faqSaga';
import {professionalListingByCategorySaga} from './professionalListingByCategorySaga';
import {professionalProfileDetailsSaga} from './professionalProfileDetailsSaga';
import {professionalProfileSetupSaga} from './professionalProfileSetupSaga';
import {profileSaga} from './profileSaga';
import {reviewsSaga} from './reviewsSaga';
import {similarProsSaga} from './similarProsSaga';
import {verificationSaga} from './verificationSaga';
import { groupSessionSaga } from './groupSessionSaga';

export default function* rootSaga() {
  yield all([
    // you can insert other sagas here
    authSaga(),
    categoryListSaga(),
    additionalInfoSaga(),
    bookingSaga(),
    verificationSaga(),
    professionalProfileSetupSaga(),
    faqListSaga(),
    cmsSaga(),
    profileSaga(),
    professionalProfileDetailsSaga(),
    professionalListingByCategorySaga(),
    reviewsSaga(),
    similarProsSaga(),
    clientsListSaga(),
    clientProfileDetailsSaga(),
    analyticSaga(),
    groupSessionSaga()
  ]);
}
