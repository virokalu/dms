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
    imageFile?: File | null | undefined;
    videoFile?: File | null | undefined;
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
}

export type Media ={
    fieldId: string;
    mediaFile: File | null;
    alt: string;
    path: string;
    isVideo: boolean;
}

export type UpdateMedia ={
    id: string;
    fieldId: string;
    mediaFile: File | undefined | null;
    alt: string;
    path: string;
    isVideo: boolean;
    isUpdated: false | true;
}

export type UpdateHotelModel = {
    id:string;
    name: string;
    rate: number;
    amenities: string;
    medias: UpdateMedia[];
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
