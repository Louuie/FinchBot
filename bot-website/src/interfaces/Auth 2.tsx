export interface AuthenticationStatusInterface {
    authenticated?: boolean,
    display_name?: string,
    error?: string,
}

export interface TwitchUserInfoInterface {
    id?: string,
    login?: string,
    display_name?: string,
    profile_image_url?: string,
}