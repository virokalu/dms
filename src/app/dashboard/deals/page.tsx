'use client'
import { Deal } from '@/app/lib/definitions';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button } from '@mui/material';
import React,
{
  useState,
  useEffect
} from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';

export default function Page() {
  // const API = process.env.API_URL
  // console.log(API)
  // const res = await fetch(API, {
  //   method: 'GET',
  // });
  // const deals = await res.json();
  // console.log(deals)

  // const data = await fetch('https://localhost:7128/api/deal')
  // const posts = await data.json()
  // console.log(posts)

  const [dealsData, setDealData] = useState<Deal[]>([]);

  useEffect(() => {
    fetch('https://localhost:7128/api/deal')
      .then(response => response.json())
      .then(data => setDealData(data));
  }, []);
  console.log(dealsData);

  return (
    <>
      <Link href={'deals/create'}>
        <Button  size="large" variant="contained" color="primary" endIcon={<AddIcon />}>
          Create Deal
        </Button>
      </Link>
      <div className='mt-5'>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Slug</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Video</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                dealsData?.map((deal) => (
                  <TableRow
                    key={deal.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{deal.slug}</TableCell>
                    <TableCell>{deal.name}</TableCell>
                    <TableCell>{deal.video}</TableCell>
                    <TableCell>
                      <Link href={`/dashboard/deals/${deal.slug}/edit`} className="p-2 hover:bg-gray-100">
                        <EditIcon />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <button type="submit" className="p-2 hover:bg-gray-100">
                        <span className="sr-only">Delete</span>
                        <DeleteIcon />
                      </button>

                    </TableCell>

                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
}