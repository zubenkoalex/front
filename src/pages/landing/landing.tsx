import { FC } from "react";
import { ChooseSection, CTASection, FeaturesSection, Footer, Header, ProcessSection, StartSection } from "../../components/Landing";

export const Landing: FC = () => {


    return (
        <div>
            <Header />
            <StartSection />  
            <FeaturesSection />
            <ProcessSection />
            <ChooseSection />
            <CTASection />
            <Footer />
        </div>
    );
};