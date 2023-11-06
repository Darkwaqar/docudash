export interface RequestDetailsPage {
    status:                         boolean;
    message:                        string;
    NotaryRequests:                 NotaryRequests;
    NotaryRequestsDetails:          NotaryRequestsDetail[];
    NotaryRequestsDetailsDocuments: NotaryRequestsDetailsDocument[];
}

export interface NotaryRequests {
    id:                     number;
    notary_id:              number;
    reasonOfRequest:        string;
    requestDate:            string;
    requestTime:            number;
    numOfRecipients:        number;
    requestLocation:        number;
    requestMessage:         string;
    notary_request_status:  number;
    status:                 number;
    created_by:             number;
    updated_by:             number;
    deleted:                number;
    created_at:             Date;
    updated_at:             Date;
    read_status:            number;
    draggedElArr:           string;
    uniqid:                 string;
    long:                   null;
    lat:                    null;
    stripe_payment_info:    null;
    pending_payment_id:     null;
    client_secret:          null;
    amount:                 null;
    UploadedDocumentsCount: number;
    request_location_list:  RequestLocationList;
    notary_details:         Details;
    individual_details:     Details;
}

export interface Details {
    id:                          number;
    first_name:                  string;
    last_name:                   string;
    name:                        string;
    email:                       string;
    user_type:                   number;
    country:                     null | string;
    state:                       null | string;
    city:                        null | string;
    address1:                    null | string;
    address2:                    null | string;
    zip_code:                    number;
    video_call:                  null;
    licence_number:              null;
    account_type:                number;
    mobile:                      null;
    image:                       string;
    phone:                       string;
    verification_code:           string;
    verification_status:         number;
    verification_date:           Date;
    industry_id:                 number;
    sign_up_reasons_id:          number;
    lat:                         null | string;
    long:                        null | string;
    steps:                       number;
    logged_in:                   number;
    logged_in_at:                Date;
    logged_out_at:               Date;
    ip_sign_up:                  string;
    location_sign_up:            string;
    ip_sign_in:                  string;
    location_sign_in:            string;
    email_verified_at:           null;
    about_notary:                null | string;
    hired_time:                  null;
    bussiness_start_up_date:     null;
    status:                      number;
    deleted:                     number;
    created_by:                  number;
    updated_by:                  number;
    created_at:                  Date;
    updated_at:                  Date;
    trial_account_expired:       number;
    trial_account:               number;
    company:                     null | string;
    notary_document:             null;
    notary_document_staus:       number;
    verification_code_expire_at: Date;
    BannerImage:                 null;
    BioDescription:              null;
    ShortDescription:            null;
    ProofOfEmployes:             number;
    ProofOfEmployesDoc:          null;
    profile_photo_url:           string;
}

export interface RequestLocationList {
    id:         number;
    user_id:    number;
    name:       string;
    address:    string;
    city:       string;
    state:      string;
    country:    string;
    zip_code:   string;
    lat:        string;
    long:       string;
    uuid:       string;
    status:     number;
    created_by: number;
    updated_by: number;
    deleted:    number;
    created_at: Date;
    updated_at: Date;
}

export interface NotaryRequestsDetail {
    id:                     number;
    notary_id:              number;
    NotaryRequestsReturnID: number;
    sign_type:              number;
    recName:                string;
    recEmail:               string;
    hostName:               null;
    hostEmail:              null;
    status:                 number;
    created_by:             number;
    updated_by:             number;
    deleted:                number;
    created_at:             Date;
    updated_at:             Date;
    uniqid:                 string;
    view_final_response:    null;
    complete_incomplete:    number;
}

export interface NotaryRequestsDetailsDocument {
    id:                     number;
    notary_id:              number;
    NotaryRequestsReturnID: number;
    document:               string;
    status:                 number;
    created_by:             number;
    updated_by:             number;
    deleted:                number;
    created_at:             Date;
    updated_at:             Date;
    uniqid:                 string;
    docs:                   string[];
}
