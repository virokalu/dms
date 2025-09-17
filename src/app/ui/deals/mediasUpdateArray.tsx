import { CreateDealModel, ImageFile, Media, UpdateDealModel } from "@/app/lib/definitions";
import { Box, Button, Stack } from "@mui/material";
import { Control, useFieldArray } from "react-hook-form";
import { DeleteMedia } from "./buttons";
import Notify from "../notify";
import { updateMedia } from "@/app/lib/action";
import { forwardRef, useImperativeHandle } from "react";

// const Image = ["jpg", "jpeg", "png"];
const Video = ["mp4", "avi", "mov", "webm"];


export default forwardRef((props: { nestIndex: number, control: Control<UpdateDealModel, any, UpdateDealModel>, register: any, errors: any, watch: any, setValue: any, setmediaList: any, API: string }, ref) => {
    const { nestIndex, control, register, errors, watch, setValue, setmediaList, API } = props;

    useImperativeHandle(ref, () => ({
        mediaAppend: append,
        mediafields: fields
    }));

// ({ nestIndex, control, register, errors, watch, setValue, setmediaList, API }: { nestIndex: number, control: Control<UpdateDealModel, any, UpdateDealModel>, register: any, errors: any, watch: any, setValue: any, setmediaList: any, API: string }) => {
    const { fields, remove, append } = useFieldArray({
        control,
        name: `hotels.${nestIndex}.medias`
    })

    //HandleMediaDelete
    const handleMediaDeleted = (deletedMediaId: number) => {
        remove(deletedMediaId)
    };

    //HandleImageEdit
    const handleMediaEdit = async (mediaId: string, file: File, mediaIndex: number, field: any) => {
        const imageFile: ImageFile = {
            id: mediaId,
            imageFile: file,
        }
        const res = await updateMedia(watch(`hotels.${nestIndex}.id`), imageFile);
        if (res.type == "success") {
            //window.location.reload();
            // setValue(`image`, URL.createObjectURL(file));

            field.isUpdated = true
            setValue(`hotels.[${nestIndex}].medias.[${mediaIndex}].isUpdated`, true)
            setValue(`hotels.[${nestIndex}].medias.[${mediaIndex}].path`, URL.createObjectURL(file))

        }
        Notify(res.type, res.message);
    };

    return (
        <Box>
            {/* {fields.length == 0 ?

                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button variant="outlined" onClick={() => append(
                        {
                            fieldId: '',
                            mediaFile: null,
                            alt: '',
                            path: '',
                            isVideo: false,
                            isUpdated: true
                        }
                    )}>Add Image</Button>
                    <Button sx={{ ml: 2 }} variant="outlined" onClick={() => append(
                        {
                            fieldId: '',
                            mediaFile: null,
                            alt: '',
                            path: '',
                            isVideo: true,
                            isUpdated: true
                        }
                    )}>Add Video</Button>
                </Box>

                :  */}

            {fields.map((field, index) => {

                // const isImage = Image.includes(field.path.split('.').pop()!)
                if (field.path) {
                    const isVideo = Video.includes(field.path.split('.').pop()!)
                    field.isVideo = isVideo
                }

                return (
                    <Box
                        key={field.id}
                        sx={{
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: '#bdbdbd',
                            padding: 2,
                            // marginBottom: 2,
                            marginTop: 2,
                            gap: '16px'
                        }}>
                        <Stack>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: {
                                    xs: 'column-reverse',
                                    sm: 'row-reverse'
                                },
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <Box sx={{
                                    width: '100%',
                                }}>
                                    <input
                                        className='text_input'
                                        placeholder='Alt...'
                                        {...register(`hotels[${nestIndex}].medias[${index}].alt`, {
                                            required: true,
                                            pattern: /^[A-Za-z\s]+$/i
                                        })}
                                    />

                                    {errors?.hotels?.[nestIndex]?.medias?.[index]?.alt?.type === "required" && (
                                        <p className='error_msg'>Alt is required !</p>
                                    )}
                                    {errors?.hotels?.[nestIndex]?.medias?.[index]?.alt?.type === "pattern" && <p className='error_msg'>Alphabetical characters only !</p>}

                                    {/* Media Buttons */}
                                    <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                                        {watch(`hotels.[${nestIndex}].medias.[${index}].id`) == '0' ? null :
                                            <Box><label htmlFor={`media-update${index}`}>
                                                <Button variant="outlined" component="span">
                                                    Update
                                                    {/* {field.isVideo ? 'Video' : 'Image'} */}
                                                </Button>
                                            </label></Box>
                                        }
                                        <input
                                            type='file'
                                            id={`media-update${index}`}
                                            accept={
                                                field.isVideo ? 'video/*' : 'image/*'
                                            }
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                // TODO: Need to call the Update function
                                                // setValue(`hotels.[${nestIndex}].medias.[${index}].fieldId`, field.id);

                                                const file = e.target.files?.[0]
                                                // setVideoFile(file ?? null);

                                                if (file) {
                                                    // const media: Media = {
                                                    //     fieldId: field.id,
                                                    //     mediaFile: file,
                                                    //     alt: "",
                                                    //     path: "",
                                                    //     isVideo: false
                                                    // }
                                                    handleMediaEdit(watch(`hotels.[${nestIndex}].medias.[${index}].id`), file, index, field)

                                                    // field.isUpdated = true
                                                    // setValue(`hotels.[${nestIndex}].medias.[${index}].isUpdated`, true)
                                                    // // setmediaList((prev: Media[]) => [...prev, media])
                                                    // setValue(`hotels.[${nestIndex}].medias.[${index}].path`, URL.createObjectURL(file))
                                                }
                                            }}
                                        />

                                        <Box sx={{ flex: '1 1 auto' }} />
                                        {/* {index == fields.length - 1 ?
                                        <Button variant="outlined" onClick={() => append(
                                            {
                                                fieldId: '',
                                                mediaFile: null,
                                                alt: '',
                                                path: '',
                                                isVideo: false,
                                                isUpdated: true
                                            }
                                        )}>Add Image</Button> : null}
                                    {index == fields.length - 1 ?
                                        <Button sx={{ ml: 2 }} variant="outlined" onClick={() => append(
                                            {
                                                fieldId: '',
                                                mediaFile: null,
                                                alt: '',
                                                path: '',
                                                isVideo: true,
                                                isUpdated: true
                                            }
                                        )}>Add Video</Button> : null} */}
                                        {fields.length > 1 && watch(`hotels.[${nestIndex}].medias.[${index}].id`) == '0' ?
                                            <Box><Button sx={{ ml: 2 }} variant="outlined" color='warning' onClick={
                                                () => {
                                                    setmediaList((prev: Media[]) => prev.filter((item: Media) => item.fieldId !== field.id))
                                                    remove(index)
                                                }
                                            }>Remove
                                                {/* {field.isVideo ? 'Video' : 'Image'} */}
                                            </Button></Box> : null}
                                        {watch(`hotels.[${nestIndex}].medias.[${index}].id`) != '0' ? <Box>
                                            <DeleteMedia id={watch(`hotels.[${nestIndex}].medias.[${index}].id`)} onDeleted={
                                                () => handleMediaDeleted(index)} hotelId={watch(`hotels.[${nestIndex}].id`)} />
                                        </Box> : null}
                                    </Box>
                                </Box>
                                <Box>
                                    {watch(`hotels.[${nestIndex}].medias.[${index}].path`) ?
                                        <Box sx={{
                                            width: 200,
                                            marginRight: {
                                                sm: 2
                                            }
                                        }}>
                                            {field.isUpdated ?
                                                <Box>{
                                                    !field.isVideo ? <Box>
                                                        <img width={200} src={watch(`hotels.[${nestIndex}].medias.[${index}].path`)} />
                                                    </Box>
                                                    : <Box><video autoPlay width={200} src={watch(`hotels.[${nestIndex}].medias.[${index}].path`)} /></Box>
                                                    }</Box>
                                                : <Box>
                                                    {
                                                        !field.isVideo ? <Box><img width={200} src={`${API}/${watch(`hotels.[${nestIndex}].medias.[${index}].path`)}`} /></Box>
                                                    : <Box><video autoPlay width={200} src={`${API}/${watch(`hotels.[${nestIndex}].medias.[${index}].path`)}`} /></Box>
                                                    }
                                                </Box>
                                            }
                                        </Box>
                                        // : <p>No {field.isVideo ? 'Video' : 'Image'} to View</p>}
                                        : <Box sx={{
                                            width: 200,
                                            marginLeft: {
                                                sm: 2,
                                                xs: 10
                                            },
                                            justifyContent: 'center'
                                        }}>
                                            <label htmlFor="media-upload-update">
                                                <Button variant="outlined" component="span">
                                                    Add {field.isVideo ? 'Video' : 'Image'}
                                                </Button>
                                            </label>
                                            <input
                                                type='file'
                                                id="media-upload-update"
                                                accept={
                                                    field.isVideo ? 'video/*' : 'image/*'
                                                }
                                                style={{ display: 'none' }}
                                                onChange={(e) => {
                                                    setValue(`hotels.[${nestIndex}].medias.[${index}].fieldId`, field.id);

                                                    const file = e.target.files?.[0]
                                                    // setVideoFile(file ?? null);

                                                    if (file) {
                                                        const media: Media = {
                                                            fieldId: field.id,
                                                            mediaFile: file,
                                                            alt: "",
                                                            path: "",
                                                            isVideo: false
                                                        }

                                                        field.isUpdated = true
                                                        setValue(`hotels.[${nestIndex}].medias.[${index}].isUpdated`, true)
                                                        setmediaList((prev: Media[]) => [...prev, media])
                                                        setValue(`hotels.[${nestIndex}].medias.[${index}].path`, URL.createObjectURL(file))
                                                    }
                                                }}
                                            />
                                            {errors?.hotels?.[nestIndex]?.medias?.[index]?.path?.type === "required" && (
                                                <p className='error_msg'>{field.isVideo ? 'Video' : 'Image'} is required !</p>
                                            )}

                                        </Box>
                                    }


                                </Box>
                            </Box>



                            <input
                                hidden
                                {...register(`hotels.[${nestIndex}].medias.[${index}].path`, {
                                    required: true,
                                })}
                            />
                            {/* <input
                                hidden
                                value={field.id}
                                {...register(`hotels.[${nestIndex}].medias.[${index}].fieldId`, {
                                })}
                            />
                            <input
                                hidden
                                value={hotelId}
                                {...register(`hotels.[${nestIndex}].medias.[${index}].hotelId`, {
                                })}
                            /> */}
                        </Stack>
                    </Box>
                )
            })}
        </Box>
    );
});