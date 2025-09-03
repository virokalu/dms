import * as yup from 'yup';

export const dealSchema = yup.object().shape({
    slug: yup.string().required('Slug is required'),
    name: yup.string().required('Name is required'),
    video: yup.string().url('Must be a valid URL').required('Video URL is required'),
    hotels: yup.array().of(
        yup.object().shape({
            name: yup.string().required('Hotel name is required'),
            rate: yup.number().typeError('Rate is a number between 0 and 1').min(0).max(1).required('Rate is required'),
            amenities: yup.string().required('Amenities is required'),
        })
    ).min(1, "At least one Hotel required").required(),
});

export type Deal = {
    id: string;
    slug: string;
    name: string;
    video: string;
}

export type CreateDealModel = {
    slug: string;
    name: string;
    video: string;
    hotels: Hotel[];
}
export type Hotel = {
    name: string;
    rate: number;
    amenities: string;
}
export type UpdateHotelModel = {
    id:string;
    name: string;
    rate: number;
    amenities: string;
}
export type UpdateDealModel = {
    id:string;
    slug: string;
    name: string;
    video: string;
    hotels: UpdateHotelModel[];
}
