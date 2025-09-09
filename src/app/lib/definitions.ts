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
    imageFile: File | null;
    image:string;
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
    image: string;
    hotels: UpdateHotelModel[];
}
export type ImageFile = {
    id:string;
    imageFile:File;
}
