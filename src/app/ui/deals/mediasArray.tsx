import { Box, Button, Stack } from "@mui/material";
import { watch } from "fs";
import { useFieldArray } from "react-hook-form";

export default ({ nestIndex, control, register, errors, watch, setValue }: { nestIndex: number, control: any, register: any, errors: any, watch: any, setValue: any }) => {
    const { fields, remove, append } = useFieldArray({
        control,
        name: `hotels[${nestIndex}].medias`
    })
    return (
        <>
            {fields.map((field, index) => {
                return (
                    <Box
                        key={field.id}
                        sx={{
                            borderWidth: 1,
                            borderRadius: 5,
                            borderColor: '#bdbdbd',
                            padding: 5,
                            marginBottom: 4,
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

                            {watch(`hotels.[${nestIndex}].medias.[${index}].path`) ? <video autoPlay width={300} src={watch(`hotels.[${nestIndex}].medias.[${index}].path`)} /> : <p>No Video to View</p>}

                            <input type='file'
                                accept='video/*, image/*'
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    // setVideoFile(file ?? null);
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
                            {errors?.hotels?.[nestIndex]?.medias?.[index]?.path?.type === "required" && (
                                <p className='error_msg'>Video is required !</p>
                            )}

                            {/* Media Buttons */}
                            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                                <Box sx={{ flex: '1 1 auto' }} />
                                {index == fields.length - 1 ? <Button variant="outlined" onClick={() => append({

                                    fieldId: '',
                                    mediaFile: null,
                                    alt: '',
                                    path: ''

                                })}>Add Media</Button> : null}
                                {fields.length > 1 ? <Button sx={{ ml: 2 }} variant="outlined" color='warning' onClick={() => remove(index)}>Remove Media {index + 1}</Button> : null}
                            </Box>
                        </Stack>
                    </Box>
                )
            })}
        </>
    );
};