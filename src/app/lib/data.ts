import { Deal } from "./definitions";

const API = new URL(`${process.env.API_URL}`);

export async function fetchDeals() {
  try {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    const res = await fetch(API);
    if(!res.ok){
        const msg = (await res.text()).split('\n').join(',');
        throw new Error(msg);
    }
    const deals: Deal[] = await res.json();
    return deals;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to fetch deals data.");
  }
}

export async function fetchDealBySlug(slug: string) {
  try {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    const res = await fetch(`${API}/${slug}`,{
      method: 'GET',
    });
    if(!res.ok){
        const msg = (await res.text()).split('\n').join(',');
        throw new Error(msg);
    }
    const deal: Deal = await res.json();
    return deal;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to fetch deals data.");
  }
}