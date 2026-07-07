import { db, auth } from '../lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export type UserRole = 'citizen' | 'asha' | 'doctor' | 'districtOfficer';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  district?: string;
  createdAt: any;
  lastLogin: any;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export class AuthorizationService {
  /**
   * Fetches the user profile from Firestore by UID.
   */
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  }

  /**
   * Creates a new user profile in the 'users' collection.
   */
  static async createUserProfile(
    uid: string, 
    name: string, 
    email: string, 
    role: UserRole, 
    district?: string
  ): Promise<UserProfile> {
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, 'users', uid);
      const newProfile: UserProfile = {
        uid,
        name: name || email.split('@')[0],
        email,
        role,
        district: district || '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      };
      await setDoc(docRef, newProfile);
      return newProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  /**
   * Updates the user's last login timestamp.
   */
  static async updateLastLogin(uid: string): Promise<void> {
    const path = `users/${uid}`;
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        lastLogin: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  /**
   * Helper mapping from workspace view/id to official Firestore roles
   */
  static mapDashboardToRole(view: string): UserRole | null {
    switch (view) {
      case 'citizen-dashboard':
        return 'citizen';
      case 'asha-dashboard':
        return 'asha';
      case 'doctor-dashboard':
        return 'doctor';
      case 'dho-dashboard':
        return 'districtOfficer';
      default:
        return null;
    }
  }

  /**
   * Helper mapping from workspace role (like RoleSelection card id) to official Firestore roles
   */
  static mapSelectionIdToRole(id: 'citizen' | 'asha' | 'doctor' | 'dho'): UserRole {
    switch (id) {
      case 'citizen':
        return 'citizen';
      case 'asha':
        return 'asha';
      case 'doctor':
        return 'doctor';
      case 'dho':
        return 'districtOfficer';
    }
  }
}
