import moment from 'moment'

export function formatRelativeDate(rawDate: number | string | moment.Moment) {
    const today = moment();
    const tomorrow = moment().add(1, 'day');
    const date = moment(rawDate)
    if (date.isSame(today, 'day')) {
        return 'today';
    } else if (date.isSame(tomorrow, 'day')) {
        return 'tomorrow';
    } else {
        return date.format('dddd');
    }
}

export function parseSelectedScheduledDateTime(selectedDate: string, selectedTime: string): moment.Moment | null {
    let date = moment(selectedDate, 'dddd Do');
    const time = moment(selectedTime, 'HH:mm');

    if (selectedDate.includes('today')) {
       date =  moment();
    }  else if (selectedDate.includes('tomorrow')) {
        date = moment().add(1, 'day');
    }


    if (date.isValid() && time.isValid()) {
        date.set({
            hour: time.hour(),
            minute: time.minute(),
            second: 0,
            millisecond: 0,
        });

        return date;
    }

    return null;
}

export function isRestaurantOpen(openingTime: string, closingTime: string): boolean {
    const format = 'HH:mm:ss';
    const formattedOpening = moment(openingTime).format(format)
    const formattedClosing = moment(closingTime).format(format)
    const formattedNow = moment().format(format)
    const now = moment(formattedNow, format)
    const opening = moment(formattedOpening, format)
    const closing = moment(formattedClosing, format)

    return now.isBetween(opening, closing, undefined, '[]');
}
