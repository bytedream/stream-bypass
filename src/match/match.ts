import {Match, matches} from "./matches";
import {getAllDisabled, getDisabled} from "../store/store";

export async function getMatch(host: string): Promise<Match | undefined> {
    if (await getAllDisabled()) {
        return undefined
    }

    for (const match of matches) {
        if (match.domains.some(v => host.indexOf(v) !== -1) && !((await getDisabled()).some(v => v === match))) {
            return match
        }
    }
}
