export default async function search(query){
    if(query.length > 8){
        query = (await( await fetch('http://10.0.7.170/'+query) ).json())["order_number"];
    }
    return ( await fetch('http://10.0.7.170/order/'+query) ).json();
};