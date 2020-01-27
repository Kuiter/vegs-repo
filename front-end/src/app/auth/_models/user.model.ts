/**Model inforcment for login data */
export interface LoginData {
    username: string;
    password: string;
}
/**Model inforcment for login response */
export interface LoginResp {
    /**Unused */
    auth: boolean;
    /**Unused  */
    token: string;
}
/**Model inforcment for register data */
export interface RegisterData {
    /**Unique username */
    username: string;
    /**unique email */
    email: string;
    /**Password at least 6 characters and one special character. */
    password: string;
}
/**Model inforcment for register response */
export interface RegisterResp {
    /**Boolean unused in code. */
    created: boolean;
    /**JSON Web token not used any more */
    token: string;
}
