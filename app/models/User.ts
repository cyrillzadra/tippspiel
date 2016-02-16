/**
 * Created by tiezad on 15.02.2016.
 */
export class User {
    private name:string;
    private email:string;
    private country:string;
    private provider:string;

    constructor(name:string, email:string, country:string, provider:string) {
        this.name = name;
        this.email = email;
        this.country = country;
        this.provider = provider;
    }
}