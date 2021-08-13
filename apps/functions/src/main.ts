// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as corsPackage from 'cors';
import {
    Activity, ActivityState, createCode,
    DATABASE,
    CardsStateModel
} from '@burgerschap/data';
import { getReportForStudent } from './helper';

const cors = corsPackage({ origin: true });
admin.initializeApp();

const authenticate = async (res, id: string, allowedProviders: string[]) => {
    const user = await admin.auth().getUser(id);
    if (!user && !allowedProviders.includes('anonymous')) {
        res.status(403).send('Unauthorized');
        return null;
    }
    try {
        const provider = user.providerData.length > 0 ? user.providerData[0].providerId : 'anonymous';
        if (allowedProviders.indexOf(provider) !== -1) {
            return user;
        } else {
            console.error(`Access with provider ${provider} not allowed`)
            return null;
        }
    } catch (e) {
        res.status(403).send('Unauthorized');
        return null;
    }
};

const getActivity = async (code: string) => {
    const doc = await admin.firestore().doc(DATABASE.ACTIVITY.DOC(code)).get();
    return doc.exists ? (doc.data() as Activity) : null;
}

const checkCode = async (code: string) => {
    const activity = await getActivity(code);
    return (activity && activity.state !== ActivityState.finished);
}

const createActivity = async (userId: string) => {
    let code = createCode(5);
    // create code and make sure there is no other startable activity with the same code
    let exists = await checkCode(code);
    while (exists) {
        code = createCode(5);
        exists = await checkCode(code);
    }
    const activity = {
        createdBy: userId,
        startedDate: new Date(),
        code,
        state: ActivityState.notstarted,
    } as Activity;
    return activity;
};

exports.checkCode = functions
    .region('europe-west1')
    .https
    .onRequest((req, res) => {
        cors(req, res, async () => {
            if (req.method !== 'POST') {
                res.sendStatus(404);
            }

            // Grab the code parameter.
            const { code, userId }: { code: string, userId: string } = req.body?.data;
            const user = await authenticate(res, userId, ['anonymous']);
            if (!user) {
                return;
            }
            const activity = await getActivity(code.toUpperCase());
            if (activity && activity.state !== ActivityState.finished) {
                // create a new avatarIndex if the candidate wasn't started.
                const teacherDoc = admin.firestore().doc(DATABASE.TEACHER.ACTIVITY.DOC(activity.createdBy, activity.code));
                await teacherDoc.set(activity);
                const teacherStudentCollection = admin.firestore().collection(DATABASE.TEACHER.ACTIVITY.STUDENT.COLLECTION(activity.createdBy, activity.code));
                let avatarIndex = (await teacherStudentCollection.listDocuments()).length;
                const existingState = await teacherStudentCollection.doc(userId).get();
                if (existingState.exists) {
                    console.warn(`user logs in with same code. Shouldn't be possible`);
                    avatarIndex = (existingState.data() as CardsStateModel).user.avatarIndex;
                }
                res.send({ data: { activity: activity, avatarIndex } });
            } else {
                res.sendStatus(404);
            }
            return;
        });
    });

exports.getStudentReport = functions
    .region('europe-west1')
    .https
    .onRequest(async (req, res) => {
        cors(req, res, async () => {
            const { userIdToken, activityCode, isDev } = req.body.data;
            const decodedToken = await admin.auth().verifyIdToken(userIdToken);
            const userId = decodedToken.uid;
            const reportInfo = await getReportForStudent(userId, activityCode, isDev);
            if (reportInfo.errorCode) {
                res.sendStatus(reportInfo.errorCode);
            } else {
                res.send({ data: { report: reportInfo.report } });
            }
            return;
        });
    });

exports.getOrCreateActivity = functions
    .region('europe-west1')
    .https
    .onRequest((req, res) => {
        cors(req, res, async () => {
            const allowedProviders = ['password', 'google.com'];
            const { userId }: { code: string, userId: string } = req.body?.data;
            const user = await authenticate(res, userId, allowedProviders);
            if (user) {
                // check if there is already an activity in progress
                const activitiesRef = admin.firestore().collection(DATABASE.ACTIVITY.COLLECTION);
                const activities = await activitiesRef
                    .where('createdBy', '==', userId)
                    .where('state', '!=', ActivityState.finished)
                    .limit(1)
                    .get();
                const docs = activities.docs;
                const existingActivity = docs.length > 0 ? docs[0].data() as Activity : null;
                if (existingActivity) {
                    res.send({ data: { activity: existingActivity } });
                } else {
                    // create new activity
                    const newActivity = await createActivity(userId);
                    // create entry in activity collection and create an activity for the teacher
                    await admin.firestore().doc(DATABASE.ACTIVITY.DOC(newActivity.code)).set(newActivity);
                    await activitiesRef.doc(newActivity.code).set(newActivity);
                    res.send({ data: { activity: newActivity } });
                }
            }
            return;
        })
    });

export const ProcessStudentSortStateChanged = functions
    .region('europe-west1')
    .firestore
    .document('/state/{id}')
    .onWrite(async ({ after }) => {
        const newState = after.data() as CardsStateModel;
        const teacherId = newState.activity.createdBy;
        const activityCode = newState.activity.code;
        const studentId = newState.user.id;
        const studentDocRef = admin.firestore().doc(DATABASE.TEACHER.ACTIVITY.STUDENT.DOC(teacherId, activityCode, studentId));
        await studentDocRef.set(newState);
    });

export const ProcessStudentSortStateDevChanged = functions
    .region('europe-west1')
    .firestore
    .document('/state_dev/{id}')
    .onWrite(async ({ after }) => {
        const newState = after.data() as CardsStateModel;
        const teacherId = newState.activity.createdBy;
        const activityCode = newState.activity.code;
        const studentId = newState.user.id;
        const studentDocRef = admin.firestore().doc(DATABASE.TEACHER.ACTIVITY.STUDENT.DOC(teacherId, activityCode, studentId));
        await studentDocRef.set(newState);
    });

// export const processActivityDataChanges = functions
//     .region('europe-west1')
//     .firestore
//     .document('/action/{id}')
//     .onCreate(async (doc) => {
//         const action = doc.data() as StudentActionBase;
//         switch (action.type) {
//             case studentTypes.ORDER.START: {
//                 const startAction = orderStartAction(action.payload);
//                 const studentDocRef = admin.firestore().doc(`teacher/${action.createdBy}/activity/${action.activityCode}/student/${action.createdBy}`);
//                 await studentDocRef.set({

//                 } as StudentState);
//             }
//         }
//     }
// }