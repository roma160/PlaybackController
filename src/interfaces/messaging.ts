type PopupMessageExport = {
    data: string,
    type: string
}

export abstract class PopupMessage {
    public getJSON = () => {
        return {
            data: JSON.stringify(this),
            type: this.constructor.name
        };
    }

    public static fromJSON(obj: PopupMessageExport): any{
        let data = JSON.parse(obj.data);
        switch (obj.type){
            case FactorChangeMessage.name:
                return Object.assign(new FactorChangeMessage(), data);
            case SmartSoundMessage.name:
                return Object.assign(new SmartSoundMessage(), data);
        }
        return undefined;
    }
}


export class FactorChangeMessage extends PopupMessage{
    public readonly newFactorVal: number;

    constructor(newFactorVal?: number) {
        super();
        this.newFactorVal = newFactorVal;
    }
}

export class SmartSoundMessage extends PopupMessage{
    public readonly newIsOnVal: boolean;

    constructor(newIsOnVal?: boolean) {
        super();
        this.newIsOnVal = newIsOnVal;
    }
}