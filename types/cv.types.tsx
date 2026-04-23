export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
}
export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}
export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
}
export interface Skill {
    id: string;
    name: string;
    level: 'Básico' | 'Intermedio' | 'Avanzado' | 'Experto';
}
export interface CVData {
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
}

// PARA LAS IMÁGENES
export interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    profileImage?: string; // 🟢 NUEVO CAMPO AÑADIDO
}