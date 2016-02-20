/**
 * Created by tiezad on 15.02.2016.
 */
export class User {
    public name:string;
    public email:string;
    public country:string;
    public provider:string;

    constructor(name:string, email:string, country:string, provider:string) {
        this.name = name;
        this.email = email;
        this.country = country;
        this.provider = provider;
    }
}