export const DATABASE = {
    TEACHER: {
        ACTIVITY: {
            COLLECTION: (userId: string) => `teacher/${userId}/activity`,
            DOC: (userId: string, activityCode: string) => `teacher/${userId}/activity/${activityCode}`,
            STUDENT: {
                COLLECTION: (userId: string, activityCode: string) => `teacher/${userId}/activity/${activityCode}/student`,
                DOC: (userId: string, activityCode: string, studentId: string) => `teacher/${userId}/activity/${activityCode}/student/${studentId}`,
            }
        },
        ACTION: {
            COLLECTION: `teacher_action`,
            DOC: (id: string) => `teacher_action/${id}`,
        }
    },
    STUDENT: {
        ACTIVITY: {
            COLLECTION: (userId: string) => `student/${userId}/activity`,
            DOC: (userId: string, activityCode: string) => `student/${userId}/activity/${activityCode}`,
        },
        ACTION: {
            COLLECTION: `student_action`,
            DOC: (id: string) => `student_action/${id}`,
        },
    },
    // only used to check the login_code
    ACTIVITY: {
        COLLECTION: 'activity',
        DOC: (activityCode: string) => `activity/${activityCode}`
    }
}