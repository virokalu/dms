import { updateDeal } from "@/app/lib/action";
import { fetchDealBySlug } from "@/app/lib/data";
import { Deal } from "@/app/lib/definitions";
import { Box, Button, TextField } from "@mui/material";
import Link from "next/link";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const slug = params.slug;
    const deal: Deal = await fetchDealBySlug(slug);
    return (
        <div>
            <form action={updateDeal}>
                <Box
                    sx={{
                        minWidth: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,

                    }}
                >
                    <input

                        type="number"
                        hidden
                        readOnly
                        name='id'
                        value={deal.id}
                    />
                    <TextField
                        id="slug"
                        name='slug'
                        label="Slug"
                        variant="outlined"
                        required
                        value={deal.slug}
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }}
                    />

                    <TextField
                        id="name"
                        name='name'
                        label="Name"
                        variant="outlined"
                        required
                        defaultValue={deal.name}
                    />

                    <TextField
                        id="video"
                        name='video'
                        label="Video URL"
                        variant="outlined"
                        defaultValue={deal.video}
                    />
                </Box>
                <div className='mt-6 flex gap-4'>
                    <Link href={'/dashboard/deals'}>
                        <Button variant="outlined" className='px-4'>Cancel</Button>
                    </Link>
                    <Button type="submit" variant="contained" color="primary">
                        Update
                    </Button>
                </div>
            </form>
        </div>
    );
}