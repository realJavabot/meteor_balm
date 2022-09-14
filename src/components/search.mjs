export async function search(query){
    if(query.length > 8){
        query = await getOCFromSN(query);
    }
    return ( await fetch('http://10.0.7.170/order/'+query) ).json();
};

export async function getOCFromSN(sn){
    return (await( await fetch('http://10.0.7.170/'+sn) ).json())["order_number"];
}