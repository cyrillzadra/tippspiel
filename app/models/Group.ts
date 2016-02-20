/**
 * Created by tiezad on 15.02.2016.
 */
export class Group {
    public name:string;
    public shared:boolean;
    public password:string;
    public worldranking:boolean;

    constructor(name:string, shared:boolean, password:string, worldranking:boolean) {
        this.name = name;
        this.shared = shared;
        this.password = password;
        this.worldranking = worldranking;
    }
}