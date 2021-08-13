import firebase from "firebase/app";
import { OrderState } from "./enums";
import { Card, CardsStateModel, DomainType, Theme, UserInfo } from "./interfaces";
import themes from "./themes";


export const createCode = (length: number) => {
    let result = '';
    const characters = 'BCDFGHJKLMNPQRSTVWXYZ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const demoUserPhotoUrl = 'https://demouser.nl/demouser.png';

export const random = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const dateId = () => {
    const dt = new Date();
    const year = dt.getFullYear();
    const month = (dt.getMonth() + 1).toString().padStart(2, "0");
    const day = dt.getDate().toString().padStart(2, "0");
    const hour = (dt.getHours()).toString().padStart(2, "0");
    const minutes = (dt.getMinutes()).toString().padStart(2, "0");
    const seconds = (dt.getSeconds()).toString().padStart(2, "0");
    const milliseconds = (dt.getMilliseconds()).toString().padStart(3, "0");
    return `${year}${month}${day}${hour}${minutes}${seconds}${milliseconds}`;
}

export const setUserInfo = async (user: firebase.User, activityCode: string, teacherId: string, avatarId: string, demoUser = false) => {
    await user.updateProfile({
        // (ab)use display name to store the code of the
        // started started activity and teacher Id.
        displayName: `${activityCode}|${teacherId}|${avatarId}`,
        photoURL: demoUser ? demoUserPhotoUrl : ''
    });
    return await getUserInfo(user);
}

export const precise_round = (num: number, dec = 0): number => {
    const num_sign = num >= 0 ? 1 : -1;
    return +(Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec);
}

export const scale = (value: number, prevMax: number, decimals = 0) => {
    const result = (value * 100) / prevMax;

    if (result < 0) {
        return 0;
    } else if (result > 100) {
        return 100;
    }
    return precise_round(result, decimals);
};


export const isBaseUrl = (url: string) => {
    const parsedUrl = parseUrl(url);
    return !trim(parsedUrl.pathname, '/');
}

export const parseUrl = (url: string) => {
    // eslint-disable-next-line no-useless-escape
    const m = url.match(/^(([^:\/?#]+:)?(?:\/\/((?:([^\/?#:]*):([^\/?#:]*)@)?([^\/?#:]*)(?::([^\/?#:]*))?)))?([^?#]*)(\?[^#]*)?(#.*)?$/),
        r = {
            hash: m[10] || "",                   // #asd
            host: m[3] || "",                    // localhost:257
            hostname: m[6] || "",                // localhost
            href: m[0] || "",                    // http://username:password@localhost:257/deploy/?asd=asd#asd
            origin: m[1] || "",                  // http://username:password@localhost:257
            pathname: m[8] || (m[1] ? "/" : ""), // /deploy/
            port: m[7] || "",                    // 257
            protocol: m[2] || "",                // http:
            search: m[9] || "",                  // ?asd=asd
            username: m[4] || "",                // username
            password: m[5] || ""                 // password
        };
    if (r.protocol.length == 2) {
        r.protocol = "file:///" + r.protocol.toUpperCase();
        r.origin = r.protocol + "//" + r.host;
    }
    r.href = r.origin + r.pathname + r.search + r.hash;
    return r;
};

export const trim = (s: string, char: string) => {
    if (char === "]") char = "\\]";
    if (char === "^") char = "\\^";
    if (char === "\\") char = "\\\\";
    return s.replace(new RegExp(
        "^[" + char + "]+|[" + char + "]+$", "g"
    ), "");
}

export const getUserInfo = async (user: firebase.User): Promise<UserInfo> => {
    if (user && user.displayName) {
        const activityRef = user.displayName.split('|');
        return {
            id: user.uid,
            activityCode: activityRef.length > 1 ? activityRef[0] : '',
            teacherId: activityRef.length > 2 ? activityRef[1] : '',
            avatarIndex: activityRef.length > 3 ? +activityRef[2] : 0,
            demoUser: user.photoURL === demoUserPhotoUrl,
            token: await user.getIdToken()
        }
    }
    return null;
}
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export function getUnique<T>(arr: T[]): T[] {
    return arr.filter(onlyUnique);
}

export function groupBy<T, K>(list: T[], getKey: (item: T) => K) {
    const map = new Map<K, T[]>();
    list.forEach((item) => {
        const key = getKey(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return Array.from(map);
}

export const sum = (items: number[]) => items.reduce((sum, current) => +sum + +current, 0);

export function sumField<T>(items: T[], getKey: (item: T) => number) {
    return sum(items.map(getKey))
}

export function avgField<T>(items: T[], getKey: (item: T) => number) {
    if (items.length === 0) return 0;
    const summedValues = sum(items.map(getKey));
    return Math.round(summedValues / items.length);
}
export function flatten<T>(nestedArrays: T[][]): T[] {
    return [].concat(...nestedArrays);
}

export function sort<T, K>(list: T[], getKey: (item: T) => K, desc = false) {
    list.sort((a: T, b: T) => {
        const valueA = getKey(a);
        const valueB = getKey(b);
        if (valueA < valueB) {
            return !desc ? -1 : 1;
        } else if (valueA > valueB) {
            return !desc ? 1 : -1;
        } else {
            return 0;
        }
    });
    return list;
}

const getSelectedCardForStudent = (s: CardsStateModel, currentTheme: Theme) => {
    const selectedCard = s.cards.find(
        (c) => c.themeId === currentTheme.id
    );
    if (!selectedCard) {
        return null;
    }
    if (selectedCard.domain !== null) {
        return selectedCard;
    }
};

export const getCardDistribution = (studentStates: CardsStateModel[]): {
    card: Card;
    count: number;
    percentage: number;
    ecologie: number;
    economie: number;
    samenleving: number;
    opposite: boolean;
}[] => {
    const finishedStates = studentStates.filter(s => s.orderState === OrderState.done);
    const allChosenCards = finishedStates.map(c => c.cards.find(selectedCard => selectedCard.order > 0));
const cardsWithOpposite = flatten(themes.map(t => t.cards)).map((c, i) => ({...c, opposite: i % 2 === 0}));
    const total = allChosenCards.length;

    const allCards = flatten(themes.map(t => t.cards)).map(card => {
        const selectedCards = allChosenCards.filter(cc => cc.id === card.id);
        const count = selectedCards.length;
        return {
            card,
            opposite: cardsWithOpposite.find(c => c.id === card.id)?.opposite,
            count,
            percentage: Math.round((count / total) * 100),
            ecologie: selectedCards.filter(selectedCard => selectedCard.domain === 'ecologie').length,
            economie: selectedCards.filter(selectedCard => selectedCard.domain === 'economie').length,
            samenleving: selectedCards.filter(selectedCard => selectedCard.domain === 'samenleving').length,
        };
    });

    return sort(allCards, c => c.percentage, true);
}


export const getStudentCardInfo = (studentStates: CardsStateModel[], currentTheme: Theme) => {
    const total = studentStates.length;
    const cardDistribution: Array<
        Array<{ id: string; percentage: number; domain: DomainType }>
    > = [];
    let answered = 0;

    for (const studentState of studentStates) {
        const answer = getSelectedCardForStudent(studentState, currentTheme);
        if (answer) {
            answered++;
            cardDistribution.push(
                currentTheme.cards.map((c) => ({
                    id: c.id,
                    percentage: c.id === answer.id ? 100 : 0,
                    domain: c.id === answer.id ? answer.domain : null,
                }))
            );
        } else {
            cardDistribution.push(
                currentTheme.cards.map((c) => ({
                    id: c.id,
                    percentage: 50,
                    domain: null,
                }))
            );
        }
    }
    const cardPercentages = currentTheme.cards.map((c) => {
        return {
            id: c.id,
            percentage: Math.round(
                sum(
                    cardDistribution
                        .map(
                            (cd) =>
                                cd.find((percentages) => percentages.id === c.id)?.percentage
                        )
                        .filter((cd) => cd !== null)
                ) / total
            ),
        };
    });
    const cardDomainDistribution = currentTheme.cards.map((c) => {
        const domainDistribution = {
            economie: 0,
            samenleving: 0,
            ecologie: 0,
        };
        for (const domain of ['economie', 'ecologie', 'samenleving']) {
            const s = flatten(cardDistribution);
            domainDistribution[domain] = s.filter((d) => d.id === c.id && d.domain === domain).length;
        }
        return { id: c.id, distribution: domainDistribution };
    });
    return {
        answered,
        unanswered: total - answered,
        cardPercentages,
        cardDomainDistribution,
    };
};
