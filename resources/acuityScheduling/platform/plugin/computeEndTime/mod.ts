import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";

export function computeEndTime(startTimeAndDuration: string) {
    let startTime = startTimeAndDuration.split(",")[0];
    let duration = parseInt(startTimeAndDuration.split(",")[1]);

    return moment.parseZone(startTime).add(duration, 'minutes').format();
}