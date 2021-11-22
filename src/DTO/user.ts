export class User {
    email: string;
    firstName: string;
    lastName: string;
    accountType: string;
    personalTrainerId: number;
    
    constructor(email: string, firstName: string, lastName: string, accountType: string, personalTrainerId: number = -1) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.accountType = accountType;
        this.personalTrainerId = personalTrainerId;
    }
}