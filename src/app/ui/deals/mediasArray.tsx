import { Box, Stack } from "@mui/material";
import { watch } from "fs";
import { useFieldArray } from "react-hook-form";

export default ({ nestIndex, control, register, errors, watch }: { nestIndex: number, control: any, register: any, errors: any, watch:any }) => {
    const { fields, remove, append } = useFieldArray({
        control,
        name: `hotels[${nestIndex}].medias`
    })
    return (
        <>
            {fields.map((field, index) => {
                return (
                    <Box sx={{
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

                            {watch('video.path') ? <video autoPlay width={300} src={watch('video.path')} /> : <p>No Video to View</p>}

                            <input type='file'
                                accept='video/*'
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    // setVideoFile(file ?? null);
                                    // if (file) {
                                    //     setValue('video.path', URL.createObjectURL(file))
                                    // }
                                }}
                            />
                            <input
                                hidden
                                {...register("video.path", {
                                    required: true,
                                })}
                            />
                            {errors?.video?.path?.type === "required" && (
                                <p className='error_msg'>Video is required !</p>
                            )}
                        </Stack>
                    </Box>
                )
            })}
        </>
    );
};