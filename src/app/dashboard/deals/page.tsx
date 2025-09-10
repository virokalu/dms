import { Deal } from '@/app/lib/definitions';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import { DeleteDeal } from '@/app/ui/deals/buttons';
import { fetchDeals } from '@/app/lib/data';

export default async function Page() {
  const dealsData: Deal[] = await fetchDeals();
  return (
    <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
      }}>
        <Link href={'deals/create'}>
          <Button size="large" variant="contained" color="primary" endIcon={<AddIcon />}>
            Create Deal
          </Button>
        </Link>
      </Box>
      <Box className='mt-5'>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Slug</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                {/* <TableCell><b>Video</b></TableCell> */}
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                dealsData.map((deal) => (
                  <TableRow
                    key={deal.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{deal.slug}</TableCell>
                    <TableCell>{deal.name}</TableCell>
                    {/* <TableCell>{deal.video}</TableCell> */}
                    <TableCell>
                      <Link href={`/dashboard/deals/${deal.slug}/edit`} className="p-2 hover:bg-gray-100">
                        <EditIcon color='primary' />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <DeleteDeal id={deal.id} />
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  )
}