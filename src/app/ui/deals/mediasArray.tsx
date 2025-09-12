import { CreateDealModel, Hotel, Media } from "@/app/lib/definitions";
import { Box, Button, Stack } from "@mui/material";
import { Control, useFieldArray } from "react-hook-form";

export default ({ hotelId, nestIndex, control, register, errors, watch, setValue, setmediaList }: { hotelId:string, nestIndex: number, control: Control<CreateDealModel, any, CreateDealModel>, register: any, errors: any, watch: any, setValue: any, setmediaList: any }) => {
    const { fields, remove, append } = useFieldArray({
        control,
        name: `hotels.${nestIndex}.medias`
    })
    return (
        <Box>
            {fields.map((field, index) => {
                return (
                    <Box
                        key={field.id}
                        sx={{
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: '#bdbdbd',
                            padding: 5,
                            // marginBottom: 2,
                            marginTop:2,
                            gap: '16px'
                        }}>
                        <Stack spacing={4}>
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

                            {watch(`hotels.[${nestIndex}].medias.[${index}].path`) ?
                                <Box>
                                    {
                                        !field.isVideo && <img width={300} src={watch(`hotels.[${nestIndex}].medias.[${index}].path`)} />
                                    }
                                    {
                                        field.isVideo && <video autoPlay width={300} src={watch(`hotels.[${nestIndex}].medias.[${index}].path`)} />
                                    }
                                </Box>
                                : <p>No {field.isVideo ? 'Video' : 'Image'} to View</p>}

                            <input type='file'
                                accept={
                                    field.isVideo ? 'video/*' : 'image/*'
                                }
                                onChange={(e) => {
                                    setValue(`hotels.[${nestIndex}].medias.[${index}].fieldId`, field.id);
                                    
                                    const file = e.target.files?.[0]
                                    // setVideoFile(file ?? null);
                                    const media : Media = {
                                        fieldId: field.id,
                                        mediaFile: file,
                                        alt: "",
                                        path: "",
                                        isVideo: false
                                    }

                                    setmediaList((prev: Media[])=>[...prev, media])

                                    if (file) {
                                        setValue(`hotels.[${nestIndex}].medias.[${index}].path`, URL.createObjectURL(file))
                                    }
                                }}
                            />
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
                            {errors?.hotels?.[nestIndex]?.medias?.[index]?.path?.type === "required" && (
                                <p className='error_msg'>{field.isVideo ? 'Video' : 'Image'} is required !</p>
                            )}

                            {/* Media Buttons */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                                <Box sx={{ flex: '1 1 auto' }} />
                                {index == fields.length - 1 ?
                                    <Button variant="outlined" onClick={() => append(
                                        {
                                            fieldId: '',
                                            mediaFile: null,
                                            alt: '',
                                            path: '',
                                            isVideo: false,
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
                                        }
                                    )}>Add Video</Button> : null}
                                {fields.length > 1 ? <Button sx={{ ml: 2 }} variant="outlined" color='warning' onClick={() => remove(index)}>Remove {field.isVideo ? 'Video' : 'Image'}</Button> : null}
                            </Box>
                        </Stack>
                    </Box>
                )
            })}
        </Box>
    );
};