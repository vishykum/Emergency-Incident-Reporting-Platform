// need this for unified Incident type

export interface Incident {
    location: string;
    type: string;
    timeReported: string;
    status: string;
    reportedBy?: string;
    phoneNumber?: string;
    comments?: string;
}