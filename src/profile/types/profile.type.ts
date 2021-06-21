import {UserType} from "@app/user/types/userType";

export type ProfileType = UserType & { following: boolean };