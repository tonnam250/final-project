import Link from "next/link";

const Page = async () => {

    const res = await fetch('http://localhost:3000/data/productData.json');
    const data = await res.json();

    return (
        <div className="flex flex-col items-center min-h-screen pt-20 bg-slate-100">
            <div className="flex flex-col justify-center items-center w-full h-[40vh]">
                <img src="/images/FarmLandscape2.webp" alt="Farm" className="w-full h-full relative object-cover" />
            </div>
            <div className="flex flex-col justify-center items-center w-full h-full mt-10 px-4 md:px-0">
                <h1 className="text-4xl md:text-6xl font-bold">Product</h1>
                <div className="flex justify-center items-center w-full h-full gap-5 mt-10 px-8">
                    <Link href={'/Factory/Product/AddProduct'} className="bg-[#5E929E] text-white font-semibold p-3 w-fit text-xl rounded-full text-center">+ Add</Link>
                </div>

                {/* Product item */}
                <div className="flex flex-col justify-center items-center w-full h-full my-10 gap-8">
                    {data.map((item: { name: string, category: string }, index: number) => (
                        <div key={index} className="flex flex-col justify-center items-center w-full md:w-1/3 h-40 gap-5 bg-white text-slate-500 shadow-xl border rounded-2xl p-5">
                            <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                                <span className="text-xl md:text-2xl font-semibold">Product Name: <p className="font-normal inline">{item.name}</p></span>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between items-center w-full h-1/2">
                                <span className="text-xl md:text-2xl font-semibold">Category: <p className="inline font-normal">{item.category}</p></span>
                                <Link href={`/Factory/Product/Details`} className="text-lg md:text-xl underline italic cursor-pointer mt-2 md:mt-0">More info</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* end Product Item */}
        </div>
    );
}
export default Page;