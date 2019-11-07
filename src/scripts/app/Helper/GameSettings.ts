export const wellPlayerTextStyle = ({
    fontFamily: "Topaz-8-remake",
    fontSize: 35,
    fill: "#000000",
    align: "center",
});

export const yellowColor = "#f7f82e";
export const blueColor = "#0601e1";

export const creditsTextStyle = ({ 
    fontFamily: "Topaz-8-remake",
    fontSize: 26,
    fill: "#1f140a",
    align: "center",
});
export const ballTextStyle = new PIXI.TextStyle({
    fontFamily: "Topaz-8-remake",
    fontSize: 20,
    fill: "#000000",
    align: "center",
});
export const betTextStyle = ({
    fontFamily: "Topaz-8-remake",
    fontSize: 26,
    fill: "#1f140a",
    align: "left",
});
export const winTextStyle = ({
    fontFamily: "Topaz-8-remake",
    fontSize: 26,
    fill: "#1f140a",
    align: "center",
});
export const spotsTextStyle = ({
    fontFamily: "Topaz-8-remake",
    fontSize: 26,
    fill: "#1f140a",
    align: "center",
});

export const hitTextStyle = ({
    fontFamily: "Topaz-8-remake",
    fontSize: 26,
    fill: "#1f140a",
    align: "center",
});

export const gameResultTextStyle = ({
    fontFamily: "Topaz-8-remake",
    fontSize: 26,
    fill: "#1f140a",
    align: "center",
});

export const makeBetTextStyle = ({
    fontFamily: "Topaz-8-remake",
    fontSize: 35,
    fill: "#1f140a",
    align: "center",
});

export const errorTextStyle = ({
    fontFamily: "Topaz-8-remake",
    fontSize: 35,
    fill: "#000000",
    align: "center",
});

export const numbersTextStyle = ({
    fontFamily: "Topaz-8-remake",
    fontSize: 24,
    fill: "#f7f82e",
    align: "center",
});

export const PLAYACTION = "play";
export const TAKEWIN = "takewin";
export const EXTRABALL = "extraball";
export const INIT = "init";
export const ERROR = "error";

export const fakeKey: any = {
    "q": ["q", 1], "w": ["w", 2], "e": ["e", 3], "r": ["r", 4], "t": ["t", 5], "y": ["y", 6], "u": ["u", 7],
    "ı": ["ı", 8], "o": ["o", 9], "p": ["p", 10], "a": ["a", 11], "s": ["s", 12], "d": ["d", 13], "f": ["f", 14],
    "g": ["g", 15], "h": ["h", 16], "j": ["j", 17], "k": ["k", 18], "l": ["l", 19], "z": ["z", 20], "x": ["x", 21],
    "c": ["c", 22], "v": ["v", 23], "b": ["b", 24], "n": ["n", 25], "m": ["m", 26]
};

export class GameSettings {  
    public static maxEligibleNumber: number = 10;
    public static playAccessible: boolean = false;
    public static isEligibleNumbers: boolean = true;
    public static betAccessible: boolean = false;
    public static takeWinAccessible: boolean = false;
    public static extraBallStateAccessible: boolean = false;
    public static playStatus: boolean = false;

    public static resolvePlayAccessinble(value: number): void{
        if(value >= 2 && value <= 10) GameSettings.playAccessible = true;
         else GameSettings.playAccessible  =false;
    }

    public static resolvePlayStatus(value: boolean){
        GameSettings.playStatus = value;
    }

    public static resolveBetAccessible(value: number): void{
        if(value >= 2 && value <= 10) GameSettings.betAccessible = true;
        else GameSettings.betAccessible  =false;
    }

    public static resolveEligibleNumbers(value: number): void{
        if(value < 10) GameSettings.isEligibleNumbers = true;
        else GameSettings.isEligibleNumbers  =false;
    }
}
