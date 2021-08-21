class Char {
    constructor(charInfo) {
        this.name  = charInfo.login;
        this.nivel = charInfo.nivel;
        this.x = charInfo.x;
        this.y = charInfo.y;
        this.experience = charInfo.experience;
        this.gold = charInfo.gold;

        // ultima vez que fez algo no server
        this.lastActivity = 0;

        // skills
        this.kamehameha = 0;
    }
}