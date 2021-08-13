import { ActivityState, OrderState } from "./enums";

export interface CardsStateModel {
    activity: Activity;
    user: UserInfo;
    confirmedAnswer: boolean;
    cards: Card[];
    currentThemeId: string;
    orderState: OrderState;
    report: StudentReport
}

export interface Activity {
    code: string;
    state: ActivityState;
    createdBy: string;
    startedDate: Date;
    currentThemeId: string;
    finishedDate?: Date;
}

export interface Theme {
    id: string,
    title: string,
    description: string,
    cards: Card[],
    prompts: string[]
    themeColor: string;
}

// export interface StudentActivity {
//     activityCode: string;
//     avatarIndex: number;
//     state: OrderState;
//     activityState: ActivityState;
//     currentGroupDiscussionCardId?: string;
//     groupResponses: { cardId: string; response: ''; domain:  'samenleving' | 'ecologie' | 'economie', order?: number }[];
//     createdBy: string;
//     startedDate: Date;
//     finishedDate?: Date;
// }
export type DomainType = 'samenleving' | 'ecologie' | 'economie';

export interface Card {
    title: string;
    themeId: string;
    thesis: string;
    thesisShort: string;
    id: string;
    order?: number;
    themeColor: string;
    domain?: DomainType;
}

export interface UserInfo {
    id: string;
    token: string;
    activityCode: string;
    avatarIndex: number;
    teacherId: string;
    demoUser: boolean;
}

export interface ActionBase {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload: any;
    activityCode: string;
    createdBy: string;
    time: number;
}

export interface StudentActionBase extends ActionBase {
    avatarIndex: number;
    teacherId: string;
}

export interface StudentReport {
    uniqueRankings: number;
    studentCount: number;
    matching: number;
    matchingMostImportant: number;
    notMatching: number;
    domainCounts: {
        ecologie: number;
        economie: number;
        samenleving: number;
    }
}