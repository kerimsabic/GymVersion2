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