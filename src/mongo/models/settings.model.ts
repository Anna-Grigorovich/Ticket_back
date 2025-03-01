import {SettingsDocument} from "../schemas/settings.schema";

export class SettingsModel {
    serviceFee: number;

    constructor(init?: Partial<SettingsModel>) {
        Object.assign(this, init);
    }

    public static fromDoc(doc: SettingsDocument): SettingsModel {
        if (!doc) return null;
        return new SettingsModel({
            serviceFee: doc.serviceFee,
        })
    }
}