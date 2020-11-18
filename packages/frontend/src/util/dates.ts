const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function formatDate(date: Date | undefined): string | undefined {
    if (typeof date === "undefined") return;
    return `${date?.getDay()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateForCitation(date: Date | undefined): string | undefined {
    if (typeof date === "undefined") return;
    return `(${months[date.getMonth()]} ${date?.getDay()}, ${date.getFullYear()})`;
}