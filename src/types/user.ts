export interface User {
  id?: string;
  name: string;
  pronouns?: string;
  jobPosition: string;
  mobileNumber: string;
  email: string;
  profileImage?: string;
  socialMedia: {
    tiktok?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
    whatsapp?: string;
  };
}

export interface UserFormData extends Omit<User, 'id'> {}