import { DealsCalculator } from '@/components/DealsCalculator';

export const metadata = {
    title: 'Deals & Projects | Tawakkal Paint Store',
    description: 'Calculate and explore comprehensive paint packages for your property. Proportional pricing for 80 Gaz to 1000 Gaz properties including Local, Normal, Best, and Premium qualities.',
};

export default function DealsPage() {
    return (
        <div className="min-h-screen bg-off-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy">
                        Deals & Projects Setup
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Select your property size and discover the perfect paint package tailored to your needs.
                        All our deals include premium products and optional professional labour.
                    </p>
                </div>

                {/* Calculator Component */}
                <DealsCalculator />
            </div>
        </div>
    );
}
