const API = new URL(`${process.env.API_URL}`);

export async function fetchDeals() {
  try {
    console.log(`URL ${API}`);
    const res = await fetch(API);
    if(!res.ok){
        const msg = (await res.text()).split('\n').join(',');
        throw new Error(msg);
    }
    const deals = await res.json();
    return deals;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to fetch deals data.");
  }
}
