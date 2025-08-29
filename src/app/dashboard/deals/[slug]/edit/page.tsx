import { fetchDealBySlug } from "@/app/lib/data";
import { Deal } from "@/app/lib/definitions";
import EditDeal from "@/app/ui/deals/editDeal";

export default async function Page(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const slug = params.slug;
    const deal: Deal = await fetchDealBySlug(slug);
    return (
        <EditDeal deal={deal}/>
    );
}