import {BackendQueryEngine} from "../QueryEngine";

export interface UserProfile {
  userId: string,
  username: string,
  email: string
  role: string,
  imageUrl?: string,
  registrationTime: Date
}

export interface UserProfileMinimal {
  userId: string,
  username: string,
  imageUrl?: string,
  registrationTime: Date
}

export function emptyUserProfile(): UserProfile {
  return {userId: "", role: "", email: "", username: "", registrationTime: new Date()} as UserProfile;
}

export default class UserService {
  private queryEngine: BackendQueryEngine;

  constructor(queryEngine: BackendQueryEngine) {
    this.queryEngine = queryEngine;
  }

  getUserProfile = (userId: string): Promise<UserProfile> => {
    return this.queryEngine.get(`/user/${userId}`).then(e => {
      return e as UserProfile;
    });
  }

  getUsers = (userIds: Array<string>): Promise<Array<UserProfileMinimal>> => {
    return this.queryEngine.get(`/user?ids=${userIds.join(",")}`).then(e => {
      return e as Array<UserProfileMinimal>;
    });
  }
}