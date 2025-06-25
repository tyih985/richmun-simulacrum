export type Country = {
    name: string;
    longName: string;
    flag: string;
}

export type Delegate = {
    country: Country;
    email: string;
}

export type Staff = {
    role: string;
    email: string;
}

export type SetupFormValues = {
    committeeLongName: string;
    committeeShortName: string;
    staff: Staff[];
    delegates: Delegate[];
    dateRange: [Date | null, Date | null];
}