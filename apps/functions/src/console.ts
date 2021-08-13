/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as admin from 'firebase-admin';
import * as Excel from 'exceljs';
import { Card, CardsStateModel } from 'libs/data/src/lib/interfaces';
import { flatten, sort } from 'libs/data/src/lib/utils';
import { OrderState } from 'libs/data/src/lib/enums';
import { getReportForStudent } from './helper';

export class Row {
    code: string;
    kaart_1: string;
    kaart_1_domein: 'samenleving' | 'ecologie' | 'economie';
    kaart_2: string;
    kaart_2_domein: 'samenleving' | 'ecologie' | 'economie';
    kaart_3: string;
    kaart_3_domein: 'samenleving' | 'ecologie' | 'economie';
    kaart_4: string;
    kaart_4_domein: 'samenleving' | 'ecologie' | 'economie';
}

(async () => {
    try {
        const rows: Row[] = [];
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const serviceAccount = require(process.cwd() + '/apps/functions/burgerschap-dev-firebase-adminsdk.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: 'https://burgerschap-dev.firebaseio.com'
        });

        const report = await getReportForStudent('4qXN09605mM0agmw56V3MLn4q5k1', 'SHSZM', true);
        console.log(report);
        //Bds1dIbRoOQXYHoKarG7s3FFQcL2
        //     // for future database manipulation/exports etc.
        //     const teacherId = 'EqTjJpGfsYPVz8GRTHOnJjJsCKz2';
        //     const teacherActivityPath = `/teacher/${teacherId}/activity`;

        //     const activities = await admin.firestore().collection(teacherActivityPath).listDocuments();
        //     for (const activityRef of activities) {
        //         // const activity = act.data() as Activity;
        //         const allStudentStates:CardsStateModel[] = [];
        //         const splittedPath = activityRef.path.split('/');
        //         const code = splittedPath[splittedPath.length - 1];
        //         const studentStates = await admin.firestore().collection(`${activityRef.path}/student`).listDocuments();
        //         for (const studentStateRef of studentStates) {
        //             const studentState = (await studentStateRef.get()).data() as CardsStateModel;
        //             allStudentStates.push(studentState);
        //             if (studentState.orderState === OrderState.done) {
        //                 const sortedCards = sort(studentState.cards, c => c.order);
        //                 rows.push({
        //                     code,
        //                     kaart_1: sortedCards[0].id,
        //                     kaart_1_domein: sortedCards[0].domain,
        //                     kaart_2: sortedCards[1].id,
        //                     kaart_2_domein: sortedCards[1].domain,
        //                     kaart_3: sortedCards[2].id,
        //                     kaart_3_domein: sortedCards[2].domain,
        //                     kaart_4: sortedCards[3].id,
        //                     kaart_4_domein: sortedCards[3].domain
        //                 });
        //             }
        //         }
        //    }

        //     const workbook = new Excel.Workbook();
        //     //Creating Sheet for that particular WorkBook
        //     const sheetName = 'Sheet1';
        //     const sheet = workbook.addWorksheet(sheetName);
        //     const columns = [];
        //     for (const fieldName in rows[0]) {
        //         columns.push({ key: fieldName, header: fieldName });
        //     }
        //     sheet.columns = columns;
        //     for (const row of rows) {
        //         sheet.addRow(row);
        //     }



        //     //Finally creating XLSX file
        //     const fileName = "burgerschap.xlsx";
        //     await workbook.xlsx.writeFile(fileName);
        console.log("done");
    } catch (e) {
        // Deal with the fact the chain failed
        console.error(e);
    }
}
)();