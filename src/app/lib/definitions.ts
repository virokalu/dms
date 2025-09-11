export type Deal = {
    id: string;
    slug: string;
    name: string;
    video: string;
}

export type CreateDealModel = {
    slug: string;
    name: string;
    video: Video;
    imageFile: File | null;
    videoFile: File | null;
    image:string;
    hotels: Hotel[];
}

export type Video = {
    alt: string,
    path: string;
}

export type Hotel = {
    name: string;
    rate: number;
    amenities: string;
    medias: Media[];
    fieldId: string;
}

export type Media ={
    fieldId: string;
    mediaFile: File | null;
    alt: string;
    path: string;
}

export type UpdateHotelModel = {
    id:string;
    name: string;
    rate: number;
    amenities: string;
    media: string[];
    mediaFiles: File[];
}
export type UpdateDealModel = {
    id:string;
    slug: string;
    name: string;
    video: Video;
    image: string;
    hotels: UpdateHotelModel[];
}
export type ImageFile = {
    id:string;
    imageFile:File;
}
