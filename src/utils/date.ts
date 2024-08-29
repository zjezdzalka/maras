// format for YYYY-MM-DD hh:mm
export default function parseDate(date: string) {
    return new Date(date.replace(" ", "T"))
}