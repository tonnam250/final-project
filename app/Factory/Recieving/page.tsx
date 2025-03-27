'use client';
export const dynamic = 'force-dynamic';

import Receiving from "./Receiving";
import { Suspense } from 'react';

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Receiving />
        </Suspense>
    );
};
export default Page;
