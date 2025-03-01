

const TrackingPage = () => {
    return (
        <div className="flex flex-col w-full h-full min-h-screen pt-24">
            <div className="flex w-full h-full justify-center items-center gap-10 px-4 md:px-0 relative">
                <img src="/images/TracingBg_0.png" alt="" className="w-full" />
                <img src="/images/TracingRoute_0.png" alt="image_background" className="absolute top-0 w-full" />
            </div>

            <div className="flex flex-col w-full h-full justify-center items-center">
                <div className="flex w-1/2 h-full justify-center">
                    <div className="flex flex-col w-1/ bg-yellow-100 border-r border-gray-300">
                        <p>Farm</p>
                    </div>
                    <div className="flex flex-col w-full bg-slate-100">

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;