/**
 * Created by tiezad on 15.02.2016.
 */
export class Group {
    public name:string;
    public description:string;
    public shared:boolean;
    public password:string;
    public worldRanking:boolean;
    public admin:string;

    constructor(name:string, description:string, shared:boolean,
                password:string, worldRanking:boolean, admin:string) {
        this.name = name;
        this.description = description;
        this.shared = shared;
        this.password = password;
        this.worldRanking = worldRanking;
        this.admin = admin;
    }
}