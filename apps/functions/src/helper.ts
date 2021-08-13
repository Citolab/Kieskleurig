// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as admin from 'firebase-admin';
import {
    DATABASE,
    CardsStateModel,
    sort,
    getUnique,
    StudentReport,
    OrderState,
    flatten
} from '@burgerschap/data';

export async function getReportForStudent(userId: string, activityCode: string, isDev: boolean):
    Promise<{ errorCode?: number, report: StudentReport }> {
    try {

        if (userId) {
            const collectionName = isDev ? 'state_dev' : 'state';
            const mySortState = (await admin.firestore().collection(collectionName).doc(userId).get()).data() as CardsStateModel;
            const mySortedCards = mySortState.cards.filter(c => c.order !== null).map(c => c.id);
            //const activity = (await (admin.firestore().doc(DATABASE.ACTIVITY.DOC(activityCode)).get())).data() as Activity;
            const teacherId = mySortState.activity.createdBy;
            const studentDocRef = admin.firestore().collection(DATABASE.TEACHER.ACTIVITY.STUDENT.COLLECTION(teacherId, activityCode));
            const allStudentStates = [] as Array<CardsStateModel>;
            const listedDocs = await studentDocRef.listDocuments();
            for (const doc of listedDocs) {
                const studentState = (await doc.get()).data() as CardsStateModel;
                if (studentState.orderState === OrderState.done) {
                    allStudentStates.push(studentState);
                }
            }
            const otherStudentState = allStudentStates.filter(s => s.user.id !== userId);
            const allcards = flatten(allStudentStates.map(s => s.cards));
            if (!allStudentStates.find(s => s.user.id === userId)) {
                // student should be in the collection
                return { errorCode: 403, report: null };
            } else {
                const rankings = allStudentStates.map(s => {
                    const rankedCards = sort(s.cards.filter(c => c.order != null), c => c.order);
                    const cardIds = rankedCards.map(c => c.id).join('-');
                    const domains = rankedCards.map(c => c.domain).join('-');
                    return { userId: s.user.id, sortIdentifier: `${cardIds}##${domains}` };
                });
                const uniqueRankings = getUnique(rankings.map(r => r.sortIdentifier));
                const mySortIdentifer = rankings.find(r => r.userId === userId).sortIdentifier;
                const matchingRankings = rankings.filter(r => r.sortIdentifier === mySortIdentifer).length - 1;
                const myMostImportantCard = sort(mySortState.cards, c => c.order, true)[0];
                const matchingMostImportant = otherStudentState.filter(s => {
                    const mostImportantCard = sort(s.cards, c => c.order, true)[0];
                    if (mostImportantCard?.id === myMostImportantCard?.id &&
                        mostImportantCard?.domain === myMostImportantCard?.domain) {
                        return true;
                    }
                    return false;
                }).length;
                const totallyNotMatchingRankings = otherStudentState.filter(s => !s.cards.find(c => mySortedCards.includes(c.id))).length;
                return {
                    report: {
                        uniqueRankings: uniqueRankings.length,
                        matching: matchingRankings,
                        notMatching: totallyNotMatchingRankings,
                        studentCount: allStudentStates.length,
                        matchingMostImportant,
                        domainCounts: {
                            ecologie: allcards.filter(c => c.domain === 'ecologie').length,
                            economie: allcards.filter(c => c.domain === 'economie').length,
                            samenleving: allcards.filter(c => c.domain === 'samenleving').length
                        }
                    } as StudentReport
                };
            }
        } else {
            return { errorCode: 401, report: null };
        }

    } catch (e) {
        console.error(e);
        return { errorCode: 500, report: null };
    }
}