import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send';
import Link from "next/link";
import { Box } from '@mui/material';

export default function Home() {
  return (
    <Box className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Box className="flex gap-4 items-center flex-col sm:flex-row">
          <Link href={"/dashboard"}>
            <Button size="large" variant="contained" color="primary" endIcon={<SendIcon />}>
              Continue
            </Button>
          </Link>
        </Box>
      </main>
    </Box>
  );
}
