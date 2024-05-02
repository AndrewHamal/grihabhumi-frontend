import { isArray, isNumber } from "lodash";

function formatNumber(number: any) {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export default function numDifferentiation(value: any) {
    const val = Math.abs(value)
    if (val >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`
    if (val >= 100000) return `${(value / 100000).toFixed(2)} Lac`
    return formatNumber(parseInt(value)?.toFixed(0));
}

export function paramValue(paramValue: any) {
    if (isArray(paramValue)) {
        return paramValue?.map((res: any) => ({ _id: res }))
    }

    if (paramValue) {
        return [{ _id: paramValue }]
    }

    return [];
}


export const bhkList = [
    { id: '1 BHK', name: '1 BHK' },
    { id: '2 BHK', name: '2 BHK' },
    { id: '3 BHK', name: '3 BHK' },
    { id: '4 BHK', name: '4 BHK' },
    { id: '4+ BHK', name: '4+ BHK' },
    { id: 'Duplex', name: 'Duplex' },
    { id: 'Studio', name: 'Studio' },
    { id: 'Penthouse', name: 'Penthouse' },
]

export const furnishingList = [
    { id: 'Full', name: 'Full' },
    { id: 'Semi', name: 'Semi' },
    { id: 'None', name: 'None' }
]

export const availabilityList = [
    { id: 'Immediate', name: 'Immediate' },
    { id: 'Within 15 days', name: 'Within 15 days' },
    { id: 'Within 30 days', name: 'Within 30 days' },
    { id: 'After 30 days', name: 'After 30 days' }
]

export const conditionList = [
    { id: 'Brand New', name: 'Brand New' },
    { id: 'Like New', name: 'Like New' },
    { id: 'Used', name: 'Used' },
]

export const houseList = [
    { id: 'Individual', name: 'Individual' },
    { id: 'Housing', name: 'Housing' },
    { id: 'Colony', name: 'Colony' }
]

export const storageUrl = 'https://fu057peo.a2hosted.com/storage/'
export const apiURL = 'https://fu057peo.a2hosted.com/api/'
