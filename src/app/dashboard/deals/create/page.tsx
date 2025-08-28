import TextField from '@mui/material/TextField'
import { Box, Button } from '@mui/material'
import Link from 'next/link';
import { createDeal } from '@/app/lib/action';

export default function Page() {
    return (
        <Box>
            <form action={createDeal}>
                <Box
                    sx={{
                        minWidth: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,

                    }}
                >
                    <TextField
                        id="slug"
                        name='slug'
                        label="Slug"
                        variant="outlined"
                        required

                    />

                    <TextField
                        id="name"
                        name='name'
                        label="Name"
                        variant="outlined"
                        required

                    />

                    <TextField
                        id="video"
                        name='video'
                        label="Video URL"
                        variant="outlined"
                    />
                </Box>
                <Box className='mt-6 flex gap-4'>
                    <Link href={'/dashboard/deals'}>
                        <Button variant="outlined" className='px-4'>Cancel</Button>
                    </Link>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                </Box>
            </form>
        </Box>
    );
}