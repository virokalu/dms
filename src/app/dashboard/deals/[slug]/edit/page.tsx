import { fetchDealBySlug } from "@/app/lib/data";
import { UpdateDealModel } from "@/app/lib/definitions";
import EditDeal from "@/app/ui/deals/editDeal";

const API = `${process.env.API_URL}Uploads`;

export default async function Page(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const slug = params.slug;
    const deal: UpdateDealModel = await fetchDealBySlug(slug);
    return (
        <EditDeal sentDeal={deal} API={API}/>
    );
}