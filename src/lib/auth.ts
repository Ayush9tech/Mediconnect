import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

let firebaseServices: ReturnType<typeof initializeFirebase> | null = null;

function getFirebaseServices() {
  if (!firebaseServices) {
    firebaseServices = initializeFirebase();
  }
  return firebaseServices;
}

export interface Activity {
  id: string;
  type: 'create-letter' | 'add-patient' | 'share' | 'receive' | 'view';
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface DoctorProfile {
  // Basic Information
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';

  // Professional Information
  specialization?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  medicalSchool?: string;
  graduationYear?: number;

  // Practice Information
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  clinicEmail?: string;

  // Preferences
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  notifications?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };

  // Activity Tracking
  letterCount?: number;
  patientCount?: number;
  sharedCount?: number;
  activities?: Activity[];

  // System Information
  createdAt: Date;
  updatedAt?: Date;
  profileComplete?: boolean;
}

export async function signUp(email: string, password: string): Promise<User> {
  const { auth } = getFirebaseServices();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function signIn(email: string, password: string): Promise<User> {
  const { auth } = getFirebaseServices();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logOut(): Promise<void> {
  const { auth } = getFirebaseServices();
  await signOut(auth);
}

export async function saveDoctorProfile(userId: string, profileData: Partial<DoctorProfile>): Promise<void> {
  try {
    const { firestore } = getFirebaseServices();
    const existingProfile = await getDoctorProfile(userId);

    const profile: DoctorProfile = {
      // Merge existing data with new data
      ...(existingProfile || {
        name: '',
        email: '',
        createdAt: new Date(),
        letterCount: 0,
        patientCount: 0,
        sharedCount: 0,
        activities: [],
      }),
      ...profileData,
      updatedAt: new Date(),
      // Mark as complete if basic info is filled
      profileComplete: !!(profileData.name && profileData.email && profileData.specialization),
    };

    console.log("Saving doctor profile to Firestore:", profile);
    await setDoc(doc(firestore, 'users', userId), profile);
    console.log("Doctor profile saved to Firestore successfully");
  } catch (error) {
    console.error("Firestore save failed, using localStorage fallback:", error);
    // Fallback to localStorage
    const STORAGE_KEY = 'mediconnect_doctor_profiles';
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const existingProfile = profiles[userId];

    const profile = {
      // Merge existing data with new data
      ...(existingProfile || {
        name: '',
        email: '',
        createdAt: new Date().toISOString(),
        letterCount: 0,
        patientCount: 0,
        sharedCount: 0,
        activities: [],
      }),
      ...profileData,
      updatedAt: new Date().toISOString(),
      // Mark as complete if basic info is filled
      profileComplete: !!(profileData.name && profileData.email && profileData.specialization),
    };

    profiles[userId] = profile;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    console.log("Doctor profile saved to localStorage");
  }
}

export async function getDoctorProfile(userId: string): Promise<DoctorProfile | null> {
  try {
    const { firestore } = getFirebaseServices();
    console.log("Getting doctor profile from Firestore for user:", userId);
    const docSnap = await getDoc(doc(firestore, 'users', userId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      const profile: DoctorProfile = {
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate?.() || (data.updatedAt ? new Date(data.updatedAt) : undefined),
      } as DoctorProfile;
      console.log("Found profile in Firestore:", profile);
      return profile;
    }
    console.log("No profile found in Firestore");
    return null;
  } catch (error) {
    console.error("Firestore get failed, checking localStorage:", error);
    // Fallback to localStorage
    const STORAGE_KEY = 'mediconnect_doctor_profiles';
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const profile = profiles[userId];
    if (profile) {
      const parsedProfile: DoctorProfile = {
        ...profile,
        createdAt: new Date(profile.createdAt),
        updatedAt: profile.updatedAt ? new Date(profile.updatedAt) : undefined,
      };
      console.log("Found profile in localStorage:", parsedProfile);
      return parsedProfile;
    }
    console.log("No profile found in localStorage");
    return null;
  }
}

export async function trackActivity(
  userId: string,
  activityType: 'create-letter' | 'add-patient' | 'share' | 'receive' | 'view',
  title: string,
  description?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const profile = await getDoctorProfile(userId);
    if (!profile) return;

    const activity: Activity = {
      id: `activity_${Date.now()}`,
      type: activityType,
      title,
      description,
      timestamp: new Date(),
      metadata,
    };

    // Update activity counts
    const updates: Partial<DoctorProfile> = {
      activities: [...(profile.activities || []), activity].slice(-10), // Keep last 10 activities
    };

    if (activityType === 'create-letter') {
      updates.letterCount = (profile.letterCount || 0) + 1;
    } else if (activityType === 'add-patient') {
      updates.patientCount = (profile.patientCount || 0) + 1;
    } else if (activityType === 'share') {
      updates.sharedCount = (profile.sharedCount || 0) + 1;
    }

    await saveDoctorProfile(userId, updates);
  } catch (error) {
    console.error("Failed to track activity:", error);
  }
}

export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const { firestore } = getFirebaseServices();
    // Try to get a non-existent document to test connection
    await getDoc(doc(firestore, 'test', 'connection'));
    console.log("Firestore connection successful");
    return true;
  } catch (error) {
    console.error("Firestore connection failed:", error);
    return false;
  }
}