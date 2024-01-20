export enum SelectedPage{
    Home="home",
    OurClasses = "ourclasses",
    Benefits="benefits",
    ContactUs="contactus"

}

export interface BenefitType {
    icon: JSX.Element;
    title: string;
    description: string;
  }

  export interface ClassType {
    name: string;
    description?: string;
    image: string;
  }

  export enum StatusType {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
  }
  export enum UserType {
    ADMIN = 'ADMIN',
    TRAINER = 'TRAINER',
    MEMBER = 'MEMBER'
  }

  export type Member = {
    id?: string;
    firstName: string;
    lastName: string;
    userType?: UserType
    email: string;
    username: string;
    image?: string;
    qrCode?: string|null;
    trainerEmail?: string|null;
    TrainerImage?: string|null;
    trainerName?: string|null;
    trainerId?: string|null;
    //trainerUserType: UserType.TRAINER;   //ovo mozda samo treba UserType pa poslije staviti trener
    address: string;
    phone: string;
    statusType?: StatusType|undefined
    password: string
    trainingPlanName?: string;
    trainingPlanId?: string
    numOfMonths: number
  
  }

  export type Trainer = {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    address: string;
    phone: string;
    statusType?: StatusType
    password: string
    members?: Member[]
    image?: string
    userType?: UserType;
  }